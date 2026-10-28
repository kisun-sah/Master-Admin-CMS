# Master Admin CMS — Master Instruction Prompt

# 01. Product Vision and Scope
Build a new, reusable, production-oriented Master Admin CMS from scratch. Do not extend or preserve the previous KS Digital/Laravel implementation unless the user separately provides code and asks for migration. The first release is the administration system and API only; do not build a public marketing website or choose a specific public frontend. The CMS must expose documented, secure APIs that multiple future websites can consume.

The system is intended for informative business websites across IT services, agencies, consultancies, manufacturers, travel companies, care providers, professional services, and similar organizations. It is a reusable content platform, not a one-off site. Use configuration and reusable content modules instead of hard-coding one brand or one homepage.

Primary goal: deliver a polished admin interface and working backend flows, not mock screens. Every visible control must have a real outcome, proper validation, loading states, success/error feedback, authorization, and tests. If a feature cannot be completed safely in the current phase, mark it clearly as incomplete rather than pretending it works.

# 02. Technology Stack and Version Policy
Use JavaScript throughout. Recommended baseline:
- Frontend admin: React + Vite, JavaScript, React Router, TanStack Query for server state, React Hook Form plus Zod for forms, Tailwind CSS, and a consistent accessible component system such as shadcn/ui or equivalent.
- Backend: supported Node.js LTS, Express.js, JavaScript ES modules, REST API under /api/v1.
- Database: MongoDB with Mongoose, schema validation, explicit indexes, pagination, and migrations/data scripts where appropriate.
- Authentication: server-side sessions in MongoDB or a dedicated production session store; opaque session identifier in HttpOnly cookies. Do not store authentication tokens in localStorage.
- Media: provider abstraction for local development and object storage in production (for example S3-compatible storage); do not treat a local uploads folder as a production scaling strategy.
- Tests: Vitest or Jest for unit/integration tests, Supertest for API tests, and Playwright for critical browser flows where available.
- Quality: ESLint, Prettier, environment validation, structured logging, API documentation via OpenAPI, and CI checks.

At implementation time, verify current supported versions and compatibility from official documentation. Pin dependencies in lockfiles, avoid deprecated packages, and do not blindly install “latest” versions if they conflict. Do not add TypeScript because the requested language is JavaScript; JSDoc types are encouraged.

# 03. Application Boundaries and Multi-Website Strategy
Separate the admin control plane from any public website. The admin app manages content and configuration; the API serves authorized admin requests and, later, public read-only content endpoints. A future public frontend may be React, Laravel Blade, Next.js, plain HTML, or another framework. It must not require the admin frontend to be embedded in it.

Design for one organization/site per deployment initially, while keeping a clear tenant/site boundary in data models so multi-site support can be added deliberately. Do not claim full multi-tenancy until tenant isolation, authorization, indexes, media paths, cache keys, and tests enforce it. Include a site identifier in content models only if the implementation actually supports and validates it consistently.

The API should return stable JSON envelopes, predictable pagination, validation errors, and resource identifiers. Use slugs and public content identifiers where appropriate, but never expose private fields such as password hashes, session records, internal security notes, or secrets.

# 04. Admin UX and Design System
Create a professional, modern, responsive admin interface with a clear visual hierarchy and reusable components. Suggested design: calm neutral background, white/near-white surfaces, deep navy or charcoal text, one configurable primary brand color, restrained accent color, rounded medium-radius cards, subtle borders, consistent spacing, readable typography, and restrained shadows. Avoid excessive gradients, neon effects, overlarge empty cards, and decorative charts with fabricated data.

Layout: collapsible left sidebar, top bar with current site/workspace, global search, notification area, profile menu, breadcrumbs, page title, contextual primary action, and main content. On mobile, sidebar becomes a drawer and tables/cards remain usable. Include light/dark mode only if it can be implemented consistently and tested.

Build a reusable component library: Button, IconButton, Input, Textarea, Select, Switch, Checkbox, DatePicker, RichTextEditor, MediaPicker, ImageUploader, VideoUploader, SlugField, SEOPanel, StatusBadge, DataTable, Pagination, FilterBar, ConfirmDialog, Drawer, Tabs, EmptyState, ErrorState, Skeleton, Toast, FormSection, and AuditTimeline. Use icons consistently; provide accessible labels and keyboard focus. Never rely on color alone to convey status.

