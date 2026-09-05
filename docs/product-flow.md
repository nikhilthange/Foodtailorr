# 🧭 End-to-End Product Flow & User Journeys

This document details the three core user workflows across the Food Tailor platform:
1. **Client / Event Host Journey**
2. **Partner Kitchen / Brand Journey**
3. **Administrator Executive Journey**

---

## 1. Client / Event Host Journey

```mermaid
graph TD
    Landing["Landing Page (Brand Story & Guild Showcase)"] --> Explore["Explore Guild (Filter Ateliers & Dishes)"]
    Landing --> BuildIntake["Bespoke Menu Intake (5 Chapters)"]
    Explore --> BuildIntake

    subgraph IntakeChapters ["5-Chapter Intake Flow"]
        Ch1["Chapter 1: Occasion Selection"]
        Ch2["Chapter 2: Guest Count & Event Timing"]
        Ch3["Chapter 3: Dietary Preferences & Spice Calibration"]
        Ch4["Chapter 4: Allergen Exclusions"]
        Ch5["Chapter 5: Investment Per Head & Cuisine Focus"]
        Ch1 --> Ch2 --> Ch3 --> Ch4 --> Ch5
    end

    BuildIntake --> IntakeChapters
    Ch5 --> Synthesize["AI Dual-Engine Synthesis"]
    Synthesize --> FolioReview["Tasting Folio Review (Curated, Royal, Express)"]

    FolioReview --> Customization["Customize Courses (Add/Remove Dishes)"]
    Customization --> CheckoutModal["Commission Booking Modal (Delivery Details & Notes)"]
    CheckoutModal --> OrderSubmitted["Order Created (Status: SUBMITTED)"]
    OrderSubmitted --> PayOrder["Payment Gateway Session"]
    PayOrder --> PaymentVerified["Payment Verified (Status: PENDING_PARTNER)"]
    PaymentVerified --> Tracking["Live Commission Progress Tracking"]
```

---

## 2. Partner Kitchen / Brand Journey

```mermaid
graph TD
    Register["Partner Registration (/register)"] --> Onboard["6-Step Guild Onboarding (/partner/onboarding)"]
    Onboard --> Draft["Auto-Save Step Drafts (DynamoDB ONBOARDING#<id>)"]
    Draft --> Submit["Submit Application (Status: PENDING_REVIEW)"]
    Submit --> AdminAudit["Admin Audit & Guild Approval"]
    AdminAudit --> Approved["Approved Partner Access"]
    
    Login["Partner Login (partnerN@foodtailor.in)"] --> Dashboard["Partner Kitchen Console (/partner/dashboard)"]
    Approved --> Dashboard
    Dashboard --> ReviewOrders["Inspect Incoming Multi-Brand Commissions"]
    ReviewOrders --> OrderDetail["View Order (Only Own Dishes Visible)"]
    OrderDetail --> Accept["Accept Commission (Status: ACCEPTED)"]
    Accept --> Prep["Transition to PREPARING"]
    Prep --> Dispatch["Transition to CONFIRMED / COMPLETED"]
```

---

## 3. Administrator Executive Journey

```mermaid
graph TD
    AdminLogin["Admin Login (admin@foodtailor.in)"] --> ExecutiveConsole["Executive Console (/admin)"]
    ExecutiveConsole --> Metrics["Global Performance Metrics (Revenue, Commission Volume)"]
    ExecutiveConsole --> AllOrders["Global Order Supervision"]
    AllOrders --> OverrideStatus["Admin Override Order Status"]
    ExecutiveConsole --> PartnerAudit["Culinary Partner Audit & Approvals"]
    PartnerAudit --> ToggleApproval["Approve / Pause Kitchen Ateliers"]
    ExecutiveConsole --> Telemetry["AI Recommendation Engine Telemetry"]
```
