import express from "express";
import showattendance from "../../../controllers/student/attendance/showattendance.js";
import studentauth from "../../../middlewares/studentauth.js";

const showattendancerouter = express.Router();

showattendancerouter.post("/showattendance", studentauth, showattendance);

export default showattendancerouter;

