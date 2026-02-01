# API Endpoints Documentation

This document outlines the API endpoints for the Hostel Management System Backend, including JSON examples for inputs and outputs.

## 👑 Admin Endpoints

Base URL: `/admin`

### Authentication

#### Admin Login
**Method:** POST  
**Path:** `/adminslogin`  
**Description:** Authenticate an administrator.

**Input:**
```json
{
  "email": "admin@college.edu",
  "password": "securepassword123",
  "deviceInfo": "Chrome on Windows 10"
}
```

**Output:**
```json
{
  "success": true,
  "message": "Admin login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR...",
  "role": "admin",
  "data": {
    "id": 1,
    "email": "admin@college.edu",
    "name": "Chief Warden"
  },
  "refreshtokenId": 101
}
```

#### Admin Logout
**Method:** POST  
**Path:** `/logout`  
**Description:** Logout the administrator.

**Input:**
```json
{}
```

**Output:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Students Management

#### Fetch Students
**Method:** POST  
**Path:** `/fetchstudents`  
**Description:** Fetch a list of students with optional filters.

**Input:**
```json
{
  "page": 1,
  "limit": 10,
  "department": "CSE",
  "academic_year": "2024",
  "status": "true" 
}
```

**Output:**
```json
{
  "success": true,
  "page": 1,
  "limit": 10,
  "fetched": 10,
  "hasMore": true,
  "students": [
    {
      "id": 10,
      "name": "John Doe",
      "email": "john@example.com",
      "registration_number": "REG2024001",
      "department": "CSE",
      "academic_year": "2024",
      "status": true
    }
  ]
}
```

#### Update Student Details
**Method:** POST  
**Path:** `/studentupdate`  
**Description:** Update specific fields of a student's profile.

**Input:**
```json
{
  "id": 15,
  "name": "Jane Doe",
  "student_contact_number": "9876543210",
  "address": "123 New Hostel Block",
  "token": "current_session_token"
}
```

**Output:**
```json
{
  "success": true,
  "data": {
    "id": 15,
    "name": "Jane Doe",
    "student_contact_number": "9876543210",
    "address": "123 New Hostel Block"
  },
  "token": "current_session_token"
}
```

#### Approve Student
**Method:** PUT  
**Path:** `/approve/:id`  
**Description:** Approve a student's pending registration.

**Input:**
*(No Body, ID in URL)*

**Output:**
```json
{
  "success": true,
  "message": "Student approved successfully"
}
```

#### Reject Student
**Method:** PUT  
**Path:** `/adminreject/:id`  
**Description:** Reject a student's pending registration.

**Input:**
```json
{
  "reason": "Invalid documents provided",
  "token": "admin_token"
}
```

**Output:**
```json
{
  "success": true,
  "message": "Student rejected",
  "token": "admin_token"
}
```

### Attendance

#### Show Attendance
**Method:** POST  
**Path:** `/showattends`  
**Description:** Fetch attendance records for students.

**Input:**
```json
{
  "date": "2024-02-01",
  "department": "CSE",
  "status": "Present",
  "page": 1,
  "limit": 20,
  "token": "admin_token"
}
```

**Output:**
```json
{
  "success": true,
  "data": [
    {
      "student_id": 101,
      "name": "Alice",
      "attendance_status": "Present",
      "date": "2024-02-01"
    }
  ],
  "total": 50,
  "page": 1,
  "token": "admin_token"
}
```

#### Export Attendance
**Method:** POST  
**Path:** `/exportattendance`  
**Description:** Export attendance data to CSV and email it.

**Input:**
```json
{
  "from": "2024-01-01",
  "to": "2024-01-31",
  "email": "admin@college.edu",
  "delete1": false,
  "token": "admin_token"
}
```

**Output:**
```json
{
  "success": true,
  "message": "Attendance exported successfully"
}
```

### Complaints

#### Fetch Complaints
**Method:** POST  
**Path:** `/fetchcomplaintforadmins`  
**Description:** Fetch student complaints with filters.

**Input:**
```json
{
  "status": "pending",
  "priority": "high",
  "page": 1,
  "limit": 10,
  "token": "admin_token"
}
```

**Output:**
```json
{
  "success": true,
  "data": [
    {
      "id": 5,
      "title": "Water Leakage",
      "description": "Tap leaking in room 302",
      "student_name": "Bob",
      "priority": "high",
      "status": "pending"
    }
  ],
  "pagination": {
    "total": 5,
    "totalPages": 1
  },
  "token": "admin_token"
}
```

#### Resolve Complaint
**Method:** POST  
**Path:** `/resolvecomplaints`  
**Description:** Mark a complaint as resolved.

**Input:**
```json
{
  "complaint_id": 5,
  "token": "admin_token"
}
```

**Output:**
```json
{
  "success": true,
  "message": "Complaint resolved",
  "token": "admin_token"
}
```

