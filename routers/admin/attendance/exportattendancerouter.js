import express from "express";
import exportAttendance from "../../../controllers/admin/attendance/exportattendance.js";
import adminauth from "../../../controllers/adminauth.js";
const exportAttendancerouter = express.Router();
exportAttendancerouter.use("/exportattendance",adminauth,exportAttendance);
export default exportAttendancerouter
