# Environment Variables Reference

## Frontend Environment Variables (`frontend/.env`)
These variables are bundled into the client build:
- `VITE_API_URL`: Public API base path (defaults to `/api/v1/public`).
- `VITE_BACKEND_URL`: Express backend origin (defaults to `http://localhost:5000` in dev).

## Backend Environment Variables (`server/.env`)
Never expose backend secrets to client-side code:
- `PORT`: Backend server port (5000).
- `MONGO_URI`: MongoDB connection string.
- `JWT_SECRET`: Secret key for session cookies.
- `CLIENT_ORIGIN`: Allowed origin for CORS credentials (http://localhost:5173).
