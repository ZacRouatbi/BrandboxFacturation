# 💼 Full-Stack Billing System

A modern full-stack billing application built with **NestJS**, **Prisma**, and **Next.js App Router**, designed with clean architecture, financial precision, and scalability in mind.

---

## 🧱 Tech Stack

### Backend
- NestJS
- Prisma ORM
- PostgreSQL
- Jest (e2e testing)
- Prisma.Decimal for financial precision
- UUID-based user system

### Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- TanStack Query
- ISR (Incremental Static Regeneration)
- Redis-ready architecture
- Custom JWT authentication (in progress)

---

# 🚀 Backend Overview

The backend is a transactional billing system with strict relational integrity and financial accuracy.

## 📦 Modules

### 👤 User
- UUID primary key
- Unique username
- Password storage (bcrypt-ready)
- Full CRUD
- Duplicate protection
- Fully tested

### 🏢 Tier (Client)
- Full CRUD
- Linked to documents
- Foreign key integrity
- Cascade-ready structure

### 📄 Document (Invoice / Quote)
- Custom generated IDs:
  - `FAC-03-2026-001`
  - `DEV-03-2026-001`
- Supports:
  - FACTURE
  - DEVIS
- VAT support
- Currency handling
- Status management
- Auto financial recalculation
- Transaction-safe operations

### 🧾 Designation (Line Items)
- Monthly sequential ID:
  - `DES-03-2026-001`
- Decimal-safe financial math
- Automatic recalculation of:
  - totalHT
  - TVA
  - totalTTC
- Fully transactional

---

## 🧮 Financial Integrity

- All monetary values use `Prisma.Decimal`
- All create/update/delete operations wrapped in database transactions
- Accurate VAT computation
- Automatic totals synchronization

---

## 🧪 Testing

Comprehensive e2e test suite covering:

- Tier lifecycle
- Document lifecycle
- Designation lifecycle
- User lifecycle
- VAT recalculation logic
- Constraint validation
- Relational safety

All tests passing ✅

---

# ⚡ Frontend Architecture

Built using Next.js App Router with a scalable and secure structure.

## 📁 Folder Structure
- src/
- app/
- (auth)/
- (dashboard)/
- components/
- lib/
- hooks/
- types/
- middleware.ts

### Architecture Principles

- Route groups for logical separation
- Dedicated API abstraction layer
- TanStack Query for server state
- Middleware-ready authentication
- ISR-ready rendering
- Fully customizable authentication UI

---

# 🔐 Authentication (Next Phase)

Planned architecture:

- JWT-based authentication
- HttpOnly cookie storage
- NestJS Auth module
- Next.js middleware route protection
- Custom login UI

---

# 🎯 Project Status

✅ Backend complete  
✅ Full test coverage  
✅ Frontend structured  
🔐 Authentication module next  

