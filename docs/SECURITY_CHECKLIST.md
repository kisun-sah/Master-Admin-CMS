# KBR Digital — Security Checklist

1. **Authentication:**
   - Admin sessions backed by backend-verified HttpOnly cookie authentication (`credentials: 'include'`).
   - Route guard `RequireAdminSession` handles unauthenticated redirects to `/login`.
2. **Access Control (RBAC):**
   - Backend enforces authorization and permissions on every API endpoint.
3. **Data Sanitization:**
   - JSON serialization and controlled inputs prevent XSS.
4. **File Upload Security:**
   - Resume and media uploads restricted by file extension, MIME type, and size limits on the backend.
5. **No Secrets in Client:**
   - Client bundles contain zero database credentials or session signing keys.
