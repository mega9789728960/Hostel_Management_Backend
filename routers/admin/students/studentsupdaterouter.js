import express from "express";
import adminauth from "../../../controllers/adminauth.js";
import studentsupdate from "../../../controllers/admin/student/studentsupdate.js";
const studentsupdaterouter = express.Router();
studentsupdaterouter.use("/studentupdate",adminauth,studentsupdate);
export default studentsupdaterouter
