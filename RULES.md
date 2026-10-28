
MASTER ADMIN CMS
AI AGENT RULES& DEVELOPMENT GUARDRAILS
Mandatory rules for AntiGravity AIVersion 1.0
Read this file before implementation. These rules prioritize security, architecture integrity, real functionality, data safety, and honest verification.

Mission
Build a NEW reusable Master Admin CMS from scratch. Scope is admin UI + API + database only; no public marketing frontend in this phase. Use JavaScript, React/Vite, Node/Express, MongoDB/Mongoose.
Rule 1 — Inspect before modifying
Inspect workspace contents, package manifests, Git status, and existing instructions. Never overwrite existing files or user changes without review. If the workspace is not empty, adapt carefully or ask before replacing.
Rule 2 — Architecture before implementation
Write and maintain INTRODUCTION.md, ARCHITECTURE.md, FEATURE_MATRIX.md, SECURITY.md, and API conventions. Do not start with a giant scaffold of fake pages. Implement one tested vertical slice at a time.
Rule 3 — No fake functionality
Every button, form, menu action, upload, save, filter, and dashboard widget must have a real outcome or be explicitly marked as unavailable. No mock metrics in the production dashboard; no fake success notifications.
Rule 4 — Secure cookie authentication
Use server-side sessions and opaque HttpOnly cookies; Secure in production; SameSite=Lax/Strict based on tested flows; server-side expiry and revocation; regenerate on login; invalidate on logout and security events. Never store credentials/session tokens in localStorage or sessionStorage.
Rule 5 — Authorization at the server
Enforce role/permission checks on every protected API action. UI hiding is not security. Test read/create/update/publish/delete/manage-users/export/settings permissions and prevent privilege escalation.
Rule 6 — Validate all untrusted input
Validate request body, params, query strings, IDs, URLs, slugs, dates, rich text, sort keys, file uploads, and integration callbacks. Use allowlists, length limits, and safe error responses.
Rule 7 — Uploads are untrusted
Enforce size and content-type restrictions on server, validate file signatures where feasible, generate storage names, reject executable content, use safe storage, require permission, and scan/re-encode where practical. Video limit is 35 MB and must be enforced at every relevant layer.
Rule 8 — SEO is a shared capability
Every indexable content module uses the shared SEO panel and fields: title, description, slug, canonical, robots, social metadata/image, and appropriate structured data. SEO defaults must be safely inherited and overrideable.
Rule 9 — Protect secrets and personal data
Use environment/secret management. Commit placeholders only. Never log passwords, session tokens, API keys, SMTP credentials, or unnecessary PII. Public API responses must not expose private settings.
Rule 10 — Preserve data
No automatic database reset, truncate, bulk deletion, or destructive production migration. Use safe migrations/scripts, backups, reversible changes, and explicit approval for destructive operations.
Rule 11 — Stable API contract
Use /api/v1, consistent response/error envelopes, pagination, allowlisted sorting, OpenAPI docs, DTOs/serializers, and explicit public-vs-admin API boundaries.
Rule 12 — Reusable component architecture
Use shared forms, field components, media pickers, SEO panels, tables, status controls, dialogs, toasts, and layouts. Avoid duplicate patterns and over-abstraction.
Rule 13 — Accessible responsive UI
Keyboard support, visible focus, semantic markup, accessible dialogs, responsive tables/forms, adequate contrast, reduced-motion support, and labels for icon-only buttons are mandatory.
Rule 14 — Test negative paths
Test invalid data, unauthenticated, forbidden, not found, conflict, expired sessions, upload rejection, duplicate slugs, CSRF, rate limits, and unpublished content visibility—not only happy paths.
Rule 15 — No unsupported production claims
Use PASS/FAIL/BLOCKED/NOT RUN/UNVERIFIED labels. Do not claim security, browser verification, backups, or production readiness without evidence.
Rule 16 — Dependencies and versions
Use maintained compatible packages and lockfiles. Verify official docs. Avoid unnecessary dependencies and major upgrades. Never expose secrets in terminal output or docs.
Rule 17 — Production operations
Document HTTPS, secure cookies, reverse proxy, Mongo credentials, object storage, backups and restore tests, logging, monitoring, health checks, rate limits, environment separation, and rollback.
Rule 18 — Stop conditions
Ask before replacing an existing project, destructive data changes, changing auth strategy, enabling external paid integrations, or making architecture-wide changes. Continue safe read-only analysis while awaiting approval.
Rule 19 — Final diff and handoff
Review changed files and diff. Report what works, tests actually run, remaining risks, environment prerequisites, and next steps. Keep docs synchronized with implementation.
Rule 20 — Future frontend separation
The CMS must not depend on a specific public frontend. Document stable public read-only APIs and ensure only published content/public settings are exposed. Never expose drafts, contacts, users, sessions, or secrets.