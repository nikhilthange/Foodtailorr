# 🏛️ Architecture & System Design Specification

## 1. Architectural Principles

Food Tailor is architected as a **modular full-stack application** aligned directly with the **Food Tailor — Full Product Architecture**:
- **Experience Layer**: Dedicated role portals for `CUSTOMER`, `PARTNER` (with mandatory onboarding verification), and `ADMIN` (executive console).
- **Frontend Application Layer**: Modern web application built with Next.js 15+ App Router, React 19, TypeScript, Tailwind CSS, desktop-first responsive design, and centralized typed API client.
- **API & Application Layer**: Node.js + Express REST API with JWT authentication, RBAC authorization, request validation, rate limiting, CORS, security headers, request ID tracking, and standardized error envelopes.
- **Data Layer**: Amazon DynamoDB Single-Table architecture as the authoritative primary database with zero runtime dependency on PostgreSQL or Prisma.
- **AI & Integration Layer**: AI Recommendation Engine with local Ollama support, external provider configurability, and deterministic DynamoDB fallback.
- **Payment Layer**: Pluggable payment abstraction supporting Razorpay in production and Mock provider for testing, with webhook verification, server-side pricing calculations, and idempotency.

---

## 2. Target Component Diagram

```mermaid
graph TD
    subgraph Experience ["1. Experience Layer (Role Portals)"]
        CustomerPortal["Customer Web Portal\n(Discovery, Menu Builder, Occasions, Orders, Profile)"]
        PartnerPortal["Partner Kitchen Portal\n(Dashboard, Onboarding, Menu/Dishes, Fulfillment, Analytics)"]
        AdminPortal["Admin Executive Console\n(Dashboard, Users, Partners, Catalog, Orders, AI Telemetry)"]
    end

    subgraph Frontend ["2. Frontend Application Layer"]
        UI["Tailwind CSS Design System (#173E23 Green, #C55418 Saffron)"]
        Router["Role-Based Route Groups & Protected Route Guards"]
        AuthContext["Session & JWT Token Handling"]
        ApiClient["Centralized Typed API Client"]
    end

    subgraph Backend ["3. API & Application Layer (Node.js + Express)"]
        Gateway["Express API Gateway & Routing"]
        Trace["X-Request-ID & Structured Logging"]
        Security["Helmet & Rate Limiting & Strict CORS"]
        AuthMiddleware["JWT Authentication & Strict RBAC"]
        Validator["Zod Request Validation"]
        Services["Domain Services (Catalog, Order, Partner, Admin, Onboarding, AI, Payment)"]
        ErrorHandler["Centralized Error Handling ({ success, error: { code, message } })"]
    end

    subgraph Data ["4. Data Layer (Amazon DynamoDB)"]
        DynamoDB[("Amazon DynamoDB Single-Table Storage\n(PK/SK, GSI1, GSI2, Repositories)")]
        LocalDynamo["In-Memory DynamoDB Local / Dynalite (Zero-Setup Local Dev)"]
    end

    subgraph Integrations ["5. AI & External Integrations"]
        AI["AI Recommendation Engine\n(Ollama Local / External Provider / Deterministic DB Fallback)"]
        Payment["Payment Abstraction Layer\n(Razorpay Production / Mock Provider / Webhooks)"]
    end

    CustomerPortal --> Router
    PartnerPortal --> Router
    AdminPortal --> Router
    Router --> AuthContext
    AuthContext --> ApiClient
    ApiClient -->|HTTPS / REST / JWT| Gateway
    Gateway --> Trace --> Security --> Validator --> AuthMiddleware --> Services
    Services --> DynamoDB
    Services --> AI
    Services --> Payment
    Services --> ErrorHandler
```

---

## 3. Data Flow Workflows

