# 🔒 Security Architecture & RBAC Policy

Security in Food Tailor is implemented in accordance with OWASP Top 10 guidelines and strict multi-tenant culinary isolation.

---

## 1. Authentication & Token Architecture

### 1.1 Password Security
- Passwords are encrypted using **`bcryptjs`** with **12 salt rounds**.
- Plaintext passwords never persist in memory or logs.
- Password comparison runs in constant time to prevent timing attacks.

### 1.2 Dual-Token JWT System
- **Access Tokens**: Short-lived (15 minutes). Signed using HMAC SHA-256 (`env.JWT_ACCESS_SECRET`). Payload includes user ID (`sub`), email, and `role`.
- **Refresh Tokens**: Long-lived (7 days). Stored in the DynamoDB single table with `PK: USER#<userId>` and `SK: TOKEN#<tokenId>`.
- **Rotation Policy**: Each call to `/api/auth/refresh` destroys the old refresh token and generates a new pair. Old refresh tokens are purged to limit session sprawl.

---

## 2. Role-Based Access Control (RBAC)

The platform defines three strictly isolated roles:
1. **`CUSTOMER`**: Can browse public catalog, request AI recommendations, place orders, view own order history, and pay for commissions.
2. **`PARTNER`**: Operates an artisanal kitchen atelier. Can view incoming orders that contain dishes from their kitchen, update the preparation status of those orders, and update kitchen profile details.
3. **`ADMIN`**: Global platform administrator. Has unrestricted visibility across all orders, audit logs, partner approvals, users, and AI telemetry.

### RBAC Enforcement Table

| Endpoint Pattern | Allowed Roles | Isolation Rules |
| :--- | :--- | :--- |
| `/api/catalog/*` | Public | Only approved & active partners/dishes are visible |
| `/api/ai/*` | Any authenticated user | Throttled by `aiLimiter` |
| `/api/orders` | `CUSTOMER`, `ADMIN` | Customer can only create and view own orders |
| `/api/orders/:id` | Owner, Partner, Admin | Partner can only view if order contains dishes from their kitchen |
| `/api/orders/:id/verify-payment` | Order Owner (Host) | Idempotent: cannot be re-executed once paid |
| `/api/partner/*` | `PARTNER` | Restricted to own partner entity |
| `/api/partner/orders/:id/status` | `PARTNER` | **Multi-Tenant Rule**: 403 if order has 0 dishes from partner kitchen |
| `/api/admin/*` | `ADMIN` | 403 Forbidden for all non-admins |

---

## 3. Cross-Partner Multi-Tenant Isolation

A critical vulnerability in multi-vendor platforms is **IDOR (Insecure Direct Object Reference)**, where Partner A views or manipulates an order belonging to Partner B.

Food Tailor prevents this at the database query and service layer:
```javascript
// Verification in server/src/services/order.service.js:
const partnerOwnsItem = order.items.some(item => item.partner?.userId === changedBy);
if (!partnerOwnsItem) {
  throw new AppError('Not authorized to update an order containing no items from your kitchen', 403);
}
```
If a rogue partner attempts to accept, reject, or alter an order that does not include their items, the request is rejected with **403 Forbidden** prior to state transition checks.

---

## 4. Network & Perimeter Defense

- **Helmet**: Secures HTTP headers (`X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`, `X-XSS-Protection`).
- **CORS**: Enforces whitelisted origins (`CORS_ORIGIN`). Non-whitelisted origins are cleanly rejected with standard HTTP 403.
- **Rate Limiting**:
  - Global API: 200 requests / 15 minutes.
  - Authentication: 30 attempts / 15 minutes to thwart brute-force attacks.
  - AI Synthesis: 30 requests / 5 minutes to prevent computational denial-of-service.
- **Input Validation**: All inbound mutation endpoints validate payloads against Zod schemas. Extraneous parameters are discarded.
