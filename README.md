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
* Secure cookie in production
* SameSite strategy based on environment
* Login rate-limited
* Logout endpoint clears cookie properly

## Security

* Helmet enabled
* Global rate limiting (ThrottlerGuard)
* Global ValidationPipe:

  * whitelist: true
  * forbidNonWhitelisted: true
* Required JWT_SECRET environment variable

---

# 🗄 Database

## Models

* User
* Tier (Client / Fournisseur / Both)
* Document (Devis / Facture)
* Designation
* Sequence tables

## Data Integrity

* Cascading deletes on relations
* Unique constraints where required
* Controlled document status transitions

## Index Optimization

Indexes added for performance:

Document:

* type
* (type, devisStatus)
* (type, factureStatus)
* date

These optimize:

* Devis listing
* Facture listing
* Status filtering
* Date sorting

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
* Configure CORS to frontend domain
* Set strong JWT_SECRET

---

# 🏁 Status

Backend is:

* Structurally stable
* Security hardened
* Indexed for performance
* Migration aligned
* Production-ready

Further changes should only be bug fixes or feature extensions.