### 3.1 Bespoke Menu Synthesis
```mermaid
sequenceDiagram
    autonumber
    actor Host as Client Host
    participant App as Frontend Client
    participant API as Express API
    participant AI as AI Engine (Ollama/Fallback)
    participant DB as DynamoDB Single-Table

    Host->>App: Submits 5-Chapter Intake (Occasion, Guests, Diet, Budget)
    App->>API: POST /api/ai/recommend-menu { guestCount, occasionId, budgetPerHead, dietaryPreferences, spiceLevel }
    API->>DB: Fetch eligible dishes via GSI1 catalog index (approved partners, dietary match)
    DB-->>API: Candidate dish pool
    API->>AI: Synthesize multi-course compositions
    AI-->>API: 3 Balanced Tasting Packages (Curated, Royal, Express)
    API->>DB: Log AI Recommendation Telemetry
    API-->>App: Return packages with confidence ratings and per-head pricing
    App-->>Host: Interactive Folio Review with customization
```

### 3.2 Commission Booking & Multi-Brand Fulfillment
```mermaid
sequenceDiagram
    autonumber
    actor Host as Client Host
    participant App as Frontend Client
    participant API as Express API
    participant Pay as Payment Provider (Razorpay/Mock)
    participant DB as DynamoDB Single-Table
    actor Partner as Partner Kitchens

    Host->>App: Books Degustation Commission
    App->>API: POST /api/orders (Dishes, Guests, Delivery Date, Address)
    API->>DB: Calculate server pricing (Items Subtotal + 10% Coordination Fee)
    API->>DB: Create Order (Status: SUBMITTED, Payment: PENDING)
    API-->>App: Return Created Order with ID & Ref
    Host->>App: Initiates Payment
    App->>API: POST /api/orders/:id/pay
    API->>Pay: Create Payment Session
    Pay-->>API: Session ID & Order Details
    API-->>App: Launch Razorpay Modal / Mock Confirmation
    App->>API: POST /api/orders/:id/verify-payment { signature, txnId }
    API->>Pay: Verify Transaction Signature & Idempotency
    API->>DB: Update Order Status -> PENDING_PARTNER, Payment -> COMPLETED
    API->>DB: Record statusHistory audit entry
    API-->>App: Order Confirmed
    Partner->>API: GET /api/partner/orders
    API-->>Partner: Returns orders containing Partner's dishes
    Partner->>API: PATCH /api/partner/orders/:id/status (ACCEPTED -> PREPARING)
    API->>DB: Validates partner ownership + valid state machine transition
    API-->>Partner: Status updated
```

### 3.3 Partner Guild Onboarding & Admin Audit
```mermaid
sequenceDiagram
    autonumber
    actor Partner as Restaurant Partner
    participant App as Frontend Client
    participant API as Express API
    participant DB as DynamoDB Single-Table
    actor Admin as Platform Admin

    Partner->>App: Navigates to /partner/onboarding
    App->>API: GET /api/onboarding/status
    API->>DB: Query application via GSI2
    DB-->>API: Return draft/submission state
    Partner->>App: Fills out 6-step registration (Identity, Contact, Legal/FSSAI, Menu, Bank)
    App->>API: POST /api/onboarding/draft (Auto-saves draft progress)
    API->>DB: Save draft to DynamoDB
    Partner->>App: Confirms declaration & submits application
    App->>API: POST /api/onboarding/submit (Validates all required compliance fields)
    API->>DB: Updates status to PENDING_REVIEW
    Admin->>App: Navigates to /admin (Onboarding tab)
    App->>API: GET /api/onboarding/admin/applications
    API->>DB: Query pending applications via GSI1
    DB-->>App: Return submissions
    Admin->>App: Audits FSSAI & bank credentials, clicks "Approve Guild Member"
    App->>API: POST /api/onboarding/admin/:id/status { status: "APPROVED" }
    API->>DB: Updates application status & sets partner isApproved: true
    DB-->>API: Success
    API-->>App: Guild status updated to APPROVED
```

---

## 4. Observability & Security

- **Request ID Tracking**: Generated via `crypto.randomUUID()` in `server/src/index.js`. Stamped on incoming requests and returned in `X-Request-ID` response headers.
- **Structured Error Responses**: All API errors are normalized into `{ success: false, error: { code: string, message: string, details?: any[] } }`.
- **RBAC & Ownership Security**: Strict role checks (`CUSTOMER`, `PARTNER`, `ADMIN`) and cross-tenant item validation preventing IDOR vulnerabilities.
- **DynamoDB Audit Trail**: Append-only status transitions and operational logging.
