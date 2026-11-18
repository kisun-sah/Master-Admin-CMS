# KBR Digital — Deployment Runbook

## 1. Local Development
```bash
# Start backend (Express :5000)
npm run dev --prefix server

# Start frontend (Vite :5173)
npm run dev --prefix frontend
```
- Public Website: `http://localhost:5173/`
- Admin CMS Panel: `http://localhost:5173/admin`

## 2. Production Build
```bash
npm run build --prefix frontend
```
Output:
- `dist/index.html` (Public SPA)
- `dist/admin.html` (Admin SPA)
- `dist/assets/` (Independent split JS & CSS bundles)

## 3. Production Same-Domain Rewrite Rules (e.g. Vercel / Nginx)
1. `/api/*` → Proxy to backend service
2. `/uploads/*` → Proxy to media storage / backend
3. `/admin` & `/admin/*` → Rewrite to `/admin.html`
4. `/*` → Rewrite to `/index.html`
