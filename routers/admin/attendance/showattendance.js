import express from "express";
import adminauth from "../../../controllers/adminauth.js";
import showattendance from "../../../controllers/admin/attendance/showattendance.js";
const showattendancerouter = express.Router();
showattendancerouter.use("/showattends",adminauth,showattendance);
export default showattendancerouter;
