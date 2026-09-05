# 🧪 Testing Architecture & QA Verification Guide

Food Tailor features an automated, multi-tiered test suite executing directly with Node.js's native test runner (`node:test`) and assertion engine (`node:assert/strict`), avoiding brittle third-party testing framework dependencies.

---

## 1. Test Suite Hierarchy

```
server/tests/
├── unit/
│   ├── auth.test.js          # Password hashing, salting, JWT signing, claim validation & expiration
│   ├── order-state.test.js   # State machine transition matrix & illegal path invariants
│   ├── dynamodb-dal.test.js  # Single-table repositories: User, Partner, Dish, Order isolation
│   └── onboarding.test.js    # Partner onboarding draft auto-save, validation, submission, and admin approval
├── security/
│   └── rbac.test.js          # 401 unauthenticated, 403 customer->admin, 403 customer->partner, cross-partner isolation
└── integration/
    └── api.test.js           # Health check, catalog endpoints, order creation, pricing math, payment verification
```

---

## 2. Test Execution Commands

From repository root:
```bash
# Run all 45 automated tests (Unit, Security, Integration, DAL)
npm test

# Run the 12-step complete End-to-End workflow runner
npm run test:e2e

# Run frontend static analysis & linting
npm run lint

# Compile production frontend bundle
npm run build
```

---

## 3. Test Coverage Matrix

### 3.1 Unit Tests (`tests/unit/`)
- `auth.test.js`:
  - Validates bcrypt salting (unique hashes generated for identical passwords).
  - Validates `comparePassword` on correct and mismatched passwords.
  - Verifies JWT claim preservation (`sub`, `email`, `role`).
  - Verifies rejection of tampered tokens and expired tokens.
- `order-state.test.js`:
  - Validates all legal transitions across `DRAFT`, `SUBMITTED`, `PENDING_PARTNER`, `ACCEPTED`, `PREPARING`, `CONFIRMED`, `COMPLETED`, `CANCELLED`.
  - Enforces terminal state invariants (`COMPLETED`, `CANCELLED`, `REJECTED` have zero outbound transitions).
  - Tests illegal skipping (e.g., `SUBMITTED` -> `COMPLETED`) and illegal backwards transitions (`PREPARING` -> `DRAFT`).
- `dynamodb-dal.test.js`:
  - Validates single-table repositories: `UserRepository`, `PartnerRepository`, `DishRepository`, `OrderRepository`.
  - Confirms GSI1 (`CATALOG`, `STATUS#APPROVED`) and GSI2 (`EMAIL`, `USER#<id>`) lookups without table scans.
  - Verifies cross-partner multi-tenant pointer isolation.
- `onboarding.test.js`:
  - Verifies auto-saving 6-step partner onboarding draft applications with step persistence.
  - Verifies draft resumption and payload merging.
  - Verifies field validation on final submission (FSSAI 14-digit, bank IFSC).
  - Verifies admin review lifecycle transitioning application to `APPROVED` and activating partner kitchen.

### 3.2 Security Tests (`tests/security/`)
- `rbac.test.js`:
  - Verifies 401 Unauthorized on missing or malformed `Authorization: Bearer` headers.
  - Verifies 403 Forbidden when Customer requests `/api/admin/dashboard` or `/api/admin/users`.
  - Verifies 403 Forbidden when Customer requests `/api/partner/dashboard`.
  - Verifies 403 Forbidden when Partner requests `/api/admin/dashboard`.
  - Verifies 200 OK when Admin requests `/api/admin/dashboard`.
  - **Multi-Tenant Isolation**: Verifies 403 Forbidden when Partner 2 attempts to transition an order containing dishes exclusively from Partner 1.

### 3.3 Integration Tests (`tests/integration/`)
- `api.test.js`:
  - Health check verification (`GET /api/health` status 200, database connected, `X-Request-ID` header).
  - Catalog retrieval (`GET /api/catalog/partners`, `/dishes`, `/occasions`).
  - Full order creation validating exact commercial formula: `subtotal = sum(item.pricePerHead * guestCount)` + `coordinationFee = Math.round(subtotal * 0.10)`.
  - Payment initiation (`POST /api/orders/:id/pay`) and verification (`POST /api/orders/:id/verify-payment`), verifying status progression to `PENDING_PARTNER` and `OrderStatusHistory` append.
  - Standardized error format assertion on malformed payloads (`{ success: false, error: { code, message } }`).
