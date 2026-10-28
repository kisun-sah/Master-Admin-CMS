# Master Admin CMS - Introduction & System Overview

## Purpose
The Master Admin CMS is a modular, multi-purpose administrative platform and REST API built on the MERN stack (MongoDB, Express, React, Node.js). It is designed to administer content, configuration, digital media, navigation, and SEO for diverse client and corporate websites (informational, corporate, service showcase, blogs, portfolios) without coupling the backend to a single presentation frontend.

## Architecture Highlights
- **Decoupled Architecture**: High-security React SPA admin panel communicating via standard `/api/v1` RESTful APIs to an Express backend.
- **Multi-Client Capable**: Separates private administrative operations from public-safe content consumption endpoints (`/api/v1/public/...`).
- **Server-Side Security**: Server-side session authentication with `HttpOnly` cookies, CSRF protection, rate limiting, and strict Role-Based Access Control (RBAC).
- **Comprehensive CMS Modules**:
  1. Identity & Site Settings (Logo, favicon, branding colors, typography, social links, contact info, footer text).
  2. Navigation & Placement (Header menus, footer columns, reordering, nesting).
  3. Content Pages with Block Builder (Rich text, hero CTA, features grid, stats, quotes, FAQ blocks).
  4. Services Management (Categories, ordering, featured flags, SEO).
  5. Blog & News (Authors, tags, publishing workflow, reading time, SEO).
  6. Sliders & Banners (Video up to 35 MB, images, responsive banners, scheduling).
  7. Testimonials & Reviews (Ratings, client quotes, approval status).
  8. Team Profiles (Bios, positions, social links, ordering).
  9. Partners & Clients (Logos, external URLs, display order).
  10. FAQs (Categorized Q&A pairs, sort order).
  11. Interactive Popups (Lead gen, announcement, scheduling, links).
  12. Media Library (Grid/list view, 35 MB video enforcement, mime validation, safe filenames, metadata).
  13. Contact Submissions Inbox (Spam classification, status workflow, notes, export).
  14. SEO & Redirects Engine (Canonicals, Open Graph, robots, sitemap, 301/302 redirects, audit reports).
  15. User & Role Governance (Granular permissions, profile drawer, password reset, session revocation).
  16. Audit Logs (Immutable audit trail of administrative modifications).
  17. System Health & Integrations (DB pool telemetry, SMTP test, storage status, environment configuration).