# 05. Information Architecture and Navigation
The sidebar should group functionality rather than display every action as a flat list:
1. Overview: Dashboard.
2. Site Management: Site Identity & Settings, Navigation Menus, Header/Footer, Sliders & Banners, Popups, Global Blocks, Theme/Brand.
3. Content: Pages, Reusable Blocks/Sections, Media Library, Blog/News, Services, Testimonials/Reviews, Team, Partners/Clients, FAQs, Contact Submissions.
4. SEO & Growth: SEO Overview, Redirects, Sitemap/Robots, Structured Data defaults, Social Sharing defaults, Analytics integrations (configuration only).
5. Users & Security: Admins, Users/roles, Roles & Permissions, Sessions, Login/security settings, Audit Log.
6. System: Integrations, Email settings, Storage settings, Backup/export tools, Health/status, API documentation, feature flags.
7. Profile: My Profile, Password, MFA if implemented, Active Sessions, Logout.

Menus can be hidden based on permissions, but hiding UI is not authorization. Backend middleware must enforce every permission. Feature flags must not bypass access checks. Use labels that a non-technical business owner understands.

# 06. Dashboard and Operational Overview
Dashboard must use real database data and provide useful summaries, not hard-coded counts. Include total/published/draft pages, blog posts, services, active banners/sliders, testimonials, pending contact submissions, recent content updates, recent sign-ins/security events, storage usage where available, and SEO completeness indicators. Use date ranges where meaningful.

Dashboard widgets should be configurable: reorder, show/hide, and persist preferences per admin user. Include quick actions such as Create Page, Create Blog Post, Add Service, Upload Media, Add Slider, and Review Contacts, gated by permissions. Each widget links to its underlying filtered view.

Show honest empty states on a fresh installation. Avoid fake charts. If analytics are not connected, label analytics as “Not connected” and provide configuration guidance rather than inventing visitor counts. Protect dashboard queries from unbounded scans and aggregate efficiently.

# 07. Site Identity and Global Settings
Provide editable settings for site name, site tagline, primary logo, dark-mode logo if needed, favicon, default language, timezone, contact email, phone numbers, address, map link, social links, footer description, copyright text, default share image, primary and secondary brand colors, and global font selection from an allowlisted font provider/catalog. Add validation, previews, and a save/publish workflow.

Settings must be versioned or audited. Separate public settings from secret integration settings. API responses intended for public use must never include SMTP passwords, OAuth secrets, API tokens, storage credentials, or internal feature flags. A font or color update should affect future public frontend rendering through a documented settings endpoint/design tokens; the admin can preview the change. Do not promise that a future frontend changes unless that frontend consumes the settings.

Brand colors must validate as safe CSS color values. Google Fonts or other remote fonts must be configured through an allowlist and documented privacy/performance trade-offs. Use sensible defaults and a reset-to-default option.

# 08. Pages and Page Builder
Pages are a core content type. Each page should support title, unique slug, short title/excerpt, body/content blocks, featured image, status (draft, published, scheduled, archived), publish date, author, menu/footer/homepage placement, template/layout selection from a controlled list, canonical URL, and SEO fields.

Use a block-based page builder with a small, well-defined set of reusable block types: rich text, image, image with text, call-to-action, feature grid, stats, logo/partner strip, testimonial quote, FAQ, video/embed (allowlisted providers), contact CTA, and spacer/divider. Each block has a schema, edit form, validation, preview, reorder controls, duplicate, and delete confirmation. Do not store arbitrary executable JavaScript or unsanitized HTML as blocks. Render block data safely in any future frontend.

Include draft preview through signed, expiring preview links or an authenticated preview API. A page marked unpublished must not be exposed by public content endpoints. Ensure duplicate slugs are rejected within the intended site scope. Page deletion should use a safe archive/soft-delete approach where recovery is expected.

# 09. SEO Management at Every Content Level
Every SEO-relevant content type (pages, services, blog posts, categories, team profiles if indexable, and future product-like content) must support SEO title, meta description, canonical URL, robots index/follow controls, social title/description/image, and structured data settings appropriate to the type. Provide a reusable SEO panel and shared validation.

Show character guidance as guidance, not rigid ranking guarantees. Calculate slug suggestions from titles but allow careful manual editing. Detect missing titles/descriptions/images, duplicate slugs, conflicting canonicals, and accidental noindex on published pages. Add an SEO completeness score based on transparent checks.

Provide redirect management with source path, destination, status code (301/302 only as appropriate), active flag, hit count if reliably tracked, and loop detection. Restrict redirects to safe paths or validated URLs to prevent open redirects. Provide sitemap/robots configuration only through safe managed settings; never let ordinary users upload arbitrary server configuration. Add metadata defaults, Open Graph/Twitter tags configuration, and JSON-LD templates for supported types. Do not claim rankings or automatic SEO success.

