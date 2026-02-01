# API Endpoints Documentation

This document outlines the API endpoints for the Hostel Management System Backend.

## 👑 Admin Endpoints

Base URL: `/admin`

### Authentication
| Endpoint | Method | Path | Inputs | Description |
|---|---|---|---|---|
| Admin Login | POST | `/adminslogin` | `email`, `password`, `deviceInfo` | Login for administrators. |
| Admin Logout | POST | `/logout` | (Cookie/Auth) | Logout administrator. |

### Students Management
| Endpoint | Method | Path | Inputs (Body) | Description |
|---|---|---|---|---|
| Fetch Students | POST | `/fetchstudents` | `department` (opt), `academic_year` (opt), `status` (opt), `id` (opt), `page`, `limit` | Fetch list of students with pagination and filters. |
| Update Student | POST | `/studentupdate` | `id`, `name`, `department`, `academic_year`, `registration_number`, `father_guardian_name`, `dob`, `blood_group`, `student_contact_number`, `parent_guardian_contact_number`, `address`, `roll_number`, `room_number`, `profile_photo` | Update student details. |
| Edit Student Details | POST | `/editstudentsdetails` | `id`, `...data` | Edit specific student details (generic). |
| Approve Student | PUT | `/approve/:id` | `id` (param) | Approve a student registration. |
| Reject Student | PUT | `/adminreject/:id` | `id` (param), `reason` | Reject a student registration. |

### Attendance
| Endpoint | Method | Path | Inputs (Body) | Description |
|---|---|---|---|---|
| Show Attendance | POST | `/showattends` | `date`, `status`, `department`, `academic_year`, `registration_number`, `page`, `limit` | Fetch attendance records. |
| Change Attendance | POST | `/changeattendanceforadmin` | `attendance_id`, `update`, `date`, `...data` | Modify attendance record. |
| Export Attendance | POST | `/exportattendance` | `from` (date), `to` (date), `email`, `delete1` (bool) | Export attendance to CSV/Email. |

### Complaints
| Endpoint | Method | Path | Inputs (Body) | Description |
|---|---|---|---|---|
| Fetch Complaints | POST | `/fetchcomplaintforadmins` | Filters (likely `status`, `category`) | Fetch complaints. |
| Resolve Complaint | POST | `/resolvecomplaints` | `complaint_id` | Mark complaint as resolved. |
| Change Status | POST | `/complaintstatuschangeforadmin` | `complaint_id`, `status` | Update complaint status. |

### Departments
| Endpoint | Method | Path | Inputs (Body) | Description |
|---|---|---|---|---|
| Add Department | POST | `/adddepartments` | `department` | Create a new department. |
| Edit Department | POST | `/editdepartment` | `oldDepartment`, `newDepartment` | Rename a department. |
| Delete Department | POST | `/deletedepartment` | `department_id` | Remove a department. |

### Announcements
| Endpoint | Method | Path | Inputs (Body) | Description |
|---|---|---|---|---|
| Push Announcement | POST | `/pushannocement` | `title`, `message`, `priority`, `target`, `scheduled_date` | Create/Schedule announcement. |
| Fetch Announcements | POST | `/fetchannocementforadmin` | `page`, `limit` | List announcements. |
| Edit Announcement | POST | `/editannouncementforadmin` | `announcement_id`, `...data` | Update announcement. |
| Delete Announcement | POST | `/deleteannounce` | `announcement_id` | Delete announcement. |

### Mess Bill
| Endpoint | Method | Path | Inputs (Body) | Description |
|---|---|---|---|---|
| Create Monthly Bill | POST | `/create` | `month_year`, `mess_fee_per_day`, `veg_extra_per_day`, `nonveg_extra_per_day` | Initialize monthly bill (messbillpush). |
| Show Calculations | POST | `/show` | `year` | Fetch monthly calculation data. |
| Update Calculation | POST | `/update` | `base_id`, `years_data`, `...fields` | Update cost parameters. |
| Update Student Bill | POST | `/upadatemessbill` | `id`, `...data` | Update specific student bill. |
| Fetch Bills (New) | POST | `/fetchstudentsmessbillnew` | `month_year`, `department`, `academic_year`, `page`, `limit` | Fetch student bills with status. |
| Show Bill to All | POST | `/showmessbilltoall` | `month_year` | Toggle visibility of bills. |
| Update Verified | POST | `/update-verified-status` | `ids` (array), `verified` (bool) | Verify payments/bills. |
| Get Bill Status | POST | `/getmessbillstatus` | `month_year` | Check status of bill generation. |
| Fetch Paid/Unpaid | POST | `/fetch-paid-unpaid` | `month_year`, `status`, `department`, `year` | Statistics/List of paid/unpaid. |

