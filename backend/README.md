# Agaram Brokers Backend

This backend uses only Node.js built-in modules. It stores website enquiries in `database/enquiries.json`, so it works without installing a separate database server.

## Run Locally

1. Build the frontend:

```bash
npm run build
```

2. Start the backend:

```bash
node backend/server.mjs
```

3. Open:

```text
http://localhost:4000
```

## API Routes

```text
GET  /api/health
GET  /api/services
POST /api/enquiries
GET  /api/enquiries
```

For production, set an admin token before starting the server:

```bash
ADMIN_TOKEN=change-this-token node backend/server.mjs
```

Then read enquiries with the `x-admin-token` header.