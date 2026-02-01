import express from "express";
import exportAttendance from "../../../controllers/admin/attendance/exportattendance.js";
import adminauth from "../../../middlewares/adminauth.js";
const exportAttendancerouter = express.Router();
exportAttendancerouter.use("/exportattendance",adminauth,exportAttendance);
export default exportAttendancerouter

