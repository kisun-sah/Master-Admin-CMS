# Master Admin CMS - Security Architecture & Threat Model

## Core Principles
1. **Zero Trust API Layer**: Every protected route enforces session validation and RBAC checks server-side.
2. **Server-Side Session Baseline**:
   - Session tokens stored in opaque, signed cookies marked `HttpOnly`, `SameSite=Lax`, and `Secure` (in production).
   - Never expose credentials, session IDs, or tokens to `localStorage` or `sessionStorage`.
   - Automatic session invalidation upon user logout, account status change, or password reset.
3. **Password Security**:
   - High-iteration Bcrypt with salt rounds >= 10 (or Argon2id).
   - Generic error messages for authentication failures to mitigate user enumeration.
4. **Input Sanitization & Injection Prevention**:
   - Express parameter casting & schema validation against MongoDB injection (prevent `$gt`, `$ne` injection).
   - Safe HTML rendering with sanitization to eradicate Cross-Site Scripting (XSS).
5. **Media Upload Hardening**:
   - Strict size verification (hard limit 35MB for videos; 5MB for images).
   - MIME type verification and extension matching.
   - Non-executable storage naming: original filename stripped and replaced with UUIDv4 + sanitized extension.
   - Uploads stored in dedicated media folder and served with safe content headers.
6. **Rate Limiting & Abuse Prevention**:
   - Window-based rate limiting on sensitive auth endpoints (`/api/v1/auth/login`, `/api/v1/public/contacts`).
7. **CSRF Mitigation**:
   - Token-based or double-submit cookie / SameSite header checks for state-mutating requests (POST, PUT, PATCH, DELETE).
8. **Audit Trail**:
   - All critical mutations (login, logout, create, update, delete, role changes, settings updates) append records to an append-only `AuditEvent` log collection.
