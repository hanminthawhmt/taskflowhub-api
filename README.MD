# Task Management API (Node.js)

A multi-tenant SaaS task management backend as a portfolio project to demonstrate backend architecture, authentication, RBAC, billing integration, and containerization skills.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Option A: Run with Docker (recommended)](#option-a-run-with-docker-recommended)
  - [Option B: Run locally without Docker](#option-b-run-locally-without-docker)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Authentication & Authorization](#authentication--authorization)
- [Billing (Stripe)](#billing-stripe)
- [Email (Mailtrap)](#email-mailtrap)
- [Seeding the Database](#seeding-the-database)
- [Testing the API](#testing-the-api)
- [Roadmap](#roadmap)

---

## Overview

This API powers a multi-tenant SaaS platform where:

- Users register and automatically become the **Owner** of a new **Company**
- Companies can have multiple **Projects**
- Projects have their own **Tasks**, assignable to members
- Access is controlled through a full **Role-Based Access Control (RBAC)** system, scoped independently at both the company and project level
- Members are added to companies and projects either directly or via **email invitations**
- Companies subscribe to **Plans** with usage limits (e.g. max projects), billed through **Stripe**
- A platform-level **super admin** role exists for cross-tenant administration

## Features

- **Authentication** — JWT-based auth, registration (with automatic company + Owner role creation), login, password hashing via bcrypt
- **Multi-tenant RBAC** — independent role/permission scopes for `company` and `project`, enforced through composable Express middleware
- **Company & Project management** — creation, membership, settings
- **Email invitations** — token-based invite flow for both companies and projects, supporting both existing users and brand-new signups, sent via Mailtrap
- **Task management** — creation, assignment, status tracking, ownership-based update permissions
- **Billing** — Stripe Checkout integration with webhook-driven subscription state, plan-based project limits
- **Activity logging** — audit trail for key actions (task/project/company events), surfaced for dashboards
- **Super admin tooling** — platform-level permission management and admin promotion, isolated from tenant-scoped RBAC
- **Input validation** — Zod schemas on every mutating endpoint
- **Centralized error handling** — consistent JSON error responses across the API
- **Dockerized** — one-command local setup via Docker Compose (app + MySQL)
- **API documentation** — Swagger/OpenAPI docs

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 22 |
| Framework | Express |
| ORM | Prisma 7 (driver adapter: `@prisma/adapter-mariadb`) |
| Database | MySQL 8.4 |
| Auth | JWT (`jsonwebtoken`), `bcrypt` |
| Validation | Zod |
| Email | Nodemailer + Mailtrap |
| Payments | Stripe (Checkout + Webhooks) |
| Containerization | Docker, Docker Compose |
| API Docs | Swagger / OpenAPI |

## Architecture

The codebase follows a **modular, layered architecture**, with each domain (`auth`, `company`, `project`, `task`, `role`, `permission`, `billing`, `activity_log`, `admin`) organized as a self-contained module:

```
route.js        → defines endpoints and middleware chains
validation.js   → Zod schemas for request bodies
controller.js   → parses req/res, delegates to service, forwards errors via next()
service.js      → business logic, orchestration, transactions
repository.js   → all direct Prisma/database access
```

**Key architectural decisions:**

- **Separation of authentication and user management** — `auth` handles login/register/tokens; `users`-related data access lives in its own concern.
- **Transactions for multi-step writes** — e.g. registering a user also creates their company and an Owner membership row atomically, so a partial failure never leaves orphaned data.
- **Authorization as composable middleware** — `authenticate` → `checkCompanyMember` / `checkProjectMember` → `requirePermission(...)` → `validate(schema)` → controller. Each middleware has a single responsibility and is reused across routes.
- **RBAC backed by real database relationships** — `roles`, `permissions`, and `role_permissions` tables drive authorization checks, rather than hardcoded role checks in code.
- **Global centralized error handling** — services throw a custom `AppError(message, statusCode)`; a single Express error-handling middleware formats all error responses consistently.
- **Webhook-driven billing state** — subscription/payment state is only ever written to the database after Stripe confirms it via webhook, never optimistically on the client-facing checkout response.

## Project Structure

```
task-management-node/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seeds/
├── src/
│   ├── config/           # env, db (Prisma client), stripe client, Swagger config
│   ├── generated/prisma/  # generated Prisma client (gitignored)
│   ├── middleware/        # authenticate, RBAC checks, validation, error handler
│   ├── modules/
│   │   ├── auth/
│   │   ├── company/
│   │   ├── project/
│   │   ├── task/
│   │   ├── role/
│   │   ├── permission/
│   │   ├── billing/
│   │   ├── activity_log/
│   │   └── admin/
│   ├── routes/            # top-level route aggregation
│   ├── services/           # cross-cutting services (mailer, email templates)
│   ├── util/               # AppError, token generation helpers
│   └── app.js
├── docker-compose.yml
├── Dockerfile
├── .dockerignore
├── .env.example
└── index.js
```

## Getting Started

### Option A: Run with Docker (recommended)

This spins up the API **and** a MySQL database together — no local MySQL installation required.

**Prerequisites:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

```bash
# 1. Clone the repo
git clone https://github.com/hanminthawhmt/task-management-node.git
cd task-management-node

# 2. Copy the example env file and fill in your own values
cp .env.example .env

# 3. Build and start everything (app + MySQL)
docker compose up --build

# 4. In a separate terminal, seed the database
docker compose exec app npx prisma db seed
```

The API will be available at `http://localhost:3000`.

To stop everything:
```bash
docker compose down
```

To stop and wipe the database volume (fresh start):
```bash
docker compose down -v
```

### Option B: Run locally without Docker

**Prerequisites:** Node.js 22+, a running MySQL 8.4 instance.

```bash
# 1. Clone and install dependencies
git clone https://github.com/hanminthawhmt/task-management-node.git
cd task-management-node
npm install

# 2. Configure environment
cp .env.example .env
# edit .env with your local MySQL connection string and other secrets

# 3. Generate the Prisma client
npx prisma generate

# 4. Run migrations
npx prisma migrate deploy

# 5. Seed the database
npx prisma db seed

# 6. Start the dev server
npm run dev
```

## Environment Variables

See `.env.example` for the full list. Key variables:

| Variable | Description |
|---|---|
| `PORT` | Express server port (typically `3000`) |
| `DATABASE_URL` | MySQL connection string |
| `JWT_SECRET` | Secret used to sign auth tokens |
| `JWT_EXPIRES_IN` | Token lifetime (e.g. `7d`) |
| `MAILTRAP_HOST` / `MAILTRAP_PORT` / `MAILTRAP_USER` / `MAILTRAP_PASS` | Mailtrap SMTP credentials for invitation emails |
| `MAIL_FROM` | From address used on outgoing email |
| `STRIPE_SECRET_KEY` | Stripe API secret key (test mode) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `SUPERADMIN_EMAIL` / `SUPERADMIN_PASSWORD` / `SUPERADMIN_NAME` | Used by the super admin bootstrap seed |
| `MYSQL_ROOT_PASSWORD` / `MYSQL_DATABASE` | Used by the Docker Compose MySQL service |

## Database Schema

The schema models a multi-tenant SaaS domain: `users`, `companies`, `projects`, `tasks`, `roles`, `permissions`, `role_permissions`, `company_members`, `project_members`, `company_invitations`, `project_invitations`, `plans`, `subscriptions`, `subscription_items`, and `activity_logs`.

Full schema definition: [`prisma/schema.prisma`](./prisma/schema.prisma)

## API Documentation

Full endpoint documentation is available via Swagger/OpenAPI.

- Swagger UI: `http://localhost:3000/api/v1/docs`
- OpenAPI JSON: `http://localhost:3000/api/v1/docs.json`

## Authentication & Authorization

**Authentication** uses JWTs issued on register/login, verified via an `authenticate` middleware on protected routes.

**Authorization** is layered:

1. `authenticate` — confirms the requester's identity
2. `checkCompanyMember` / `checkProjectMember` — confirms tenant membership, attaches role context to the request
3. `requirePermission("permission_name")` — checks the member's role against the `role_permissions` table for a specific capability
4. Ownership checks in the service layer where relevant (e.g. a task can only be marked complete by its assignee)

A separate `requireSuperAdmin` middleware gates platform-level admin routes, independent of the tenant RBAC system.

## Billing (Stripe)

- Companies are created on a default **Free** plan
- Upgrading creates a Stripe Checkout Session (`POST /api/v1/billing/:companyId/checkout`)
- Subscription state is only written to the database via a **webhook handler** (`POST /api/v1/billing/webhook`) after Stripe confirms payment — never optimistically
- A `checkProjectLimit` middleware enforces each plan's `max_projects` cap
- A `checkSubscriptionActive` middleware blocks project creation if a company's subscription isn't in good standing

Test locally with the [Stripe CLI](https://stripe.com/docs/stripe-cli):
```bash
stripe listen --forward-to localhost:3000/api/v1/billing/webhook
```

## Email (Mailtrap)

Company and project invitations are sent via Mailtrap (sandbox SMTP) using Nodemailer. Invitation links resolve to a status-check endpoint that determines whether the invitee needs to register or simply log in and accept.

## Seeding the Database

```bash
npx prisma db seed
```

Seeds, in order:
1. **Roles** — company- and project-scoped roles (Owner, Admin, Manager, Member, Guest / Owner, Manager, Developer, Viewer)
2. **Permissions** — granular action permissions across company, project, and task domains
3. **Role–Permission mappings**
4. **Plans** — Free, Starter, Pro, Business (pricing in THB)
5. **Super admin bootstrap** — creates the first platform super admin from `SUPERADMIN_EMAIL` / `SUPERADMIN_PASSWORD`

## Testing the API

A Postman collection covering the core flows (register, login, company/project creation, invitations, task management, billing) is available in [`/postman`](./postman) *(adjust path if applicable)*.

## Roadmap

Additional endpoints will be built incrementally alongside the frontend as real UI requirements surface, including:
- Fine-grained project role permission checks on invitation `role_id` (restricting to project-scoped roles only)
- Full activity log dashboards (company-scoped and platform-wide)
- Refresh token rotation
- Rate limiting

---

## Author

**Han Min** — Software Engineering graduate, backend-focused developer based in Thailand (Bangkok).