### Promotion
| Endpoint | Method | Path | Inputs (Body) | Description |
|---|---|---|---|---|
| Promote Students | POST | `/promotion` | `email`, `isdeletefinalyear` | Promote students to next year. |

---

## 🎓 Student Endpoints

Base URL: `/students`

### Authentication & Profile
| Endpoint | Method | Path | Inputs (Body) | Description |
|---|---|---|---|---|
| Student Login | POST | `/studentslogin` | `email`, `password`, `deviceInfo` | Student login. |
| Student Logout | POST | `/logout` | `user_id` (validation) | Student logout. |
| Register | POST | `/register` | `name`, `email`, `password`, `department`, `year`, ... | Student registration. |
| Email Verify | POST | `/emailverify` | `email`, `code` | Verify email code. |
| Send Code | POST | `/sendcode` | `email` | Send verification code. |
| Fetch Profile Stats | POST | `/stats` | `student_id` | Get student dashboard stats. |

### Attendance
| Endpoint | Method | Path | Inputs (Body) | Description |
|---|---|---|---|---|
| Mark Attendance | POST | `/attendance` | `id`, `lat`, `lng` | Mark present. |
| Mark Absent | POST | `/absent` | `id`, `lat`, `lng` | Mark absent (if applicable) or check constraint. |
| Show Attendance | POST | `/showattendance` | `id`, `date`, `month` | View attendance history. |

### Complaints
| Endpoint | Method | Path | Inputs (Body) | Description |
|---|---|---|---|---|
| Register Complaint | POST | `/registercomplaints` | `id`, `title`, `description`, `category`, `priority` | Submit a complaint. |
| Fetch Complaints | POST | `/fetchcomplaintsforstudents` | `id` | View my complaints. |
| Edit Complaint | PUT | `/editcomplaints` | `complaint_id`, `title`, `description`, `category`, `priority` | Update complaint. |

### Notifications
| Endpoint | Method | Path | Inputs (Body) | Description |
|---|---|---|---|---|
| Fetch Notifications | POST | `/fetchnotificationforstudents` | `student_id` | Get notifications. |
| Dismiss Notification| POST | `/dismissnotificationforstudent`| `notification_id` | Mark notification read/dismissed. |

### Payments & Mess Bill
| Endpoint | Method | Path | Inputs (Body) | Description |
|---|---|---|---|---|
| Show Bill By ID | POST | `/showmessbillbyid1` | `student_id` | Get my mess bill. |
| Payment History | POST | `/fetch-transaction-history` | `student_id`, `month`, `year`, `page`, `limit` | View payment history. |
| Create Order | POST | `/create-order` | `student_id`, `year_month`, `student_name`, `student_email`, `amount` | Initiate payment (DB). |
| Create Order (Direct) | POST | `/create-order1` | `student_id`, `student_name`, `student_email`, `student_phone`, `amount` | Initiate payment (Direct PG). |
| Verify Payment | POST | `/verify-payment` | `orderId` | Verify payment status from PG. |

### General
| Endpoint | Method | Path | Inputs (Body) | Description |
|---|---|---|---|---|
| Fetch Departments | GET | `/fetchdepartments` | (None) | List available departments. |

---

## 🔐 Session Management

| Endpoint | Method | Path | Inputs | Description |
|---|---|---|---|---|
| Generate Token (Student) | POST | `/students/generateauthtokenforstudent` | `refreshtokenId` (in body or cookie) | Refresh access token for students. |
| Generate Token (Admin) | POST | `/admin/generateauthtokenforadmin` | `refreshtokenId` | Refresh access token for admins. |
| Get Session | POST | `/admin/get-session` or `/students/get-session` | `userid`, `role` | Validate and retrieve session details. |
| Remove Session | POST | `/admin/remove-session` or `/students/remove-session` | `sessionid`, `userid`, `role` | Invalidate a session. |

---

## 🔑 Account Recovery (Forgot Password)
Base URL: `/students` (Usually shared or specific prefix)

| Endpoint | Method | Path | Inputs (Body) | Description |
|---|---|---|---|---|
| Email Push | POST | `/forgotpasswordemailpush` | `email` | Initiate password reset. |
| Send Code | POST | `/forgotpasswordsendcode` | `email` | Send reset code. |
| Verify Code | POST | `/veriycodeforgot` | `email`, `code` | Verify reset code. |
| Change Password | POST | `/changepassword` | `email`, `password` | Set new password. |
