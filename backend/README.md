## Panzvimbo Backend (Microservices)

This `backend` folder hosts the Node.js + TypeScript microservices for Panzvimbo.

### Services (MVP)

- **api-gateway**
  - Public HTTP entrypoint for the mobile apps.
  - Terminates requests, handles basic auth/JWT verification, and proxies to internal services.
  - Hosts Socket.io for real-time events (bids, location updates, status changes).

- **auth-service**
  - Manages users (client + courier + admin) and authentication.
  - Exposes routes such as `/auth/register`, `/auth/login`, `/auth/me`.
  - Stores users in MongoDB via Mongoose and issues JWTs.

- **delivery-service**
  - Manages deliveries and bids lifecycle.
  - Stores deliveries and bids in MongoDB.
  - Exposes routes like `/deliveries`, `/deliveries/:id`, `/deliveries/:id/bids`.

Each service is an independent Express + TypeScript project with its own `package.json`.

### Folder layout

```text
backend/
  api-gateway/
    package.json
    tsconfig.json
    src/
      index.ts
  auth-service/
    package.json
    tsconfig.json
    src/
      index.ts
      config/
        env.ts
      models/
        User.ts
      routes/
        authRoutes.ts
  delivery-service/
    package.json
    tsconfig.json
    src/
      index.ts
      config/
        env.ts
      models/
        Delivery.ts
        Bid.ts
      routes/
        deliveryRoutes.ts
```

You can run and deploy each service separately. For local development you can use different ports, for example:

- `api-gateway`: `http://localhost:4000`
- `auth-service`: `http://localhost:4001`
- `delivery-service`: `http://localhost:4002`

