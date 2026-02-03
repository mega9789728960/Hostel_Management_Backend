# Hostel Management System

## 1. Project Overview

I designed and implemented this full-stack Hostel Management System to address the core operational challenges faced by the Chozha Boys Hostel. The previous manual system suffered from inefficient attendance tracking, delayed complaint resolution, and opaque financial records for mess bills. 

This system acts as the digital backbone of the hostel, bridging the gap between three key stakeholders:
*   **Students:** Who need transparency in billing, easy complaint registration, and mobile-friendly attendance checking.
*   **Wardens:** Who require tools to manage student data, track leave requests, and ensure discipline.
*   **Admins:** Who need a high-level overview of finances, occupancy, and system-wide settings.

This is not just a CRUD application; it is a production-grade solution running with real payments, heavy database interactions, and strict security protocols suited for an institutional environment.

## 2. Key Features

Every feature in this system was built to solve a specific operational bottleneck.

*   **Student Authentication & Security:** I implemented a secure login flow using JWTs and role-based redirects. The system prevents unauthorized access to admin routes and ensures students can only view their own financial data.
*   **Role-Based Access Control (RBAC):** The system strictly separates Student and Admin dashboards. Admins have writes-access to global settings and student records, while students have read-only access to bills and write-access only for their own complaints.
*   **Automated Mess Billing System:** One of the most critical features. The system calculates bills based on variable parameters, pushes them to students, and tracks payment status in real-time.
*   **Payment Gateway Integration:** I integrated Cashfree to handle payments. Unlike simple integrations, this handles webhooks to ensure that even if a user closes the browser during payment, the server receives the confirmation and updates the database asynchronously.
*   **Complaint Redressal Mechanism:** A ticketing system where students file complaints (electrical, plumbing, mess) and track their status from "Pending" to "Resolved". This enforces accountability for the hostel staff.
*   **Smart Attendance:** The system allows for digital attendance tracking, reducing the paperwork and allowing for date-range querying to analyze student presence trends.
*   **Rate Limiting & Security:** To prevent abuse, I implemented sliding-window rate limiting using Redis, ensuring that the API cannot be flooded with requests.

## 3. System Architecture

I chose a robust architecture focusing on data integrity and performance.

*   **Frontend:** React.js (Vite)
    *   Chosen for its Virtual DOM efficiency and the rich ecosystem of libraries. I used strict component modularity to keep the codebase maintainable.
*   **Backend:** Node.js & Express.js
    *   Node's non-blocking I/O is ideal for handling concurrent requests, especially during peak times like mess bill deadlines.
*   **Database:** PostgreSQL
    *   I explicitly chose a relational database over MongoDB because financial data (bills, payments) and structured student data require strict schema enforcement and transactional integrity (ACID properties).
*   **Caching & Session:** Redis (Upstash)
    *   Used for rate limiting and transient session data. It offloads the read burden for high-frequency checks.
*   **Payment Gateway:** Cashfree
    *   Selected for its reliable test mode and webhook support, allowing for robust transaction verification scenarios.

**Data Flow:**
Client (React) → API Gateway (Express) → Middleware (Sanitization/Auth) → Controller → PostgreSQL / Redis → Response.

## 4. Backend Deep Dive

The backend is structured to separate concerns entirely. I avoided putting logic in the route definitions.

*   **Folder Structure:**
    *   `api/`: Entry point, server configuration, and strict middleware application.
    *   `controllers/`: Contains the business logic. Each controller functions independently (e.g., `paymentWebhook.js`, `registeration.js`).
    *   `routers/`: strictly defines API endpoints and maps them to controllers. This allows for cleaner code reviews and easier refactoring.
    *   `middlewares/`: Global interceptors. `sanitizeInput.js` cleans every request body to prevent XSS, and `rateLimiter.js` protects the server from DDoS.
    *   `database/`: Connection pools for PostgreSQL and Redis.

*   **Authentication Logic:**
    *   I use `passport` alongside `jsonwebtoken`. When a user logs in, a token is issued and stored (cookie/local storage strategy). Middleware intercepts protected routes, verifies the token signature, and attaches the user profile to the request object.

*   **Database Design:**
    *   The schema uses normalized tables (`students`, `mess_bill_for_students`, `payments`) to reduce redundancy. Foreign keys link payments to bills, ensuring that a payment record cannot exist without an associated bill.

*   **Error Handling:**
    *   I implemented a centralized error handling strategy. Instead of crashing the server, exceptions are caught, logged with context, and a sanitized error message is returned to the client with the appropriate HTTP status code (400 vs 500).

## 5. Frontend Deep Dive

The frontend is built for speed and user experience.

*   **Core Logic (`src/App.jsx`):**
    *   I used React Router v6's data loaders (`dashboardLoader`, `adminDashboardLoader`). This is a critical design decision: it ensures that authentication checks happen *before* the component attempts to render, eliminating the "flash of unauthenticated content" often seen in simpler React apps.
    
*   **State Management:**
    *   I manage auth state using a combination of LocalStorage (for persistence across tabs) and in-memory state. Axios interceptors are configured to automatically attach credentials to outgoing requests.

