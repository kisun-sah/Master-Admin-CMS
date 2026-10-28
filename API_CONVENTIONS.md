# Master Admin CMS - API Conventions & Response Envelope

All API endpoints follow RESTful standards under `/api/v1`.

## Response Envelopes

### Success Envelope
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 48,
    "totalPages": 5
  }
}
```

### Error Envelope
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human readable error description",
    "details": [
      { "field": "slug", "message": "Slug already exists in this scope" }
    ]
  }
}
```

## Standard Status Codes
- `200 OK`: Successful retrieval or mutation
- `201 Created`: Resource successfully created
- `400 Bad Request`: Validation failure or malformed payload
- `401 Unauthorized`: Session missing or expired
- `403 Forbidden`: Insufficient role or permission
- `404 Not Found`: Target resource does not exist
- `409 Conflict`: Unique constraint violation (e.g. duplicate slug or email)
- `422 Unprocessable Entity`: Business logic invariant violation
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Generic safe server error (no stack traces leaked)