# 10. Navigation, Header, Footer, and Reusable Blocks
Provide menu management for header/navbar, footer columns, and optional secondary menus. Each menu item supports label, internal page link, approved external URL, parent item, sort order, open-in-new-tab setting, visibility, and optional permission-independent public status. Prevent circular parent relationships and unsafe URL schemes. Use stable identifiers so changing a page title does not break menu links.

Footer configuration should support columns, headings, link lists, contact block, social links, legal links, and copyright. Global reusable blocks may be assigned to locations such as header announcement, footer CTA, contact strip, or homepage section only when the future frontend implements those slots. Include preview and clear “used by” references before deleting a shared block.

# 11. Sliders, Banners, Video, and Popups
Slider/banner entries support title, subtitle, optional CTA label/link, image desktop/mobile variants, alt text, sort order, start/end dates, enabled/disabled state, and optional target placement. Support image, banner, and short video media. User requirement: videos may be up to 35 MB. Enforce the 35 MB limit server-side and client-side, while also validating actual file type, file signature where practical, duration/dimensions limits, and storage policy. Do not trust file extensions or browser MIME type alone.

Use allowlisted formats, generated filenames, malware scanning where available, image re-encoding, video metadata checks, authorization, and storage outside executable web roots. Set explicit limits at reverse proxy, Express multipart middleware, and storage layer. Show upload progress, previews, and actionable errors. If processing/transcoding is not configured, state the accepted formats and do not pretend automatic optimization occurred.

Popups support title, image, target URL, optional description, start/end schedule, frequency/cooldown configuration, enabled state, and accessible close behavior. Validate links and do not permit arbitrary JavaScript. The admin manages the data; display behavior is implemented by each consuming frontend.

# 12. Media Library
Build a central media library with grid/list views, search, type filters, date filters, alt text, title, caption, file size, dimensions, duration for video, uploader, upload date, usage references, and safe replacement behavior. Support multiple upload selection if implemented reliably, drag-and-drop, upload progress, and previews.

Media records must store a stable storage key/provider identifier, not only a machine-local absolute path. Abstract storage so development can use local storage and production can use a private bucket/CDN. Generate signed or public URLs according to asset visibility. Do not expose storage credentials or filesystem paths.

Enforce image/video MIME and signature validation, size limits, safe filenames, and authorization. Prevent deleting assets currently used by pages, logos, banners, or blocks unless the user confirms a replacement/removal plan. Track references where feasible. Provide an orphan-media report rather than automatically deleting unknown files.

# 13. Services and Business Content Modules
Services should support title, slug, short description, rich description/structured blocks, featured image, optional gallery, category, order, status, featured flag, related services, CTA label/link, publish date, and complete SEO fields. The admin can create, read, update, publish/unpublish, archive, and delete according to permissions. Service cards and public display are the responsibility of future frontends consuming the API.

Blog/news supports title, slug, excerpt, body blocks, featured image, author, category, tags, draft/published/scheduled states, related posts, reading-time estimate if calculated, and SEO. Categories and tags need uniqueness rules, safe deletion behavior, and usage checks.

Testimonials/reviews support person name, role/company, quote, optional photo, rating where applicable, source, display order, featured state, approval state, and SEO only if the type is indexable. Team profiles support name, role, biography, photo, social links, order, status, and SEO policy. Partners/clients support name, logo, URL, alt text, order, and visibility. FAQs support question, answer, category, order, status, and optional FAQ structured data where appropriate. All modules need complete CRUD, filtering, pagination, validation, permission checks, and audit events.

# 14. Contact Submissions and Lead Management
Provide an inbox for contact form submissions from connected public sites: name, email, phone, subject, message, source page, submitted timestamp, consent fields if collected, status (new, in progress, replied, spam, archived), internal notes, assignment, and export where authorized. Keep personally identifiable data private and apply a documented retention policy.

The admin should support search, filters, status changes, notes, assignment, safe CSV export, and deletion/retention rules. Protect against spam using rate limits and configurable honeypot/CAPTCHA integration where appropriate. Never store card data or unrelated sensitive information. Public submission endpoints must validate input, rate-limit, normalize fields, and avoid revealing whether a specific email is registered. Email notification failures must be logged safely and must not lose the submission.

