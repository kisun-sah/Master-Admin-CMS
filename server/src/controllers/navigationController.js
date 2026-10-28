import { NavigationMenu } from '../models/NavigationMenu.js';
import { recordAudit } from '../services/auditService.js';

export async function listMenus(req, res, next) {
  try {
    const menus = await NavigationMenu.find().sort({ location: 1 });
    res.status(200).json({ success: true, data: menus });
  } catch (error) {
    next(error);
  }
}

export async function getMenuByLocation(req, res, next) {
  try {
    const { location } = req.params;
    let menu = await NavigationMenu.findOne({ location });
    if (!menu) {
      // Default titles
      const titles = {
        header: 'Primary Navigation',
        footer_col_1: 'Footer Company Links',
        footer_col_2: 'Footer Services Links',
        footer_col_3: 'Footer Resources Links',
        legal_links: 'Legal & Privacy Links',
      };
      menu = await NavigationMenu.create({
        location,
        title: titles[location] || `${location} Menu`,
        items: [],
      });
    }

    res.status(200).json({ success: true, data: menu });
  } catch (error) {
    next(error);
  }
}

export async function updateMenu(req, res, next) {
  try {
    const { location } = req.params;
    const { title, items } = req.body;

    let menu = await NavigationMenu.findOne({ location });
    if (!menu) {
      menu = new NavigationMenu({ location });
    }

    if (title) menu.title = title.trim();
    if (items && Array.isArray(items)) {
      menu.items = items;
    }

    await menu.save();

    await recordAudit(req, {
      action: 'navigation.update',
      resourceType: 'NavigationMenu',
      resourceId: menu._id,
      details: { location, itemCount: menu.items.length },
    });

    res.status(200).json({ success: true, data: menu });
  } catch (error) {
    next(error);
  }
}
