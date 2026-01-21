# Backend API Project

This is the backend API for a generic University/College Management System. It is built using **Node.js**, **Express**, and **PostgreSQL** (hosted on Supabase). The API handles various administrative and student-related tasks such as authentication, attendance, complaints, payments, and profile management.

## 🚀 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (Supabase)
- **ORM/Driver**: pg (node-postgres)
- **Authentication**: JWT (JSON Web Tokens)
- **Email Service**: Nodemailer
- **Payment Gateway**: Cashfree
- **Other Tools**:
  - `dotenv` (Environment configurations)
  - `cors` (Cross-Origin Resource Sharing)
  - `cookie-parser` (Cookie parsing)
  - `bcrypt` (Password hashing)

## 📂 Project Structure

```bash
├── api/                # Main entry point (index.js) and app configuration
├── controllers/        # Logic for handling API requests (Authentication, Students, Admin, etc.)
├── routers/            # Express routes mapped to controllers
├── database/           # Database connection configuration
├── env.js              # Environment variable loader helper
└── package.json        # Project dependencies and scripts
```

## 🛠️ Installation & Setup

1.  **Clone the repository** (if applicable) or navigate to the project directory.

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**:
    Create a `.env` file in the root directory and add the following keys:

    ```env
    # App Config
    PORT=3001 # OR your preferred port
    SECRET_KEY=your_jwt_secret_key

    # Database Configuration (Check database/database.js for specific implementation)
    # The current setup uses a connection pool with direct config, 
    # but strictly recommends using env vars for sensitive data.
    DB_USER=your_db_user
    DB_HOST=your_db_host
    DB_NAME=your_db_name
    DB_PASSWORD=your_db_password
    DB_PORT=6543

    # Email Service (Nodemailer)
    EMAIL_ID=your_email_address
    PASS_KEY=your_email_app_password

    # Payment Gateway (Cashfree)
    CLIENT_ID=your_cashfree_client_id
    CLIENT_SECRET=your_cashfree_client_secret
    ```

    > **Note**: In the current `database/database.js`, some database credentials might be hardcoded. It is highly recommended to refactor this to strictly use `process.env` variables for security.

4.  **Run the Server**:
    The main entry point is inside the `api` folder. You might need to adjust your start script or run:
    ```bash
    node api/index.js
    ```
    *Tip: Check `package.json` for available scripts.*

## 🔑 Key Features

### Authentication & Authorization
- **Student & Admin Login**: Secure login with JWT and Cookies.
- **Registration**: Email verification flow with OTPs.
- **Password Management**: Forgot password and reset password functionality.

### Admin Modules
- **Manage Students**: Fetch, approve/reject, update, and edit student details.
- **Attendance**: Mark attendance, view records, export reports, and manage absenteeism.
- **Complaints**: View and resolve student complaints.
- **Department**: Add, edit, fetch, and delete departments.
- **Announcements**: Push, edit, and delete announcements.
- **Mess Bills**: Generate, update, and view mess bills.

### Student Modules
- **Profile**: View and edit own details.
- **Attendance**: View own attendance records.
- **Complaints**: Register and track status of complaints.
- **Notifications**: Receive announcements and notifications.
- **Payments**: Pay mess bills via Cashfree integration.

## 📡 API Endpoints Overview

The API is structured into several routers found in the `routers/` directory:

- **/account_creation**: Registration, email verification, and OTP handling.
- **/admin**:
  - `/students`: Student management.
  - `/approve_reject`: Approval workflows.
  - `/attendance`: Admin attendance controls.
  - `/complaint`: Complaint resolution.
  - `/department`: Department management.
  - `/announcement`: Announcement management.
  - `/messbill`: Mess bill management.
  - `/login`: Admin authentication.
- **/student**:
  - `/login`: Student authentication.
  - `/attendance`: Student attendance viewing.
  - `/complaints`: Complaint registration and tracking.
  - `/notification`: Student notifications.
  - `/payment`: Payment processing.
- **/forgot_password**: Password recovery flow.

## 📝 Usage

Once the server is running (default port `3001`), the API will be accessible at `http://localhost:3001` (or your configured host).

To verify the API is running, you can visit the root endpoint:
```http
GET /
```
Response: `{ "message": "API is running ✅" }`