#### Change Complaint Status
**Method:** POST  
**Path:** `/complaintstatuschangeforadmin`  
**Description:** Update the status of a complaint (e.g., to "In Progress").

**Input:**
```json
{
  "complaint_id": 5,
  "status": "In Progress",
  "token": "admin_token"
}
```

**Output:**
```json
{
  "success": true,
  "message": "Status updated successfully",
  "token": "current_token"
}
```

### Departments

#### Add Department
**Method:** POST  
**Path:** `/adddepartments`  
**Description:** Create a new department.

**Input:**
```json
{
  "department": "Biotechnology",
  "token": "admin_token"
}
```

**Output:**
```json
{
  "success": true,
  "message": "Department created successfully"
}
```

#### Edit Department
**Method:** POST  
**Path:** `/editdepartment`  
**Description:** Rename an existing department.

**Input:**
```json
{
  "oldDepartment": "Biotechnology",
  "newDepartment": "Bio-Tech",
  "token": "admin_token"
}
```

**Output:**
```json
{
  "success": true,
  "message": "Department updated successfully"
}
```

#### Delete Department
**Method:** POST  
**Path:** `/deletedepartment`  
**Description:** Delete a department.

**Input:**
```json
{
  "department_id": 10,
  "token": "admin_token"
}
```

**Output:**
```json
{
  "success": true,
  "message": "Department deleted successfully"
}
```

### Announcements

#### Push Announcement
**Method:** POST  
**Path:** `/pushannocement`  
**Description:** Create and broadcast a new announcement.

**Input:**
```json
{
  "title": "Holiday Notice",
  "message": "Hostel closed for Pongal.",
  "priority": "high",
  "target": "all",
  "scheduled_date": "2024-01-14",
  "token": "admin_token"
}
```

**Output:**
```json
{
  "success": true,
  "message": "Announcement created successfully",
  "token": "admin_token"
}
```

#### Fetch Announcements
**Method:** POST  
**Path:** `/fetchannocementforadmin`  
**Description:** List all announcements.

**Input:**
```json
{
  "token": "admin_token"
}
```

**Output:**
```json
{
  "success": true,
  "announcements": [
    {
      "id": 1,
      "title": "Holiday Notice",
      "message": "Hostel closed for Pongal."
    }
  ],
  "token": "admin_token"
}
```

### Mess Bill

#### Create Monthly Bill
**Method:** POST  
**Path:** `/create`  
**Description:** Initialize mess bill parameters for a month.

**Input:**
```json
{
  "month_year": "02-2024",
  "mess_fee_per_day": 100,
  "veg_extra_per_day": 0,
  "nonveg_extra_per_day": 50,
  "token": "admin_token"
}
```

**Output:**
```json
{
  "success": true,
  "message": "Monthly bill initialized",
  "token": "admin_token"
}
```

#### Fetch Student Mess Bills (New)
**Method:** POST  
**Path:** `/fetchstudentsmessbillnew`  
**Description:** Fetch generated bills for students.

**Input:**
```json
{
  "month_year": "02-2024",
  "department": "CSE",
  "academic_year": "2024",
  "page": 1,
  "limit": 10,
  "token": "admin_token"
}
```

**Output:**
```json
{
  "message": "Mess bill data fetched successfully.",
  "count": 10,
  "data": [
    {
      "student_id": 55,
      "student_name": "Charlie",
      "total_amount": 3500,
      "status": "unpaid"
    }
  ]
}
```

#### Show Bill to All
**Method:** POST  
**Path:** `/showmessbilltoall`  
**Description:** Enable visibility of the mess bill for students for a specific month.

**Input:**
```json
{
  "month_year": "02-2024",
  "token": "admin_token"
}
```

**Output:**
```json
{
  "success": true,
  "message": "Mess bill is now visible to students"
}
```

---

## 🎓 Student Endpoints

Base URL: `/students`

### Authentication

#### Register
**Method:** POST  
**Path:** `/register`  
**Description:** Register a new student account.

**Input:**
```json
{
  "name": "New Student",
  "email": "student@college.edu",
  "password": "securePass",
  "registration_number": "REG2024999",
  "department": "ECE",
  "academic_year": "2024",
  "student_contact_number": "9988776655",
  "parent_guardian_contact_number": "8877665544",
  "token": "email_verification_token"
}
```

