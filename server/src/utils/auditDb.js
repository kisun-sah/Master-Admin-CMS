import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Role } from '../models/Role.js';
import { SiteSettings } from '../models/SiteSettings.js';
import { NavigationMenu } from '../models/NavigationMenu.js';
import { Page } from '../models/Page.js';
import { Service } from '../models/Service.js';
import { BlogPost } from '../models/BlogPost.js';
import { Slider } from '../models/Slider.js';
import { Testimonial } from '../models/Testimonial.js';
import { TeamMember } from '../models/TeamMember.js';
import { Partner } from '../models/Partner.js';
import { FAQ } from '../models/FAQ.js';
import { Popup } from '../models/Popup.js';
import { JobVacancy } from '../models/JobVacancy.js';
import { JobApplication } from '../models/JobApplication.js';
import { GalleryAlbum } from '../models/GalleryAlbum.js';
import { GalleryImage } from '../models/GalleryImage.js';
import { MediaAsset } from '../models/MediaAsset.js';
import { AuditEvent } from '../models/AuditEvent.js';
import { Redirect } from '../models/Redirect.js';
import { SeoAuditLog } from '../models/SeoAuditLog.js';

const REQUIRED_MODELS = [
  { name: 'roles', model: Role, required: true },
  { name: 'users', model: User, required: true },
  { name: 'sitesettings', model: SiteSettings, required: true },
  { name: 'navigationmenus', model: NavigationMenu, required: true },
  { name: 'pages', model: Page, required: true },
  { name: 'services', model: Service, required: false },
  { name: 'blogposts', model: BlogPost, required: false },
  { name: 'sliders', model: Slider, required: false },
  { name: 'testimonials', model: Testimonial, required: false },
  { name: 'teammembers', model: TeamMember, required: false },
  { name: 'partners', model: Partner, required: false },
  { name: 'faqs', model: FAQ, required: false },
  { name: 'popups', model: Popup, required: false },
  { name: 'jobvacancies', model: JobVacancy, required: false },
  { name: 'jobapplications', model: JobApplication, required: false },
  { name: 'galleryalbums', model: GalleryAlbum, required: false },
  { name: 'galleryimages', model: GalleryImage, required: false },
  { name: 'mediaassets', model: MediaAsset, required: false },
  { name: 'auditevents', model: AuditEvent, required: false },
  { name: 'redirects', model: Redirect, required: false },
  { name: 'seoauditlogs', model: SeoAuditLog, required: false },
  { name: 'sessions', model: null, required: false },
];

async function runAudit() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('[Audit Error] MONGO_URI is missing in environment.');
    process.exit(1);
  }

  const maskedUri = mongoUri.replace(/:([^@]+)@/, ':****@');
  console.log(`[Audit] Connecting to: ${maskedUri}`);

  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
    console.log(`[Audit] Connected! Target database: ${mongoose.connection.name}`);

    const existingCollections = await mongoose.connection.db.listCollections().toArray();
    const existingNames = new Set(existingCollections.map((c) => c.name.toLowerCase()));

    console.log('\n================ DATABASE AUDIT TABLE ================');
    console.log('| Collection'.padEnd(22) + '| Exists'.padEnd(10) + '| Required'.padEnd(12) + '| Records'.padEnd(11) + '| Status'.padEnd(14) + '|');
    console.log('|' + '-'.repeat(21) + '|' + '-'.repeat(9) + '|' + '-'.repeat(11) + '|' + '-'.repeat(10) + '|' + '-'.repeat(13) + '|');

    for (const item of REQUIRED_MODELS) {
      const exists = existingNames.has(item.name.toLowerCase());
      let count = 0;
      if (exists) {
        count = await mongoose.connection.db.collection(item.name).countDocuments();
      }
      let status = 'OK';
      if (!exists && item.required) status = 'MISSING';
      else if (!exists && !item.required) status = 'EMPTY/OPTIONAL';
      else if (exists && count === 0 && item.required) status = 'EMPTY (REQ)';

      console.log(
        `| ${item.name.padEnd(20)}| ${String(exists).padEnd(8)}| ${String(item.required).padEnd(10)}| ${String(count).padEnd(9)}| ${status.padEnd(12)}|`
      );
    }
    console.log('======================================================\n');

    // Audit Users
    console.log('[Audit] Inspecting Administrator Accounts...');
    const users = await User.find().select('+passwordHash');
    if (users.length === 0) {
      console.warn('[Audit Warning] ⚠️ NO USERS EXIST in the database!');
    } else {
      console.log(`[Audit] Found ${users.length} user(s):`);
      for (const u of users) {
        const hasHash = Boolean(u.passwordHash && u.passwordHash.length > 20);
        const matchesDefault = await u.comparePassword('Admin@123456');
        console.log(`  - Email: ${u.email}`);
        console.log(`    Display Name: ${u.displayName}`);
        console.log(`    Role: ${u.role}`);
        console.log(`    Status: ${u.status}`);
        console.log(`    Has Password Hash: ${hasHash}`);
        console.log(`    Matches 'Admin@123456': ${matchesDefault}`);
        console.log(`    Created: ${u.createdAt}`);
      }
    }

    // Audit Roles
    const roles = await Role.find();
    console.log(`\n[Audit] Found ${roles.length} RBAC role(s): ${roles.map((r) => r.key).join(', ')}`);

    // Audit Settings
    const settings = await SiteSettings.findOne({ key: 'global' });
    console.log(`[Audit] Global Site Settings: ${settings ? `Configured ("${settings.siteName}")` : 'MISSING'}`);

    // Audit Navigation
    const navCount = await NavigationMenu.countDocuments();
    console.log(`[Audit] Navigation Menus: ${navCount} configured`);

    // Audit Pages
    const pagesCount = await Page.countDocuments();
    console.log(`[Audit] Pages & Content Blocks: ${pagesCount} configured`);

  } catch (error) {
    console.error('[Audit Error]', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n[Audit] Disconnected from database.');
  }
}

runAudit();
