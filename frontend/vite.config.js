import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

/**
 * Custom Vite plugin for one-server path dispatch:
 * During development on port 5173:
 * - Rewrites `/admin` and `/admin/*` to `admin.html`
 * - Preserves `/api/*`, `/uploads/*`, `/sitemap.xml`, `/robots.txt` for proxying to Express backend
 * - Serves `index.html` for all public website routes
 */
function adminSpaFallbackPlugin() {
  const middleware = (req, res, next) => {
    const rawUrl = (req.url || '').split('?')[0];
    if (
      (rawUrl === '/admin' || rawUrl.startsWith('/admin/')) &&
      !rawUrl.includes('.') &&
      !rawUrl.startsWith('/api') &&
      !rawUrl.startsWith('/uploads')
    ) {
      req.url = '/admin.html';
    }
    next();
  };

  return {
    name: 'admin-spa-fallback',
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    },
  };
}

export default defineConfig({
  plugins: [react(), adminSpaFallbackPlugin()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/sitemap.xml': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/robots.txt': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin.html'),
      },
    },
  },
});
