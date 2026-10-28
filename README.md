# Master Admin CMS — Universal MERN Control Plane

A high-performance, modular, secure Content Management System and REST API built exclusively on the **MERN Stack** (MongoDB, Express.js, React, Node.js). 

Designed as a decoupled administrative control plane, this CMS manages web content, digital assets (supporting short videos up to 35 MB), SEO, navigation, and user permissions for diverse client websites without being bound to any specific public marketing frontend.

---

## Architecture & Technology Stack

- **Frontend:** React 18 SPA built with Vite, vanilla design tokens, Lucide icons, responsive drawer navigation, and accessible dialogs.
- **Backend:** Node.js v20+ with Express.js REST API under `/api/v1`.
- **Database:** MongoDB 7.0+ with Mongoose schemas, compound indexes, and connection pooling.
- **Authentication:** Server-side sessions persisted in MongoDB (`connect-mongo`), opaque `HttpOnly` session cookies (`SameSite=Lax`), CSRF safeguards, and bcrypt password hashing.
- **Authorization:** Role-Based Access Control (RBAC) enforced server-side on every protected API endpoint.
- **Media Engine:** Multer storage abstraction with MIME validation, non-executable UUID storage filenames, and strict **35 MB** limit for slider/banner videos.

---

## Project Structure

```text
Master-Admin-CMS/
├── client/                     # React Vite Admin SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # MediaPickerModal, SEOPanel, ProfileModal
│   │   │   ├── layout/         # Sidebar, Header, AppLayout
│   │   │   └── ui/             # DataTable, Modal, ConfirmDialog, StatusBadge
│   │   ├── context/            # AuthContext (sessions, toasts, permissions)
│   │   ├── features/           # CMS feature screens (pages, services, blogs, etc.)
│   │   ├── lib/api.js          # Fetch client with credentials and error handling
│   │   ├── index.css           # Token-driven CSS design system
│   │   ├── App.jsx             # Main router & session state coordinator
│   │   └── main.jsx            # Entry point
│   └── package.json
├── server/                     # Node.js Express REST API
│   ├── src/
│   │   ├── config/             # MongoDB connection & session store
│   │   ├── controllers/        # HTTP handlers for all 18 CMS modules
│   │   ├── middleware/         # Auth, RBAC guards, rate limiter, uploads, error handling
│   │   ├── models/             # Mongoose schemas with indexes
│   │   ├── routes/             # Versioned Express modular routes (/api/v1)
│   │   ├── services/           # Audit logger & file handling
│   │   ├── utils/seed.js       # Database seeder (roles, superadmin, initial content)
│   │   ├── app.js              # Express app configuration
│   │   └── server.js           # Server bootstrap
│   ├── tests/
│   │   └── api.test.js         # Integration tests with Supertest
│   ├── uploads/                # Safe local storage for uploaded media
│   └── package.json
├── ARCHITECTURE.md             # System design specification
├── RULES.md                    # Coding standards and development guardrails
├── MASTER_INSTRUCTION_PROMPT.md# Authoritative product requirements
├── FEATURE_MATRIX.md           # Implementation and permission tracking
├── SECURITY.md                 # Threat model and session baseline
├── API_CONVENTIONS.md          # REST response envelopes and status codes
├── README.md                   # Setup, testing, and operations documentation
└── package.json                # Root workflow scripts
```

---

## Getting Started

### Prerequisites

1. **Node.js**: v18.x or v20.x LTS installed.
2. **MongoDB**: Local MongoDB community server (running on port `27017`) or a MongoDB Atlas URI.

### 1. Installation

Install dependencies for both the backend server and frontend client:

```bash
# In server directory
cd server
npm install

# In client directory
cd ../client
npm install
```

### 2. Environment Configuration

