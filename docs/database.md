# 🗄️ Amazon DynamoDB Single-Table Architecture & Access Pattern Specification

The Food Tailor platform uses **Amazon DynamoDB** as its authoritative primary application database, engineered around single-table design principles and access-pattern-driven modeling using `@aws-sdk/client-dynamodb` and `@aws-sdk/lib-dynamodb`.

There is **zero runtime dependency** on PostgreSQL or Prisma.

---

## 1. Single-Table Key Schema & Global Secondary Indexes

The entire application state is unified within a single table (`food_tailor` by default) with composite partition and sort keys, augmented by two Global Secondary Indexes (GSIs).

```
Table: food_tailor
├── Partition Key (PK): String  (e.g., USER#usr_..., PARTNER#ptr_..., ORDER#ord_...)
└── Sort Key (SK):      String  (e.g., PROFILE, ITEM#dsh_..., EVENT#...)

Global Secondary Index 1 (GSI1):
├── Partition Key (GSI1PK): String (e.g., CATALOG, STATUS#APPROVED, ONBOARDING_STATUS#PENDING_REVIEW)
└── Sort Key (GSI1SK):      String (e.g., DISH#..., PARTNER#..., DATE#...)

Global Secondary Index 2 (GSI2):
├── Partition Key (GSI2PK): String (e.g., EMAIL#user@example.com, USER#usr_...)
└── Sort Key (GSI2SK):      String (e.g., METADATA, ONBOARDING, PARTNER#...)
```

---

## 2. Entity Mapping & Access Patterns

| Domain | Entity | PK | SK | GSI1PK | GSI1SK | GSI2PK | GSI2SK | Access Pattern |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Auth** | User Profile | `USER#<userId>` | `PROFILE` | — | — | `EMAIL#<email>` | `METADATA` | Login by email (GSI2) / Get user by ID |
| **Auth** | Refresh Token | `USER#<userId>` | `TOKEN#<tokenId>` | — | — | — | — | Token validation & revocation |
| **Partner** | Atelier Profile | `PARTNER#<partnerId>` | `PROFILE` | `STATUS#<isApproved>` | `PARTNER#<partnerId>` | `USER#<userId>` | `PARTNER#<partnerId>` | Approved partner catalog (GSI1) / Owner lookup (GSI2) |
| **Catalog** | Dish Item | `DISH#<dishId>` | `METADATA` | `CATALOG` | `DISH#<dishId>` | `PARTNER#<partnerId>` | `DISH#<dishId>` | Global dish catalog (GSI1) / Kitchen dishes (GSI2) |
| **Catalog** | Category | `METADATA#CATEGORIES` | `CATEGORY#<id>` | — | — | — | — | List all course categories |
| **Catalog** | Cuisine | `METADATA#CUISINES` | `CUISINE#<id>` | — | — | — | — | List all heritage cuisines |
| **Catalog** | Occasion | `METADATA#OCCASIONS` | `OCCASION#<slug>`| — | — | — | — | Curated event occasions |
| **Orders** | Commission Header | `ORDER#<orderId>` | `HEADER` | `STATUS#<status>` | `DATE#<iso>` | `USER#<userId>` | `DATE#<iso>` | Customer order history (GSI2) / Admin orders (GSI1) |
| **Orders** | Order Item | `ORDER#<orderId>` | `ITEM#<dishId>` | — | — | `PARTNER#<partnerId>` | `ORDER#<orderId>` | Multi-tenant partner fulfillment isolation (GSI2) |
| **Orders** | Status History | `ORDER#<orderId>` | `STATUS#<timestamp>`| — | — | — | — | Immutable audit log of order state machine |
| **Orders** | Saved Menu | `USER#<userId>` | `SAVED_MENU#<id>`| — | — | — | — | Host personalized menu curation |
| **Onboarding**| Application | `ONBOARDING#<appId>` | `APPLICATION` | `ONBOARDING_STATUS#<status>` | `DATE#<iso>` | `USER#<userId>` | `ONBOARDING` | Partner draft resume / Admin application audit |
| **AI** | Telemetry Log | `AI_LOG#<logId>` | `METADATA` | `AI_SYNTHESIS` | `DATE#<iso>` | `USER#<userId>` | `DATE#<iso>` | AI prompt/latency monitoring |

---

## 3. Data Safety, Consistency & Invariants

1. **Conditional Writes (`ConditionalCheckFailedException`)**:
   - Unique email registration enforces `attribute_not_exists(PK)`
   - Order state transitions enforce current valid status preconditions
   - Payment idempotency prevents double-charge / double-capture
2. **Tenant Isolation**:
   - Partner queries strictly enforce `GSI2PK = USER#<partner.userId>` or `partnerId` filter
   - Eliminates IDOR vulnerabilities at repository level
3. **Dual Runtime Support**:
   - **Local Development / Test**: In-memory `dynalite` server auto-spawns on `http://localhost:8000` with automated table initialization
   - **Production (AWS)**: Connects natively to AWS DynamoDB via `AWS_REGION`, IAM roles, or AWS credentials

---

## 4. Runbook & Commands

```bash
# Initialize single-table schema:
npm run db:init

# Seed partners, dishes, occasions, categories, and demo credentials:
npm run db:seed

# Execute automated tests:
npm test

# Execute full end-to-end integration test:
npm run test:e2e
```