# 15. Users, Roles, Permissions, and Admin Security
Implement secure authentication with server-side sessions and an opaque session cookie marked HttpOnly, Secure in production, and SameSite=Lax or Strict based on tested login/SSO needs. Use a session store suitable for production; do not rely on Express's in-memory session store. Never store session IDs, JWTs, refresh tokens, or credentials in localStorage/sessionStorage. Regenerate session ID on login and privilege changes; invalidate sessions server-side on logout, password reset, account disablement, and relevant security events.

Hash passwords with a modern password hashing algorithm supported by maintained libraries (Argon2id preferred where operationally supported; otherwise an appropriate bcrypt configuration). Apply rate limits to login and recovery, generic authentication errors, secure password reset tokens, session expiry, idle timeout, and reauthentication for sensitive operations. Support MFA as a planned/implemented capability with recovery protections; do not label it enabled unless it works.

Create role-based access control with roles such as Owner, Administrator, Editor, Author, SEO Manager, and Support/Inbox Manager as configurable examples. Permissions should be action- and resource-specific (read, create, update, publish, delete, manage settings, manage users, export, view audit log). Enforce permissions in API middleware and service layer, not only in UI. Prevent privilege escalation and self-assignment of privileged roles. Log admin security events without logging passwords or session secrets.

# 16. API Design and Integration Contracts
Use versioned REST endpoints under /api/v1, with a consistent success/error envelope, request validation, pagination, filtering, sorting allowlists, and appropriate HTTP status codes. Publish an OpenAPI specification and keep it synchronized with implementation. Use DTO/serializer functions to avoid leaking database internals. Avoid exposing raw Mongoose documents directly.

Design admin endpoints for dashboard, settings, menus, pages, blocks, media, sliders, popups, services, blogs, testimonials, team, partners, FAQs, contacts, users, roles, audit logs, and integrations. Public read-only endpoints can be added as a separately permissioned API surface for consuming websites. Keep public endpoints limited to published content and explicitly public settings.

Use CORS allowlists, CSRF protection appropriate to cookie-authenticated requests, origin checks where appropriate, and idempotency for operations that may be retried. Never use permissive `*` CORS with credentials. Provide request IDs and safe logs. Avoid returning stack traces or database errors to clients.

# 17. Data Model and MongoDB Rules
Use Mongoose models with explicit field types, required constraints, length limits, enums, timestamps, and indexes. Validate at both API boundary and database/model layer. Add unique indexes for slugs within the correct site scope, email identifiers, setting keys, and other uniqueness requirements. Account for soft-deleted records in uniqueness strategy.

Likely collections include AdminUser, Role, Session (if custom session model), SiteSettings, Page, ContentBlock or embedded page blocks, Menu, MediaAsset, Slider, Popup, Service, BlogPost, Category, Tag, Testimonial, TeamMember, Partner, FAQ, ContactSubmission, Redirect, IntegrationConfig (secrets stored securely), AuditEvent, and optional Site/Tenant. Do not create all collections mechanically; confirm actual feature needs and define relationships intentionally.

Use indexes for common filters and sort orders, pagination that scales, projection of only needed fields, and bounded query parameters. Use transactions only where supported and necessary; do not assume all MongoDB deployments support transactions. Include migrations/seed scripts for schema evolution, not destructive startup resets. Seed only a documented initial owner account via secure setup flow or environment-provided bootstrap mechanism; never ship default production credentials.

# 18. Security, Privacy, and Threat Modeling
Use OWASP principles and Express production security guidance. Apply HTTPS in production, Helmet/security headers, input validation, output encoding, safe rich-text sanitization, request size limits, rate limiting, secure cookies, CSRF defenses, strict CORS, dependency scanning, least privilege, secrets management, safe error handling, and audit logging.

Threat-model authentication/session theft, CSRF, XSS, IDOR/BOLA, privilege escalation, injection, malicious file uploads, open redirects, SSRF through integrations, brute force, data export abuse, and leaked secrets. Rich text must be sanitized with a maintained sanitizer and a constrained allowlist. External URL fetches must be disabled or allowlisted to prevent SSRF. Do not execute uploaded files.

Keep secrets in environment/secret management; commit only `.env.example` with placeholders. Validate required environment variables at startup. Redact credentials and PII from logs. Backups must be encrypted, access controlled, and restore-tested. A production-ready claim requires deployment-specific configuration and review; source code alone cannot guarantee production security.

# 19. Audit Logs, Version History, and Publishing Workflow
Record meaningful changes: actor, action, resource type/id, timestamp, request ID, and safe before/after summaries. Never include passwords, raw session tokens, API secrets, or full sensitive contact messages in audit logs. Restrict audit log access and make records tamper-resistant to ordinary admins.

