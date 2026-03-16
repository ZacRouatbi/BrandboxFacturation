# Brandbox Facturation

Internal billing system for managing Devis & Factures.

## Stack

### Backend
* NestJS
* Prisma
* MySQL
* JWT (HTTP-only cookies)
* Helmet
* Throttler
* Class Validator
* Nodemailer (OVH SMTP)

### Frontend
* Next.js 15 (App Router)
* TailwindCSS
* TanStack Query (React Query)
* Fully mobile responsive

---

# 🚀 Features

## Authentication

* JWT stored in HTTP-only cookie
* Sliding 15min expiry — token re-signed on every authenticated request
* Secure cookie in production
* SameSite strategy based on environment
* Login rate-limited via ThrottlerGuard (applied to AuthController only)
* Logout endpoint clears cookie on both NestJS and Next.js domains

## Password Reset

* Token-based reset flow — no password change until link is clicked
* Cryptographically secure token via `crypto.randomBytes(32)`
* Token stored hashed with 15min expiry on User model
* One-time use — token cleared immediately after successful reset
* New password auto-generated (10 chars, alphanumeric, no ambiguous chars)
* Reset link sent via branded HTML email (OVH SMTP)
* Username enumeration prevention — always returns 200 regardless of whether user exists

## Security

* Helmet enabled
* Rate limiting scoped to AuthController only:
  * Login: 5 requests / 60s
  * Forgot password: 3 requests / 60s
  * Reset password: 5 requests / 60s
* Global ValidationPipe:
  * whitelist: true
  * forbidNonWhitelisted: true
* Required JWT_SECRET environment variable

---

# 🗄 Database

## Models

* User (with `resetToken` and `resetTokenExpiry` fields)
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

## Document ID Format

### Devis
```
DEV-{MM}-{YYYY}-{NNN}
```
Counter resets every month.

Examples:
* `DEV-03-2026-001` — first devis of March 2026
* `DEV-04-2026-001` — counter resets in April

### Facture
```
FAC-{MM}-{YYYY}-{NNN}
```
Counter is **global per year** — never resets by month.

Examples:
* `FAC-03-2026-001` — first facture of March 2026
* `FAC-04-2026-002` — second facture overall, created in April (no reset)

This ensures facture numbering is always strictly sequential regardless of creation date.

## DocumentSequence Schema

Supports two unique constraint modes:

* `@@unique([prefix, month, year])` — used by Devis (monthly reset)
* `@@unique([prefix, year])` — used by Factures (yearly global counter)

`month` is optional (`Int?`) — facture rows leave it null.

## Data Integrity

* Cascading deletes on Document → Designation relations
* Unique constraints on sequence tables (prefix, month, year)
* Duplicate M/F (matricule fiscal) check on Tier creation
* NotFoundException on all single-record operations (findOne, update, remove)
* ConflictException on duplicate M/F
* BadRequestException on invalid or expired reset token
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

| Method | Route                   | Rate Limit      | Description                                      |
|--------|-------------------------|-----------------|--------------------------------------------------|
| POST   | /auth/login             | 5 / 60s         | Login, sets httpOnly cookie                      |
| POST   | /auth/logout            | —               | Logout, clears cookie                            |
| GET    | /auth/me                | —               | Returns current user from JWT                    |
| POST   | /auth/forgot-password   | 3 / 60s         | Sends reset link email (never reveals if exists) |
| POST   | /auth/reset-password    | 5 / 60s         | Validates token, returns new generated password  |

Reset password response shape:

```json
{
  "newPassword": "Xk7mP2nQvR"
}
```

## Tiers

| Method | Route       | Query Params        | Description                         |
|--------|-------------|---------------------|-------------------------------------|
| GET    | /tier       | role, page, limit   | Paginated list with optional filter |
| GET    | /tier/:id   |                     | Single tier                         |
| POST   | /tier       |                     | Create tier (auto-generates ID)     |
| PATCH  | /tier/:id   |                     | Update tier fields                  |
| DELETE | /tier/:id   |                     | Delete tier                         |

## Documents

| Method | Route                  | Query Params                                                        | Description                              |
|--------|------------------------|---------------------------------------------------------------------|------------------------------------------|
| GET    | /document/stats        | —                                                                   | Dashboard statistics                     |
| GET    | /document              | type, page, limit, dateFrom, dateTo, dueDateFrom, dueDateTo         | Paginated list with filters              |
| GET    | /document/:id          | —                                                                   | Single document with tier + designations |
| POST   | /document              | —                                                                   | Create document + designations           |
| PATCH  | /document/:id          | —                                                                   | Update document fields                   |
| POST   | /document/:id/convert  | —                                                                   | Convert devis → facture                  |
| DELETE | /document/:id          | —                                                                   | Delete document                          |

> ⚠️ `GET /document/stats` must be declared **before** `GET /document/:id` in the controller to avoid NestJS matching `"stats"` as a route param.

### Stats response shape

```json
{
  "ca": 24850.000,
  "totalClients": 38,
  "totalFournisseurs": 14,
  "devisEnAttente": 7,
  "facturesNonPayees": 3,
  "devisAcceptesThisMonth": 12,
  "caTrend": 12,
  "devisTrend": 8,
  "recentActivity": []
}
```

`caTrend` and `devisTrend` are percentage change vs previous month. `null` when no previous month data exists.

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

# 📧 Mailer

* Provider: OVH SMTP (`ssl0.ovh.net:587` STARTTLS)
* Template: Mobile-responsive dark HTML email with Brandbox branding
* Used for: Password reset link delivery only
* Logo served as base64 inline — no external dependency

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
MAIL_USER=
MAIL_PASS=
MAIL_FROM=
FRONTEND_URL=
```

Production:

* NODE_ENV=production enables secure cookies
* FRONTEND_URL should point to your production domain (used in reset links)

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

# 🖥 Frontend Development

Run frontend:

```
npm run dev
```

Build frontend:

```
npm run build
```

Frontend environment variable:

```
FRONTEND_URL=http://localhost:3001
```

---

# 📦 Deployment Notes

* Use `prisma migrate deploy` in production
* Ensure HTTPS for secure cookies
* Configure CORS to frontend domain only
* Set strong JWT_SECRET
* ThrottlerGuard is scoped to AuthController — no need to adjust for dashboard traffic
* Set FRONTEND_URL to production domain so reset links point to the right place
* Ensure OVH SMTP credentials are set and mailbox SMTP access is enabled

---

# 🏁 Status

Project is:

* Fully functional — Devis, Factures, Clients, Fournisseurs, Dashboard
* Fully mobile responsive — all pages, modals, panels and auth screens
* Security hardened — auth-scoped rate limiting, token-based reset, JWT httpOnly cookies
* Indexed for performance — DB-level pagination and query optimization
* Print-ready — Devis and Facture print views
* Migration-ready — migration SQL generated from legacy DB
* Production-ready

Further changes should only be bug fixes or feature extensions.