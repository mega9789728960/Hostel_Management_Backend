import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import sanitizeInput from "../controllers/sanitizeInput.js";

import compression from "compression";
import crypto from "crypto"
import { Cashfree } from "cashfree-pg";


const cashfreeClient = new Cashfree({
  clientId: process.env.CLIENT_ID || "TEST108360771478c4665f846cfe949877063801",
  clientSecret: process.env.CLIENT_SECRET || "cfsk_ma_test_b560921740a233497ed2b83bf3ce4599_113f10f2",
  env: "sandbox", // sandbox or production
});
function generateOrderId() {
  const uniqueId = crypto.randomBytes(16).toString("hex");
  const hash = crypto.createHash("sha256");
  hash.update(uniqueId);
  return hash.digest("hex").substr(0, 12);
}


dotenv.config();

// Create express app
const api = express();
// ✅ Allow ALL origins + credentials
api.use(
  cors({
    origin: true,   // reflect request origin
    credentials: true,
  })
);

import webhook from "../routers/student/payment/webhook.js";
api.use(webhook);

api.use(express.json({ limit: "10mb" }));
api.use(express.urlencoded({ limit: "10mb", extended: true }));

api.use(cookieParser());
api.use(sanitizeInput);






// 2️⃣ Callback route after Google login

api.use(compression());
// ✅ Import rout
import studentsupdaterouter from "../routers/admin/students/studentsupdaterouter.js"
import emailpushrouter from "../routers/account_creation/emailpushrouter.js";
import resolvecomplaintsforadmins from "../routers/admin/complaint/resolvecomplaintsforadmins.js";
import editcomplaintrouter from "../routers/student/complaints/editcomplaintrouter.js";
import emailverifyrouter from "../routers/account_creation/emailverifyrouter.js";
import sendcoderouter from "../routers/account_creation/sendcoderouter.js";
import registerrouter from "../routers/account_creation/registerrouter.js";
import fetchstudentrouter from "../routers/admin/students/fetchstudentsrouter.js";
import approverouter from "../routers/admin/approve_reject/approverouter.js";
import studentLoginRouter from "../routers/student/login/studentsLoginRouter.js";
import adminLoginRouter from "../routers/admin/login/adminLoginRouter.js";
import editstudentsdetailsrouter from "../routers/admin/students/editstudentsdetailsrouter.js";
import attendancerouter from "../routers/student/attendance/attendancerouter.js";
import showattendancestudentrouter from "../routers/student/attendance/showattendancerouter.js";
import fetchcomplaintforadminrouter from "../routers/admin/complaint/fetchcomplaintforadminsrouter.js";
import showattendancerouter from "../routers/admin/attendance/showattendance.js";
import registercomplaintrouter from "../routers/student/complaints/registercomplaintrouter.js";
import fetchcomplaintsforstudentsrouter from "../routers/student/complaints/fetchcomplaintsforstudentsrouter.js"
import complaintstatuschangeforadminrouter from "../routers/admin/complaint/complaintstatuschangeforadminrouter.js"; // Correct import
import forgotpasswordemailpushrouter from "../routers/forgot_password/forgotpasswordemailpushrouter.js";
import forgotpasswordsendcoderouter from "../routers/forgot_password/forgotpasswordsendcoderouter.js";
import verifycodeforgotrouter from "../routers/forgot_password/verifycodeforgotrouter.js";
import changepassowordrouter from "../routers/forgot_password/changepasswordrouter.js";
import adminrejectrouter from "../routers/admin/approve_reject/adminrejectrouter.js";
import absentrouter from "../routers/student/attendance/absentrouter.js";
import changeattendanceforadminrouter from "../routers/admin/attendance/changeattendancebyadminrouter.js";
import adddepartmentsrouter from "../routers/admin/department/adddepartmentsrouter.js";
import fetchdepartmentsrouter from "../routers/account_creation/fetchdepartmentsrouter.js";
import editdepartmentrouter from "../routers/admin/department/editdepartmentrouter.js";
import promotionrouter from "../routers/admin/promotion/promotionrouter.js"
import exportAttendancerouter from "../routers/admin/attendance/exportattendancerouter.js";
import pushannocementrouter from "../routers/admin/announcement/pushannocement.js";
import editannouncementforadminrouter from "../routers/admin/announcement/editannouncementrouter.js";
import fetchannocementrouter from "../routers/admin/announcement/fetchannocementrouter.js";
import deletedepartmentrouter from "../routers/admin/department/deletedepartmentrouter.js";
import fetchNotificationForStudentsrouter from "../routers/student/notification/fetchNotificationForStudentsrouter.js";
import dismissannouncementforstudentrouter from "../routers/student/notification/dismissnotification.js";
import deleteannouncementrouter from "../routers/admin/announcement/deleteannouncementrouter.js";
import statsrouter from "../routers/student/profile/statsrouter.js";
import logoutrouter from "../routers/admin/logout/logout.js";
import studentLogoutRouter from "../routers/student/logout/logout.js";

