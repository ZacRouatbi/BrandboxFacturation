# Brandbox Facturation Backend

Backend API for internal billing system (Devis & Factures).

Built with:

* NestJS
* Prisma
* MySQL
* JWT (HTTP-only cookies)
* Helmet
* Throttler
* Class Validator

---

# 🚀 Features

## Authentication

* JWT stored in HTTP-only cookie
* Sliding 15min expiry — token re-signed on every authenticated request
* Secure cookie in production
* SameSite strategy based on environment
* Login rate-limited via ThrottlerGuard (applied to AuthController only)
* Logout endpoint clears cookie on both NestJS and Next.js domains

## Security

* Helmet enabled
* Rate limiting scoped to AuthController only (login brute-force protection)
* Global ValidationPipe:

  * whitelist: true
  * forbidNonWhitelisted: true
* Required JWT_SECRET environment variable

---

# 🗄 Database

## Models

* User
* Tier (Client / Fournisseur / Both)
* TierSequence (auto-increment ID per role/month/year)
* Document (Devis / Facture)
* DocumentSequence
* Designation
* DesignationSequence

## Tier ID Format

Auto-generated IDs follow the pattern:

```
{PREFIX}-{MM}-{YY}-{NNN}
```

Examples:
* `CLI-03-26-001` — first client of March 2026
* `FOU-03-26-001` — first fournisseur of March 2026
* `TIE-03-26-001` — first BOTH tier of March 2026

Counter resets every month per prefix.

## Data Integrity

* Cascading deletes on Document → Designation relations
* Unique constraints on sequence tables (prefix, month, year)
* Duplicate M/F (matricule fiscal) check on Tier creation
* NotFoundException on all single-record operations (findOne, update, remove)
* ConflictException on duplicate M/F
* Controlled document status transitions

## Index Optimization

Indexes added for performance on Document:

* `type`
* `(type, devisStatus)`
* `(type, factureStatus)`
* `date`

These optimize:

* Devis listing
* Facture listing
* Status filtering
* Date sorting

---

# 📡 API

## Auth

| Method | Route        | Description                        |
|--------|--------------|------------------------------------|
| POST   | /auth/login  | Login, sets httpOnly cookie        |
| POST   | /auth/logout | Logout, clears cookie              |
| GET    | /auth/me     | Returns current user from JWT      |

## Tiers

| Method | Route       | Query Params                        | Description                        |
|--------|-------------|-------------------------------------|------------------------------------|
| GET    | /tier       | role, page, limit                   | Paginated list with optional filter|
| GET    | /tier/:id   |                                     | Single tier                        |
| POST   | /tier       |                                     | Create tier (auto-generates ID)    |
| PATCH  | /tier/:id   |                                     | Update tier fields                 |
| DELETE | /tier/:id   |                                     | Delete tier                        |

Pagination response shape:

```json
{
  "data": [],
  "total": 0,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

---

# 🧪 Testing

* e2e tests implemented
* Clean Prisma shutdown lifecycle
* Test DB separated from dev DB
* Sequential execution recommended (--runInBand)

---

# ⚙️ Environment Variables

Required:

```
DATABASE_URL=
JWT_SECRET=
NODE_ENV=
```

Production:

* NODE_ENV=production enables secure cookies

---

# 🏗 Development

Run migrations:

```
npx prisma migrate dev
```

Reset database (development only):

```
npx prisma migrate reset
```

Generate Prisma client after schema changes:

```
npx prisma generate
```

Run backend:

```
npm run start:dev
```

Run tests:

```
npm run test
```

---

# 📦 Deployment Notes

* Use `prisma migrate deploy` in production
* Ensure HTTPS for secure cookies
* Configure CORS to frontend domain only
* Set strong JWT_SECRET
* ThrottlerGuard is scoped to AuthController — no need to adjust for dashboard traffic

---

# 🏁 Status

Backend is:

* Structurally stable
* Security hardened (auth-scoped rate limiting)
* Indexed for performance
* Paginated at the database level (skip/take)
* Migration aligned
* Production-ready

Further changes should only be bug fixes or feature extensions.