For core content, support draft and published states, preview, scheduled publish where a scheduler is configured, and revision history or snapshots for recovery. Publishing must be explicit; autosave must not silently publish. Provide confirmation for destructive actions and a recovery path through soft delete or revisions where appropriate. Record who published and when. Scheduled jobs must be observable, retry safely, and avoid duplicate actions.

# 20. SEO and Content Quality Operations
Create a central SEO overview that identifies pages missing title/description, duplicate slugs, missing alt text, absent social images, invalid canonical URLs, published content marked noindex, broken internal links where crawl capability exists, and redirect loops. Include filters, severity, and direct links to edit records. Do not claim to crawl the public site until a crawler is implemented and configured.

SEO defaults belong in Site Settings, but each content item can override them. Resolve metadata deterministically: item override first, then content-type defaults, then site defaults. Canonicals must be validated; noindex/no-follow settings must be explicit. Generate XML sitemap output only from published/indexable content and include stable canonical URLs. Keep robots.txt management safe and prevent accidental blocking of the entire site with a prominent warning.

# 21. Integrations, Email, Analytics, and Notifications
Build an integrations registry for SMTP/email provider, analytics IDs, map link, video provider embeds, storage provider, and optional CAPTCHA. Store credentials in secret configuration, never in public settings. Show connection status only after a real test; never simulate a successful connection.

Email features include password reset, contact notifications, and administrative alerts with templates, test-send workflow, delivery/error logs, retry policy, and rate limiting. Do not send test messages without an explicit user action. Analytics should be configuration-only unless event collection and privacy disclosures are actually implemented. Use opt-in/consent handling where required by the deployment context.

# 22. Performance, Reliability, and Operations
Use pagination and indexed queries, avoid N+1 patterns, compress responses where appropriate, cache only with clear invalidation, and use a queue for slow jobs such as email, media processing, exports, and scheduled publishing. Provide health/readiness endpoints that reveal no secrets. Use graceful shutdown and structured logs with request IDs.

Production operations should document Node version, process manager/container runtime, reverse proxy/TLS, environment variables, MongoDB connection policy, object storage, backups, log retention, monitoring, rate limits, and restore procedures. Avoid deploying with debug mode enabled. Include error monitoring integration only when configured. Keep separate development, test, and production environments.

# 23. Testing and Definition of Done
Every feature must include tests at the level appropriate to its risk: validation/model unit tests, API integration tests, permission tests, and critical UI flows. Test success, invalid input, unauthorized, forbidden, not found, conflict, rate limit, and failure states. Test role boundaries and ensure unpublished content is not returned publicly.

Core acceptance tests include: owner bootstrap, login/logout, session expiry, permission denial, page CRUD and publish/unpublish, block reorder, unique slug, SEO metadata persistence, media size/MIME rejection, 35 MB video boundary, slider scheduling, popup link validation, service CRUD, blog publishing, contact inbox workflow, user/role management, settings save/preview, audit logs, pagination, and API docs. Browser tests should verify no dead buttons and no console-breaking errors on primary flows.

Definition of done: code implemented, validations in place, permission enforced server-side, tests pass or failures are documented, migrations/seed changes are safe, docs updated, final diff reviewed, and no known critical issue hidden. Never claim tests ran unless command output confirms it.

# 24. Development Phases and Agent Workflow
Phase 0 — Repository/workspace check: confirm the target folder and whether it is truly a new project. Do not overwrite an existing project without approval.
Phase 1 — Architecture plan: create README.md, INTRODUCTION.md, RULES.md, ARCHITECTURE.md, FEATURE_MATRIX.md, SECURITY.md, and API conventions before implementation.
Phase 2 — Foundation: monorepo or clearly separated admin/backend apps, environment validation, lint/format, logging, error handling, Mongo connection, health endpoint, and test runner.
Phase 3 — Auth/security: bootstrap owner, cookie sessions, CSRF, rate limits, RBAC, audit events.
Phase 4 — Admin shell/design system and real dashboard.
Phase 5 — Site settings, media library, menus, header/footer, sliders, banners, video, popups.
Phase 6 — Pages and block builder, SEO panel, publishing/revisions.
Phase 7 — Services, blogs, testimonials, team, partners, FAQs, redirects.
Phase 8 — Contact inbox, users/roles, integrations.
Phase 9 — SEO overview, OpenAPI, operational documentation.
Phase 10 — Regression, security review, accessibility, responsive UI, deployment readiness checklist.