import paymentHistoryRouter from "../routers/student/payment/payment_history.js";

import createorderrouter from "../routers/student/payment/createorder.js";
import messbillpush from "../routers/admin/messbill/messbillpush.js";
import messbillshow from "../routers/admin/messbill/messbillshow.js";


import messbillupdate from "../routers/admin/messbill/messbillupdate.js";

import updatemessbill from "../routers/admin/messbill/updatestudentsmessbill.js";


import showMessBillsByIdRouter from "../routers/student/payment/billsfetch.js";

import fetchstudentsmessbillnew from "../routers/admin/messbill/fetchstudentsmessbillnew.js";

import showmessbilltoall from "../routers/admin/messbill/showmessbilltoall.js";
import updateVerifiedStatusrouter from "../routers/admin/messbill/updateVerifiedStatus.js";

import getmessbillstatus from "../routers/admin/messbill/getmessbillstatus.js";
import generateauthtokenRouter from "../routers/generateauthtokenforstudent.js";
import generateauthtokenforadminRouter from "../routers/generateauthtokenforadmin.js";
import fetchPaidUnpaidRouter from "../routers/admin/messbill/fetchpaidunpaidbills.js";
import getsessionrouter from "../routers/session/getsessionrouter.js";
import removesessionrouter from "../routers/session/removesessionrouter.js";



// ✅ Use routers

// 🎓 Student Routes
api.use("/students", [
  emailpushrouter,
  sendcoderouter,
  emailverifyrouter,
  registerrouter,
  studentLoginRouter,
  forgotpasswordemailpushrouter,
  forgotpasswordsendcoderouter,
  verifycodeforgotrouter,
  changepassowordrouter,
  attendancerouter,
  showattendancestudentrouter,
  registercomplaintrouter,
  editcomplaintrouter,
  fetchcomplaintsforstudentsrouter,
  absentrouter,
  fetchNotificationForStudentsrouter,
  dismissannouncementforstudentrouter,
  createorderrouter,
  showMessBillsByIdRouter,
  generateauthtokenRouter,
  generateauthtokenRouter,
  fetchdepartmentsrouter,
  fetchdepartmentsrouter,
  statsrouter,
  studentLogoutRouter,
  getsessionrouter,
  removesessionrouter,
  paymentHistoryRouter
]);

// 👑 Admin Routes
api.use("/admin", [
  adminLoginRouter,
  fetchstudentrouter,
  approverouter,
  studentsupdaterouter,
  editstudentsdetailsrouter,
  showattendancerouter,
  fetchcomplaintforadminrouter,
  resolvecomplaintsforadmins,
  adminrejectrouter,
  changeattendanceforadminrouter,
  adddepartmentsrouter,
  editdepartmentrouter,
  promotionrouter,
  exportAttendancerouter,
  pushannocementrouter,
  fetchannocementrouter,
  editannouncementforadminrouter,
  deletedepartmentrouter,
  deleteannouncementrouter,
  logoutrouter,
  messbillpush,
  messbillshow,
  messbillupdate,
  updatemessbill,
  fetchstudentsmessbillnew,
  showmessbilltoall,
  updateVerifiedStatusrouter,
  getmessbillstatus,
  generateauthtokenforadminRouter,
  complaintstatuschangeforadminrouter, // Added this router to the admin middleware stack
  fetchPaidUnpaidRouter,
  getsessionrouter,
  removesessionrouter
]);

// 💳 Order & Payment Routes
api.post("/students/create-order1", async (req, res) => {
  try {
    const { student_id, student_name, student_email, student_phone, amount } = req.body;
    const orderId = generateOrderId();

    const request = {
      order_amount: amount,
      order_currency: "INR",
      order_id: orderId,
      customer_details: {
        customer_id: student_id,
        customer_name: student_name,
        customer_email: student_email,
        customer_phone: student_phone,
      },
    };

    const response = await Cashfree.PGCreateOrder("2023-08-01", request);
    res.json(response.data);
  } catch (error) {
    console.error(error.response?.data || error);
    res.status(500).json({ message: "Order creation failed" });
  }
});

api.post("/students/verify-payment", async (req, res) => {
  try {
    const { orderId } = req.body;
    const response = await Cashfree.PGOrderFetchPayments("2023-08-01", orderId);
    const payments = response.data.payments || [];
    const status = payments.some((p) => p.status === "SUCCESS");
    res.json({ success: status, details: payments });
  } catch (error) {
    console.error(error.response?.data || error);
    res.status(500).json({ message: "Payment verification failed" });
  }
});





// ✅ Root route
api.get("/", (req, res) => {
  res.json({ message: "API is running ✅" });
});

api.listen(3001);