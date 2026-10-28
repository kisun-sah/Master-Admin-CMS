import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB } from './config/db.js';
import { seedDatabase } from './utils/seed.js';
import mongoose from 'mongoose';

const PORT = parseInt(process.env.PORT, 10) || 5000;

async function startServer() {
  try {
    await connectDB();
    await seedDatabase();

    let retryCount = 0;
    const maxRetries = 5;

    function listen(port) {
      const server = app.listen(port, () => {
        console.log(`====================================================`);
        console.log(`  Master Admin CMS Backend API running on port ${port}`);
        console.log(`  API Base URL: http://localhost:${port}/api/v1`);
        console.log(`  Health Check: http://localhost:${port}/api/health`);
        console.log(`  Session Cookie: ${process.env.COOKIE_NAME || 'master_cms_session'}`);
        console.log(`====================================================`);
      });

      server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          retryCount++;
          if (retryCount <= maxRetries) {
            console.warn(`[Server] Port ${port} is temporarily in use. Retrying in 1.5s (attempt ${retryCount}/${maxRetries})...`);
            setTimeout(() => {
              server.close();
              listen(port);
            }, 1500);
          } else {
            console.error(`\n❌ [Server Error] Port ${port} is permanently occupied by another process.`);
            console.error(`   To free port ${port} on Windows PowerShell, run:`);
            console.error(`   Stop-Process -Id (Get-NetTCPConnection -LocalPort ${port}).OwningProcess -Force\n`);
            process.exit(1);
          }
        } else {
          console.error('[Server Error] Unhandled network error:', err);
          process.exit(1);
        }
      });

      const shutdown = async () => {
        console.log('\n[Server] Gracefully shutting down...');
        server.close(async () => {
          console.log('[Server] HTTP server closed.');
          try {
            await mongoose.connection.close(false);
            console.log('[Server] MongoDB connection closed.');
          } catch (_) {}
          process.exit(0);
        });
      };

      process.on('SIGTERM', shutdown);
      process.on('SIGINT', shutdown);
    }

    listen(PORT);
  } catch (error) {
    console.error('[Server Error] Startup initialization failed:', error);
    process.exit(1);
  }
}

startServer();