*   **Component Structure:**
    *   `Admin Dashboard` and `Student Dashboard` are completely isolated. Shared UI elements like Buttons or Form inputs live in `Common/` to enforce a consistent design system (DRY principle).

*   **Form Handling:**
    *   Forms, such as the registration or complaint forms, utilize real-time validation. Input data is checked for format correctness (e.g., phone numbers, email domains) before it is ever sent to the server.

## 6. Payment Flow Explanation

Financial integrity was my top priority here. I did not rely solely on the frontend to tell the backend that a payment was successful.

1.  **Initiation:** The student requests a payment order. The backend generates a secure hash and requests a `session_id` from Cashfree.
2.  **Processing:** The user completes the payment on the gateway.
3.  **Verification (The Critical Step):** 
    *   Instead of trusting the client-side redirect, I implemented a **Webhook** listener at `/api/webhook`.
    *   When Cashfree charges the card, it hits my server with a signed payload.
    *   I verify the `x-webhook-signature` to ensure the request is genuinely from Cashfree.
4.  **Deduplication:** 
    *   I query the database to check if this `payment_id` has already been processed. This handles cases where the gateway sends retry webhooks.
5.  **Settlement:**
    *   Only after verification and deduplication do I update the `mess_bill_for_students` table to set `ispaid = true`.

This flow guarantees that a student is never credited for a failed payment, and legitimate payments are never missed even if the user loses internet connection immediately after paying.

## 7. Security Considerations

*   **SQL Injection:** I used parameterized queries (`$1`, `$2`) throughout the `pg` library usage. No user input is ever concatenated directly into a SQL string.
*   **XSS Protection:** The `sanitizeInput` middleware recursively cleans all incoming JSON bodies and query parameters using `sanitize-html`, stripping out malicious scripts before they reach the controller.
*   **Rate Limiting:** Using Redis, I track IP addresses and block clients that exceed defined request thresholds (e.g., 5 requests per minute for sensitive routes).
*   **Signature Verification:** All financial webhooks are cryptographically verified using the client secret.

## 8. Scalability & Performance

*   **Connection Pooling:** I used `pg.Pool` to manage database connections. This allows the application to handle multiple concurrent users without the overhead of opening/closing a TCP connection for every query.
*   **Redis Caching:** High-velocity write operations (like rate limit counting) are offloaded to Redis, which is much faster than hitting the disk-based PostgreSQL for transient data.
*   **Statelessness:** The API is RESTful and stateless (relying on tokens), meaning horizontal scaling is simplified. We can spin up multiple instances of this backend behind a load balancer without worrying about sticky sessions.

## 9. Installation & Setup

### Prerequisites
*   Node.js (v18+)
*   PostgreSQL
*   Redis (or Upstash account)

### Backend Setup
1.  Navigate to `Hostel_Management_Backend`.
2.  Run `npm install`.
3.  Create a `.env` file in `Hostel_Management_Backend/api/` with the following:
    ```env
    DB_USER=postgres
    DB_HOST=localhost
    DB_NAME=hostel_db
    DB_PASSWORD=yourpassword
    DB_PORT=5432
    UPSTASH_REDIS_REST_URL=your_url
    UPSTASH_REDIS_REST_TOKEN=your_token
    APP_ID=cashfree_app_id
    PAYMENT_KEY=cashfree_secret_key
    ```
4.  Start server: `node api/index.js`.

### Frontend Setup
1.  Navigate to `Chozha-Boys-Hostel-Management-System`.
2.  Run `npm install`.
3.  Start dev server: `npm run dev`.

## 10. API Documentation

I have maintained detailed documentation for the API.
*   **Endpoints:** Organized by domain (`/students`, `/admin`, `/payment`).
*   **Format:** All endpoints accept and return JSON.
*   A complete HTML documentation file `API_DOCUMENTATION.html` is included in the backend root for easy reference by frontend developers or third-party integrators.

## 11. Challenges Faced & Solutions

*   **Challenge:** Handling payment status discrepancies (e.g., user pays, but browser crashes before redirect).
    *   **Solution:** I moved the state update logic entirely to the Webhook handler. The frontend merely polls for status or waits for the user to manually refresh, but the source of truth is the server-to-server communication.
*   **Challenge:** managing complex role-based routing on the client side.
    *   **Solution:** I implemented React Router loaders to intercept navigation events. This ensures that unauthorized users are bounced back to the login screen before they can even see a flash of the dashboard.

## 12. Future Enhancements

*   **Mobile Application:** The backend is already RESTful API-first, so building a React Native mobile app would be the next logical step.
*   **AI-Powered Insights:** Integrating AI to analyze mess consumption patterns and predict inventory requirements for the hostel kitchen.

## 13. Final Notes

This project demonstrates my ability to build secure, scalable, and business-focused applications. It moves beyond simple tutorials into the realm of distributed systems (Redis + Postgres), financial compliance (Payment Integration), and architectural best practices (Middleware patterns, RBAC). I welcome any code review or feedback.