**Output:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": 200,
    "email": "student@college.edu",
    "name": "New Student"
  }
}
```

#### Student Login
**Method:** POST  
**Path:** `/studentslogin`  
**Description:** Authenticate a student.

**Input:**
```json
{
  "email": "student@college.edu",
  "password": "securePass",
  "deviceInfo": "iPhone 13 Safari"
}
```

**Output:**
```json
{
  "success": true,
  "message": "Student login successful",
  "token": "ey...",
  "role": "student",
  "refreshtokenId": 505,
  "data": {
    "id": 200,
    "name": "New Student",
    "email": "student@college.edu"
  }
}
```

### Profile

#### My Stats
**Method:** POST  
**Path:** `/stats`  
**Description:** Fetch dashboard statistics for the logged-in student.

**Input:**
```json
{
  "student_id": 200,
  "token": "student_token"
}
```

**Output:**
```json
{
  "success": true,
  "stats": {
    "attendance_percentage": 85,
    "total_complaints": 2,
    "pending_bills": 0
  }
}
```

### Attendance

#### Mark Attendance
**Method:** POST  
**Path:** `/attendance`  
**Description:** Mark daily attendance with geolocation.

**Input:**
```json
{
  "id": 200,
  "lat": 12.9716,
  "lng": 77.5946,
  "token": "student_token"
}
```

**Output:**
```json
{
  "success": true,
  "message": "Attendance marked",
  "token": "student_token"
}
```

#### Show Attendance
**Method:** POST  
**Path:** `/showattendance`  
**Description:** View attendance history.

**Input:**
```json
{
  "id": 200,
  "date": "2024-02-01",
  "token": "student_token"
}
```

**Output:**
```json
{
  "success": true,
  "data": [
    {
      "date": "2024-02-01",
      "status": "Present"
    }
  ]
}
```

### Complaints

#### Register Complaint
**Method:** POST  
**Path:** `/registercomplaints`  
**Description:** Submit a new complaint.

**Input:**
```json
{
  "id": 200,
  "title": "Wi-Fi Issue",
  "description": "No internet signal in room 101",
  "category": "Maintenance",
  "priority": "medium",
  "token": "student_token"
}
```

**Output:**
```json
{
  "success": true,
  "message": "Complaint registered",
  "token": "student_token"
}
```

#### Fetch My Complaints
**Method:** POST  
**Path:** `/fetchcomplaintsforstudents`  
**Description:** Get list of complaints submitted by the student.

**Input:**
```json
{
  "id": 200,
  "token": "student_token"
}
```

**Output:**
```json
{
  "success": true,
  "complaints": [
    {
      "id": 5,
      "title": "Wi-Fi Issue",
      "status": "pending"
    }
  ]
}
```

### Notifications

#### Fetch Notifications
**Method:** POST  
**Path:** `/fetchnotificationforstudents`  
**Description:** Get notifications for the student.

**Input:**
```json
{
  "student_id": 200,
  "token": "student_token"
}
```

**Output:**
```json
{
  "success": true,
  "notifications": [
    {
      "id": 1,
      "title": "Holiday Notice",
      "message": "Hostel closed..."
    }
  ]
}
```

#### Dismiss Notification
**Method:** POST  
**Path:** `/dismissnotificationforstudent`  
**Description:** Dismiss or mark a notification as read.

**Input:**
```json
{
  "notification_id": 1,
  "token": "student_token"
}
```

**Output:**
```json
{
  "success": true,
  "message": "Notification dismissed"
}
```

### Payments

#### Create Order
**Method:** POST  
**Path:** `/create-order`  
**Description:** Initiate a payment order.

**Input:**
```json
{
  "student_id": 200,
  "year_month": "02-2024",
  "student_name": "New Student",
  "student_email": "student@college.edu",
  "amount": 3500
}
```

**Output:**
```json
{
  "payment_session_id": "session_123456",
  "order_id": "order_987654"
}
```

#### Show Bill By ID
**Method:** POST  
**Path:** `/showmessbillbyid1`  
**Description:** Fetch specific mess bill for the student.

**Input:**
```json
{
  "student_id": 200,
  "token": "student_token"
}
```

**Output:**
```json
{
  "success": true,
  "bill": {
    "total_amount": 3500,
    "status": "unpaid",
    "month_year": "02-2024"
  }
}
```

#### Payment History
**Method:** POST  
**Path:** `/fetch-transaction-history`  
**Description:** Fetch history of past transactions.

**Input:**
```json
{
  "student_id": 200,
  "month": "02",
  "year": "2024",
  "page": 1,
  "limit": 10,
  "token": "student_token"
}
```

**Output:**
```json
{
  "success": true,
  "data": [
    {
      "order_id": "order_123",
      "amount": 3500,
      "payment_status": "SUCCESS",
      "date": "2024-02-15"
    }
  ]
}
```

---

## 🔐 Session Management

#### Generate Token (Student)
**Method:** POST  
**Path:** `/students/generateauthtokenforstudent`  
**Description:** Refresh access token using refresh token.

**Input:**
```json
{
  "refreshtokenId": 505
}
```
*(Or passed via cookies)*

**Output:**
```json
{
  "success": true,
  "token": "new_access_token_ey...",
  "role": "student"
}
```

#### Remove Session (Logout Remote)
**Method:** POST  
**Path:** `/admin/remove-session`  
**Description:** Invalidate a specific session.

**Input:**
```json
{
  "sessionid": 101,
  "userid": 1,
  "role": "admin"
}
```

**Output:**
```json
{
  "message": "Session removed successfully"
}
```
