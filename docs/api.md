# 📡 API Specification & Error Contract

All requests and responses use JSON. The base URL for the server in development is `http://localhost:3001/api`.

---

## 1. Global Standards

### 1.1 Headers
- `Content-Type: application/json`
- `Authorization: Bearer <access_token>` (for authenticated routes)
- `X-Request-ID`: Included in all responses for distributed tracing.

### 1.2 Standard Success Response
```json
{
  "success": true,
  "data": { ... }
}
```
*(Note: Some legacy endpoints return payload roots directly, e.g. `{ "orders": [...] }` or the created entity.)*

### 1.3 Standard Error Response Contract
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR | UNAUTHORIZED | FORBIDDEN | NOT_FOUND | RATE_LIMIT_EXCEEDED",
    "message": "Human-readable explanation of error condition",
    "details": [
      { "path": "guestCount", "message": "Guest count must be at least 5" }
    ]
  }
}
```

---

## 2. Health & System Telemetry

### `GET /api/health`
Returns system status, active database connectivity, and environment mode.
- **Auth**: None
- **Response (200)**:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2026-09-04T10:00:00.000Z",
  "environment": "development",
  "version": "1.0.0"
}
```

---

## 3. Authentication & Session Management

### `POST /api/auth/register`
Create a new Customer or Partner account.
- **Body**:
```json
{
  "email": "host@example.com",
  "password": "Password123!",
  "firstName": "Siddharth",
  "lastName": "Varma",
  "phone": "+91 98765 43210",
  "role": "CUSTOMER"
}
```
- **Response (201)**: `{ "user": { ... }, "accessToken": "...", "refreshToken": "..." }`

### `POST /api/auth/login`
Authenticate with email and password.
- **Body**: `{ "email": "admin@foodtailor.in", "password": "password123" }`
- **Response (200)**: `{ "user": { ... }, "accessToken": "...", "refreshToken": "..." }`

### `POST /api/auth/refresh`
Rotate refresh token and issue new access token.
- **Body**: `{ "refreshToken": "..." }`
- **Response (200)**: `{ "accessToken": "...", "refreshToken": "..." }`

### `GET /api/auth/me`
Retrieve currently authenticated user profile.
- **Auth**: Bearer Token
- **Response (200)**: Current user object with preferences and addresses.

---

## 4. Discovery & Catalog

### `GET /api/catalog/partners`
List approved culinary brands.
- **Query Params**: `cuisine`, `search`, `limit`, `page`
- **Response (200)**: `{ "partners": [...] }`

### `GET /api/catalog/partners/:id`
Get atelier details with full dish repertoire.
- **Response (200)**: Atelier profile with dishes categorized by course.

### `GET /api/catalog/dishes`
Search curated dishes across all partner kitchens.
- **Query Params**: `category`, `cuisine`, `partnerId`, `isVeg`, `maxPrice`
- **Response (200)**: `{ "dishes": [...] }`

### `GET /api/catalog/occasions`
List supported occasions with styling icons and descriptions.
- **Response (200)**: `{ "occasions": [...] }`

---

## 5. AI Recommendation Engine

### `POST /api/ai/recommend-menu`
Generate 3 tailored degustation compositions (Curated Feast, Royal Feast, Artisanal Express).
- **Body**:
```json
{
  "guestCount": 25,
  "occasionId": "uuid-optional",
  "budgetPerHead": 900,
  "dietaryType": "ALL | VEG | NON_VEG | VEGAN | JAIN",
  "spiceLevel": "MILD | MEDIUM | SPICY | EXTRA_SPICY",
  "allergies": ["Nuts", "Dairy"],
  "cuisines": ["Hyderabadi", "Mughlai"]
}
```
- **Response (200)**:
```json
{
  "packages": [
    {
      "name": "Curated Feast",
      "description": "...",
      "items": [...],
      "perHead": 850,
      "totalEstimate": 21250,
      "brandCount": 4,
      "confidence": 92
    }
  ],
  "meta": { "provider": "gemini | fallback", "durationMs": 140 }
}
```

---

## 6. Commission & Order Management

