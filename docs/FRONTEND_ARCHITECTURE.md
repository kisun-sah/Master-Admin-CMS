# KBR Digital — Frontend Architecture Blueprint

## 1. Architecture Overview
KBR Digital uses a single Vite development server and single production origin hosting two isolated React applications:
- **Public Website:** `http://localhost:5173/` (HTML: `index.html`, Entry: `src/public/main.jsx`)
- **Master Admin CMS:** `http://localhost:5173/admin/*` (HTML: `admin.html`, Entry: `src/admin/main.jsx`)

## 2. Directory Structure
```text
frontend/
├── index.html                         # Public HTML entry
├── admin.html                         # Admin HTML entry (dispatched for /admin/*)
├── package.json                       # One dependency manifest and one dev command
├── vite.config.js                     # One server, port 5173, path dispatch and backend proxy
├── src/
│   ├── public/                        # Public Website application boundary
│   │   ├── main.jsx                   # Public React mount entry
│   │   ├── App.jsx                    # PublicApp root with PublicSiteLayout
│   │   ├── layouts/                   # PublicSiteLayout with ScrollToTop, Navbar, Footer
│   │   ├── pages/                     # Public pages (HomePage, ServicesPage, etc.)
│   │   ├── api/                       # Public API adapter (publicApi.js)
│   │   └── context/                   # Public-only providers (CmsContext, ThemeContext)
│   ├── admin/                         # Admin CMS application boundary
│   │   ├── main.jsx                   # Admin React mount entry (basename="/admin")
│   │   ├── App.jsx                    # AdminApp root with session authentication
│   │   ├── guards/                    # RequireAdminSession route guard
│   │   ├── layouts/                   # AppLayout, Header, Sidebar
│   │   ├── features/                  # 21 CMS feature modules (services, blogs, etc.)
│   │   ├── api/                       # Admin API adapter (adminApi.js)
│   │   └── context/                   # Admin-only providers (AuthContext, SettingsContext)
│   └── shared/                        # App-neutral utilities and HTTP transport
│       └── api/                       # httpClient.js, ApiError.js
```

## 3. Runtime Verification
- Starting local dev: `npm run dev --prefix frontend` (Port: 5173, strictPort: true)
- Building production: `npm run build --prefix frontend`
  - Generates both `dist/index.html` and `dist/admin.html`
  - Completely isolates public bundle (~386kB) and admin bundle (~301kB)
