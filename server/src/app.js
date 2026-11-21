import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import { configureSession } from './config/session.js';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { publicRedirectMiddleware } from './middleware/redirectMiddleware.js';
import { generateRobotsTxt, generateSitemapXml } from './controllers/seoController.js';

const app = express();

// Trust reverse proxy headers (Render, Heroku, Nginx, Cloudflare)
// Crucial for secure session cookies and accurate client IP resolution behind SSL proxies
app.set('trust proxy', 1);

// Security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows flexible dashboard assets
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allows uploaded images/videos to be loaded
  })
);

// CORS configuration with strict production allowlist
const configuredClients = (process.env.CLIENT_URL || '')
  .split(',')
  .map((url) => url.trim().replace(/\/+$/, ''))
  .filter(Boolean);

const defaultAllowedOrigins = [
  'https://kbrdigital.onrender.com',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
];

const allowedOrigins = Array.from(new Set([...configuredClients, ...defaultAllowedOrigins]));

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) {
        return callback(null, true);
      }

      const normalizedOrigin = origin.replace(/\/+$/, '');
      if (allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }

      // Allow localhost dev origins in non-production environments
      if (process.env.NODE_ENV !== 'production') {
        if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(normalizedOrigin)) {
          return callback(null, true);
        }
      }

      return callback(new Error(`Origin ${origin} is not allowed by CORS policy.`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With', 'X-Session-Id'],
  })
);

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Request parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Server-side session with MongoStore
app.use(configureSession());

// Static uploads serving
const uploadDir = path.resolve(process.cwd(), process.env.UPLOAD_DIR || 'uploads');
app.use('/uploads', express.static(uploadDir));

// API health endpoint (public)
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// OpenAPI 3.0 specification & interactive documentation explorer
app.get('/api/v1/openapi.json', (req, res) => {
  const specPath = path.resolve(process.cwd(), 'src/docs/openapi.json');
  if (fs.existsSync(specPath)) {
    res.setHeader('Content-Type', 'application/json');
    res.sendFile(specPath);
  } else {
    res.status(404).json({ error: 'OpenAPI specification not found.' });
  }
});

app.get('/api/docs', (req, res) => {
  res.send(`<!DOCTYPE html>
<html>
<head>
  <title>Master Admin CMS — API Documentation</title>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
  <style>
    body { margin: 0; background: #fafafa; font-family: sans-serif; }
    .topbar { display: none; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    window.onload = () => {
      window.ui = SwaggerUIBundle({
        url: '/api/v1/openapi.json',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [SwaggerUIBundle.presets.apis],
      });
    };
  </script>
</body>
</html>`);
});

// Dynamic robots.txt and sitemap.xml at root level
app.get('/robots.txt', generateRobotsTxt);
app.get('/sitemap.xml', generateSitemapXml);

// Public redirect engine for incoming traffic (301/302 execution)
app.use(publicRedirectMiddleware());

// Mount versioned API routes
app.use('/api/v1', routes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `The requested endpoint '${req.method} ${req.originalUrl}' does not exist.`,
    },
  });
});

// Global Error Handler
app.use(errorHandler);

export default app;
