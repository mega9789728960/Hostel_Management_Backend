import express from "express";
import changeattendancebyadmin from "../../../controllers/admin/attendance/changeattendanceforadmin.js";
import adminauth from "../../../middlewares/adminauth.js";
const changeattendanceforadminrouter = express.Router();
changeattendanceforadminrouter.use("/changeattendanceforadmin",adminauth,changeattendancebyadmin);
export default changeattendanceforadminrouter;

