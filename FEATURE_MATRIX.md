# Master Admin CMS - Feature Matrix

Status: Planned | In Progress | Implemented | Tested | Deferred

| Module | Core Features | Public Contract | Permissions | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Authentication** | Server-side sessions, HttpOnly cookie, CSRF, rate limit, password hashing | Safe profile endpoint `/me` | Public login / Authenticated session | Implemented |
| **User & RBAC** | User listing, roles (Super Admin, Admin, Editor, Viewer), permission matrix | None (private) | `users:read`, `users:manage`, `roles:manage` | Implemented |
| **Dashboard** | Real aggregation counts, recent content activity, audit timeline, quick actions | None (private) | `dashboard:read` | Implemented |
| **Site Settings** | Branding (logo, favicon, palette), contact details, social links, footer text | `/api/v1/public/settings` | `settings:read`, `settings:update` | Implemented |
| **Media Library** | Upload files, 35 MB video support, MIME inspection, dimensions, storage key | Public asset URLs | `media:read`, `media:create`, `media:delete` | Implemented |
| **Pages & Blocks** | Title, slug, status, block builder (hero, rich-text, features, CTA), SEO | `/api/v1/public/pages/:slug` | `pages:read`, `pages:create`, `pages:update`, `pages:delete`, `pages:publish` | Implemented |
| **Navigation & Menus** | Header nav, footer columns, parent-child links, ordering, external URLs | `/api/v1/public/navigation` | `menus:read`, `menus:manage` | Implemented |
| **Sliders & Banners** | Images, videos (<=35MB), subtitle, CTA links, sort order, dates | `/api/v1/public/sliders` | `sliders:read`, `sliders:manage` | Implemented |
| **Services** | Title, slug, excerpt, content, category, icon/image, status, SEO | `/api/v1/public/services` | `services:read`, `services:manage` | Implemented |
| **Blog & News** | Title, slug, body, excerpt, author, featured image, tags, publishing, SEO | `/api/v1/public/blogs` | `blogs:read`, `blogs:manage` | Implemented |
| **Testimonials** | Client name, company/role, avatar, rating (1-5), quote, display order | `/api/v1/public/testimonials` | `testimonials:read`, `testimonials:manage` | Implemented |
| **Team Members** | Name, designation, bio, portrait, social links, order | `/api/v1/public/team` | `team:read`, `team:manage` | Implemented |
| **Partners / Clients**| Partner name, logo, website URL, sort order, active state | `/api/v1/public/partners` | `partners:read`, `partners:manage` | Implemented |
| **FAQs** | Question, answer, category, sort order, status | `/api/v1/public/faqs` | `faqs:read`, `faqs:manage` | Implemented |
| **Popups** | Title, banner/image, CTA destination, frequency, status | `/api/v1/public/popups/active`| `popups:read`, `popups:manage` | Implemented |
| **Contact Submissions**| Inbox list, submission details, status (New, Replied, Spam), notes, CSV export| Public submission API | `contacts:read`, `contacts:manage` | Implemented |
| **SEO & Redirects** | Shared SEO meta, canonical, sitemap.xml generator, 301/302 redirects engine | Public redirects & sitemap | `seo:read`, `seo:manage` | Implemented |
| **Careers & Vacancies** | Job vacancies CRUD, deadline enforcement, work mode, salary, requirements, SEO | `/api/v1/public/careers`, `/api/v1/public/careers/:slug` | `careers:read`, `careers:manage` | Implemented |
| **Job Applications** | Candidate applications inbox, review workflows, recruiter notes, timeline, CSV export, private 35MB CV storage & secure downloads | `POST /api/v1/public/careers/:slug/applications` (public submission) | `jobapplications:read`, `jobapplications:manage`, `jobapplications:download_cv` | Implemented |
| **Organization Gallery** | Gallery albums & image management, batch uploads, ordering, categories, lightbox metadata | `/api/v1/public/gallery`, `/api/v1/public/gallery/:slug`, `/api/v1/public/gallery-images` | `gallery:read`, `gallery:manage` | Implemented |
| **Audit Logs** | Immutable event logs, actor, timestamp, action, resource ID, IP | None (private) | `audit:read` | Implemented |
| **System & Health** | DB connection pool status, disk/memory telemetry, uptime | `/api/v1/health` | `system:read` | Implemented |