The server environment file is configured at `server/.env`. A template is provided in `server/.env.example`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/master_admin_cms
SESSION_SECRET=master_admin_cms_super_secret_session_key_2026_secure
CLIENT_URL=http://localhost:5173
COOKIE_NAME=master_cms_sid
UPLOAD_DIR=uploads
MAX_FILE_SIZE_MB=35
```

### 3. Database Initialization & Seeding

Seed default roles (`superadmin`, `admin`, `editor`, `viewer`), initial settings, navigation menus, and starter content:

```bash
npm run seed --prefix server
```

**Default Initial Administrator Credentials:**
- **Email:** `admin@mastercms.com`
- **Password:** `Admin@123456`
- **Role:** Super Administrator (`*` permissions)

---

## Running the Application

### Start Backend API Server
```bash
npm start --prefix server
# Server starts on http://localhost:5000
# API Base: http://localhost:5000/api/v1
# Health Check: http://localhost:5000/api/health
```

### Start Frontend React Admin Panel
```bash
npm run dev --prefix client
# Vite dev server starts on http://localhost:5173
```

Visit **http://localhost:5173** in your browser. You can click the **"Auto-fill Default Admin Account"** button on the login screen to sign in immediately.

---

## Testing & Quality Assurance

Run the automated integration test suite covering health checks, authentication, session lifecycle, RBAC authorization, CRUD operations, duplicate slug collision rejection, and public contact submissions:

```bash
npm test --prefix server
```

Sample test output:
```text
✔ 1. Public Health Check
✔ 2. Public Safe Settings returns without leaking secrets
✔ 3. Protected endpoint fails without authentication
✔ 4. Login with invalid password fails safely
✔ 5. Login with valid credentials succeeds and returns session cookie
✔ 6. Access authenticated /me endpoint using session cookie
✔ 7. Access Dashboard Stats endpoint with real database data
✔ 8. Pages CRUD workflow
✔ 9. Public Contact Form Submission
✔ 10. Logout and verify session invalidation
```

---

## CMS Modules Included

| Module | Features & Capabilities |
| :--- | :--- |
| **Dashboard** | Real aggregation metrics (pages, blogs, services, contacts), quick actions, and recent audit activity. |
| **Pages & Blocks** | Title, slug, excerpt, placement flags (Header, Footer, Homepage), block builder (Rich Text, Hero CTA, Features Grid), layout, and SEO. |
| **Services** | Title, slug, short description, detailed content, icon/image, category, ordering, and featured flag. |
| **Blog & News** | Article editor, author attribution, category, tags, reading-time calculation, draft/published workflow, and SEO. |
| **Media Library** | Grid and list views, search, type filtering, alt text editor, safe delete reference checks, and 35 MB video support. |
| **Sliders & Banners**| Carousel slide management, image & 35 MB video support, CTA links, and active schedule window. |
| **Testimonials** | Client endorsements, company designation, star ratings (1–5), quote text, and homepage carousel flag. |
| **Team Roster** | Executive and staff profiles, portraits, biography, social links, and display order. |
| **Partners / Clients**| Partner brand logos, website URLs, alt text, and display order. |
| **FAQs** | Categorized accordion Q&A pairs with custom display sequence. |
| **Popups** | Marketing and lead-generation announcement modals with frequency cooldowns. |
| **Contact Submissions**| Message inbox, status management (`new`, `in_progress`, `replied`, `spam`, `archived`), staff notes, and CSV export. |
| **Site Settings** | Branding colors, logo and favicon upload, typography font selector, contact info, and footer text. |
| **Navigation Menus** | Primary header navbar and footer column link builder with ordering and target window options. |
| **SEO & Redirects** | Central SEO completeness audit, missing metadata alerts, score calculation, sitemap generator, and 301/302 redirects. |
| **Users & Roles** | User directory, role assignment (`superadmin`, `admin`, `editor`, `viewer`), password reset, and permissions matrix. |
| **Audit Logs** | Immutable, append-only security activity trail recording actor, IP, timestamp, action, and payload. |
| **System Health** | Real-time database connection status, memory allocation telemetry, and collection document counts. |

---

## Future Frontend Consumer Contract

External consumer frontends (React, Next.js, Vue, or static HTML) consume public, read-only endpoints under `/api/v1/public/...`:

- `GET /api/v1/public/settings` — Safe branding, colors, logos, and contact information.
- `GET /api/v1/public/navigation` — Header and footer navigation menus.
- `GET /api/v1/public/pages/:slug` — Published page content and structured section blocks.
- `GET /api/v1/public/services` — Published services list.
- `GET /api/v1/public/blogs` — Published articles with authors and tags.
- `GET /api/v1/public/sliders` — Active hero slides and video banners.
- `GET /api/v1/public/testimonials` — Published customer endorsements.
- `GET /api/v1/public/team` — Active staff profiles.
- `GET /api/v1/public/partners` — Partner logos and URLs.
- `GET /api/v1/public/faqs` — Published FAQs.
- `GET /api/v1/public/popups/active` — Currently scheduled marketing popups.
- `POST /api/v1/public/contact` — Secure visitor message submission endpoint.
- `GET /api/v1/public/sitemap.xml` — Dynamically generated XML sitemap for SEO crawlers.
