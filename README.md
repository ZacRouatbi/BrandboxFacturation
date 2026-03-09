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
* Nodemailer (OVH SMTP)

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
* Logo hosted via postimg CDN

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

Backend is:

* Structurally stable
* Security hardened (auth-scoped rate limiting, token-based reset)
* Indexed for performance
* Paginated at the database level (skip/take)
* Migration aligned
* Production-ready

Further changes should only be bug fixes or feature extensions.