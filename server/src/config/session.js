import session from 'express-session';
import MongoStore from 'connect-mongo';

export function configureSession() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/master_admin_cms';
  const isProduction =
    process.env.NODE_ENV === 'production' ||
    process.env.RENDER === 'true' ||
    Boolean(process.env.RENDER_SERVICE_ID);
  const secret = process.env.SESSION_SECRET || 'master_admin_cms_super_secret_session_key_2026_secure';
  const cookieName = process.env.COOKIE_NAME || 'master_cms_session';
  const maxAgeDays = Number(process.env.COOKIE_MAX_AGE_DAYS) || 7;
  const cookieSameSite = process.env.COOKIE_SAMESITE || (isProduction ? 'none' : 'lax');

  return session({
    name: cookieName,
    secret: secret,
    resave: false,
    saveUninitialized: false,
    proxy: true, // Express session trusts reverse proxy for secure cookie delivery
    store: MongoStore.create({
      mongoUrl: mongoUri,
      collectionName: 'sessions',
      ttl: maxAgeDays * 24 * 60 * 60, // in seconds
      autoRemove: 'native',
    }),
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: cookieSameSite,
      maxAge: maxAgeDays * 24 * 60 * 60 * 1000, // 24 hours in ms
      path: '/',
    },
  });
}