### `POST /api/orders`
Submit a new commission for execution.
- **Auth**: Bearer Token (CUSTOMER)
- **Body**:
```json
{
  "occasionId": "uuid-optional",
  "guestCount": 20,
  "budgetPerHead": 850,
  "dietaryType": "ALL",
  "eventDate": "2026-09-10T18:00:00.000Z",
  "venueAddress": "123 Jubilee Hills Road 36, Hyderabad",
  "contactName": "Host Name",
  "contactPhone": "+91 98765 43210",
  "contactEmail": "host@example.com",
  "notes": "Table presentation in polished brass",
  "items": [
    { "dishId": "uuid-dish-1", "quantity": 20 },
    { "dishId": "uuid-dish-2", "quantity": 20 }
  ]
}
```
- **Pricing Calculation**: Server computes:
  - `subtotal = sum(pricePerHead * guestCount)`
  - `coordinationFee = Math.round(subtotal * 0.10)`
  - `totalAmount = subtotal + coordinationFee`
- **Response (201)**: Created Order object (`status: SUBMITTED`, `paymentStatus: PENDING`).

### `GET /api/orders/:id`
Retrieve full order details.
- **Auth**: Owner (Customer), Kitchen Partner (owns items in order), or Admin.

### `POST /api/orders/:id/pay`
Initiate payment order with payment gateway.
- **Auth**: Order Owner (Customer)
- **Response (200)**: `{ "success": true, "data": { "orderId": "...", "amount": 23375, "currency": "INR" } }`

### `POST /api/orders/:id/verify-payment`
Verify gateway signature and transition status.
- **Auth**: Order Owner (Customer)
- **Body**:
```json
{
  "razorpay_order_id": "...",
  "razorpay_payment_id": "...",
  "razorpay_signature": "..."
}
```
- **Response (200)**: `{ "success": true, "data": Order }` (`status: PENDING_PARTNER`, `paymentStatus: COMPLETED`).

---

## 7. Partner Management

### `GET /api/partner/orders`
List orders containing dishes from authenticated partner's kitchen.
- **Auth**: PARTNER

### `PATCH /api/partner/orders/:id/status`
Update status of an order containing partner's dishes.
- **Auth**: PARTNER (Must own at least one dish in the order)
- **Body**: `{ "status": "ACCEPTED | PREPARING | CONFIRMED | COMPLETED", "note": "..." }`

---

## 8. Executive Administration Console

### `GET /api/admin/dashboard`
Aggregated system metrics (orders count, revenue, partner count, AI telemetry).
- **Auth**: ADMIN

### `GET /api/admin/orders`
Paginated global list of all orders across all partners.
- **Auth**: ADMIN

### `PATCH /api/admin/partners/:id`
Approve or suspend partner kitchen.
- **Auth**: ADMIN
- **Body**: `{ "isApproved": true, "isActive": true }`

---

## 9. Partner Guild Onboarding

### `GET /api/onboarding/status`
Retrieve current draft or submitted onboarding application for the authenticated partner.
- **Auth**: PARTNER
- **Response (200)**: `{ "success": true, "data": OnboardingApplication }`

### `POST /api/onboarding/draft`
Auto-save multi-step registration draft state.
- **Auth**: PARTNER
- **Body**: Partial onboarding payload with `currentStep` (1 through 6).
- **Response (200)**: `{ "success": true, "data": OnboardingApplication }`

### `POST /api/onboarding/submit`
Final submission of completed onboarding application. Validates required business identity, FSSAI 14-digit license, and bank payout credentials.
- **Auth**: PARTNER
- **Response (200)**: `{ "success": true, "data": OnboardingApplication }` (`status: PENDING_REVIEW`)

### `GET /api/onboarding/admin/applications`
List all submitted onboarding applications for compliance audit.
- **Auth**: ADMIN
- **Query Params**: `status` (default: `PENDING_REVIEW`)
- **Response (200)**: `{ "success": true, "data": OnboardingApplication[] }`

### `POST /api/onboarding/admin/:id/status`
Approve or reject a partner's guild onboarding application. On approval, automatically marks the partner atelier as approved and active.
- **Auth**: ADMIN
- **Body**: `{ "status": "APPROVED | REJECTED", "notes": "..." }`
- **Response (200)**: `{ "success": true, "data": OnboardingApplication }`

