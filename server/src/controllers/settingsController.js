import { SiteSettings } from '../models/SiteSettings.js';
import { recordAudit } from '../services/auditService.js';

export async function getSettings(req, res, next) {
  try {
    let settings = await SiteSettings.findOne({ key: 'global' });
    if (!settings) {
      settings = await SiteSettings.create({ key: 'global' });
    }
    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateSettings(req, res, next) {
  try {
    const updates = req.body;
    delete updates.key; // protect singleton key
    delete updates._id;

    let settings = await SiteSettings.findOne({ key: 'global' });
    if (!settings) {
      settings = new SiteSettings({ key: 'global' });
    }

    Object.assign(settings, updates);
    settings.updatedBy = req.user?._id;
    await settings.save();

    await recordAudit(req, {
      action: 'settings.update',
      resourceType: 'SiteSettings',
      resourceId: settings._id,
      details: { siteName: settings.siteName },
    });

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    next(error);
  }
}

export async function getPublicSettings(req, res, next) {
  try {
    let settings = await SiteSettings.findOne({ key: 'global' });
    if (!settings) {
      settings = await SiteSettings.create({ key: 'global' });
    }

    // Public safe view
    res.status(200).json({
      success: true,
      data: {
        siteName: settings.siteName,
        siteTagline: settings.siteTagline,
        logo: settings.logo,
        darkLogo: settings.darkLogo,
        favicon: settings.favicon,
        defaultLanguage: settings.defaultLanguage,
        timezone: settings.timezone,
        contactEmail: settings.contactEmail,
        contactPhone: settings.contactPhone,
        address: settings.address,
        socialLinks: settings.socialLinks,
        footerDescription: settings.footerDescription,
        copyrightText: settings.copyrightText,
        primaryColor: settings.primaryColor,
        secondaryColor: settings.secondaryColor,
        fontFamily: settings.fontFamily,
        seoDefaults: settings.seoDefaults,
      },
    });
  } catch (error) {
    next(error);
  }
}
