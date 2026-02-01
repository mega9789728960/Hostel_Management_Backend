import express from "express";
import absent from "../../../controllers/student/attendance/adsent.js";
import studentauth from "../../../middlewares/studentauth.js";
const absentrouter = express.Router();
absentrouter.use("/absent",studentauth,absent);
export default absentrouter;
