import mongoose from 'mongoose';
import process from 'process';

export async function getSystemHealth(req, res, next) {
  try {
    const mongoState = mongoose.connection.readyState;
    const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };

    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionStats = [];

    for (const col of collections) {
      const count = await mongoose.connection.db.collection(col.name).countDocuments();
      collectionStats.push({ name: col.name, documentCount: count });
    }

    const memoryUsage = process.memoryUsage();

    res.status(200).json({
      success: true,
      data: {
        status: mongoState === 1 ? 'healthy' : 'degraded',
        timestamp: new Date().toISOString(),
        uptimeSeconds: Math.floor(process.uptime()),
        nodeVersion: process.version,
        environment: process.env.NODE_ENV || 'development',
        database: {
          status: states[mongoState] || 'unknown',
          host: mongoose.connection.host,
          name: mongoose.connection.name,
          collections: collectionStats,
        },
        memory: {
          rssMb: Math.round(memoryUsage.rss / 1024 / 1024),
          heapTotalMb: Math.round(memoryUsage.heapTotal / 1024 / 1024),
          heapUsedMb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function generateBackup(req, res, next) {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    const backupData = {
      meta: {
        timestamp: new Date().toISOString(),
        database: mongoose.connection.name,
        systemVersion: '1.0.0',
      },
      collections: {},
    };

    for (const col of collections) {
      if (col.name === 'sessions') continue; // Exclude active session keys
      const docs = await mongoose.connection.db.collection(col.name).find().toArray();
      backupData.collections[col.name] = docs;
    }

    const jsonString = JSON.stringify(backupData, null, 2);
    const dateStr = new Date().toISOString().replace(/[:.]/g, '-');

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="master_cms_backup_${dateStr}.json"`);
    res.status(200).send(jsonString);
  } catch (error) {
    next(error);
  }
}

export async function restoreBackup(req, res, next) {
  try {
    const { backupData } = req.body;
    if (!backupData || typeof backupData !== 'object' || !backupData.collections) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_BACKUP_PAYLOAD', message: 'Backup file must contain valid collections object.' },
      });
    }

    const restoredSummary = {};
    let totalRestored = 0;

    for (const [colName, docs] of Object.entries(backupData.collections)) {
      if (colName === 'sessions' || !Array.isArray(docs)) continue;

      const targetCol = mongoose.connection.db.collection(colName);
      
      // Clean and upsert each document by _id
      for (const doc of docs) {
        if (!doc._id) continue;
        const id = typeof doc._id === 'string' && mongoose.Types.ObjectId.isValid(doc._id) 
          ? new mongoose.Types.ObjectId(doc._id) 
          : doc._id;
        
        const docToSave = { ...doc };
        delete docToSave._id;

        await targetCol.updateOne(
          { _id: id },
          { $set: docToSave },
          { upsert: true }
        );
        totalRestored++;
      }
      restoredSummary[colName] = docs.length;
    }

    // Log the restore event
    const { AuditEvent } = await import('../models/AuditEvent.js');
    await AuditEvent.create({
      actorId: req.user?._id || null,
      actorEmail: req.user?.email || 'admin',
      actorName: req.user?.displayName || 'Administrator',
      action: 'SYSTEM_RESTORE',
      resourceType: 'DATABASE',
      status: 'success',
      details: { totalRestored, summary: restoredSummary },
      ipAddress: req.ip || '',
      userAgent: req.get('user-agent') || '',
    });

    res.status(200).json({
      success: true,
      data: {
        message: `Successfully restored ${totalRestored} documents across ${Object.keys(restoredSummary).length} collections.`,
        summary: restoredSummary,
      },
    });
  } catch (error) {
    next(error);
  }
}