After each phase, report files changed, tests run, risks, and next phase. Do not scaffold every feature as a fake placeholder and call the product complete. Implement vertical slices end-to-end.

# 25. Deployment, Environment, and Release Controls
Provide `.env.example` with documented variable names and safe placeholders. Validate configuration at startup and fail clearly if required secrets are absent. Never commit real credentials. Document allowed origins, cookie settings, session lifetime, MongoDB URI, storage settings, email provider, logging level, and bootstrap strategy.

Production must use HTTPS, secure cookie settings, strong unique secrets, least-privilege database credentials, restricted CORS, non-debug errors, dependency review, backups, monitoring, and a deployment-specific smoke test. Do not run destructive seeders or schema resets automatically on production startup. Provide a staging environment and a rollback plan. The admin panel should be behind strong authentication and optionally IP/network restrictions where operationally appropriate.

# 26. Accessibility, Localization, and Business Reuse
Use semantic HTML, keyboard navigation, visible focus, accessible labels, screen-reader status messages, sufficient contrast, reduced-motion support, and accessible dialog behavior. Tables should have clear headers and responsive alternatives. Avoid icon-only actions without accessible names.

Keep content fields flexible enough for different industries without creating confusing overgeneralization. Use configurable labels where truly useful, but do not turn every label into a setting. Store dates in UTC and display according to site timezone. Plan for UTF-8 and multilingual content; implement full locale-specific slugs and translation workflows only if scoped and tested. Never assume the admin and public frontend share the same deployment origin.

# 27. Feature Matrix and Future-Frontend Contract
For each module, document fields, CRUD endpoints, permission keys, public visibility rules, SEO behavior, media dependencies, audit events, tests, and any future frontend contract. Maintain a feature matrix with status: Planned, In Progress, Implemented, Tested, or Deferred.

The future frontend contract should define: public settings endpoint; published page content endpoint; page block schema; menu/header/footer endpoint; slider/banner endpoint; popup endpoint; service/blog/testimonial/team/partner/FAQ endpoints; media URL behavior; SEO metadata shape; redirects; and caching/versioning expectations. Public endpoints must never leak drafts, private contact submissions, admin users, or secrets.

Do not build a specific public website in this phase. A local API explorer or test fixture is acceptable for backend verification, but it must not become a public frontend deliverable. Future clients should consume stable documented APIs.

# 28. Final Master Prompt to AntiGravity
You are the lead product architect, senior MERN engineer, security engineer, UX designer, QA engineer, and technical writer for a NEW Master Admin CMS. Build from scratch using JavaScript, React/Vite for the admin interface, Node.js/Express for the API, and MongoDB/Mongoose for persistence. Do not build the public-facing website in this phase. The admin and API must be reusable by many future informative business websites.

Before coding, read RULES.md, ARCHITECTURE.md, INTRODUCTION.md, FEATURE_MATRIX.md, and SECURITY.md if present. Inspect the workspace and confirm whether it is empty or contains work. Never overwrite existing files without inspecting and obtaining approval when necessary. Verify current supported dependency versions from official documentation.

First produce the architecture plan and feature matrix. Then implement in vertical slices: foundation and secure auth; admin shell/dashboard; site settings and media; menus, sliders, banners, videos (35 MB maximum), popups; pages and reusable blocks; SEO on every content type; services/blogs/testimonials/team/partners/FAQs; contact inbox; user/role management; audit logs; integrations; OpenAPI; tests and deployment docs.

Every feature must work end-to-end. No dead buttons, fake metrics, hard-coded success states, insecure placeholders, or UI-only permissions. Use server-side session authentication with HttpOnly cookies (Secure in production, SameSite appropriately configured), server-side expiration/revocation, CSRF protection, rate limiting, secure password hashing, RBAC, input validation, safe file handling, sanitized rich text, audit logs, and secret-safe configuration. Do not put credentials in browser storage.

Use reusable, accessible UI components and a polished responsive design. All content modules need proper CRUD, search/filter/pagination, status workflows, validation, authorization, SEO metadata, and tests where relevant. Keep media storage abstracted for production. Ensure the API is versioned and documented. Do not claim multi-tenant support unless isolation is implemented and tested.

Work in phases, report evidence and test results honestly, and stop before destructive or irreversible operations. At each milestone, list files changed, working features, tests executed, failures, blockers, and next steps. Never call a feature production-ready merely because the interface exists. Finish with a clear acceptance matrix and deployment checklist.
