# TechKraft Inc — Take‑Home Assessment (Auth + Buyer Portal)

This repo contains a simple full‑stack take‑home task for a buyer portal in a real‑estate app:

- **Server**: Express + Sequelize (Postgres) + JWT auth
- **Client**: Next.js (App Router) buyer portal UI

## Prerequisites

- Node.js (18+ recommended)
- npm
- PostgreSQL

## Quick Start

### 1) Start the server (API)

```bash
cd server
npm install
cp .env.example .env
```

Update `server/.env` with your database config + JWT secret:

```env
DB_NAME=...
DB_USERNAME=...
DB_PASSWORD=...
DB_HOST=localhost
DB_DIALECT=postgres
DB_PORT=5432
SECRET_KEY=your_secret
```

Start the API (defaults to **http://localhost:9000**):

```bash
npm run dev
# or
npm start
```

### 2) Seed dummy property data (IMPORTANT)

The buyer dashboard expects property data to exist in the DB. Seed dummy properties like this:

```bash
cd server
npm run seed:properties
```

To wipe and reseed:

```bash
cd server
npm run seed:properties -- --force
```

### 3) Start the client (Next.js)

```bash
cd client
npm install
npm run dev
```

Client runs at **http://localhost:3000**.

## App Flow (Example)

1. **Sign up**: go to `/signup` and create a user.
2. **Sign in**: go to `/signin` and log in.
   - The client stores the returned JWT in `localStorage` under key `token`.
3. **Dashboard**: `/dashboard`
   - Shows the user’s **name** and **role**.
   - Lists all **Properties**.
   - Lists **My Favourites**.
4. **Add favourite**: click **Add Favourite** on any property.
5. **Remove favourite**: click **Remove** from either list.

## API Endpoints (Server)

Base URL: `http://localhost:9000`

- `POST /users/signup` — register (email + password)
- `POST /users/signin` — login, returns `{ token }`
- `GET /users/me` — get current user (requires `Authorization: Bearer <token>`)

- `GET /properties/all-properties` — list all properties

- `POST /favourites/add` — add a property to favourites (auth)
- `GET /favourites/all` — list my favourites (auth)
- `DELETE /favourites/:id` — remove favourite by favourite id (auth)

## Notes

- Passwords are hashed (bcrypt) before storing.
- JWT verification is enforced on protected routes via middleware.
