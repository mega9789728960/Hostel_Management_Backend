import express from "express";
import editcomplaint from "../../../controllers/student/complaint/editcomplaint.js";
import studentauth from "../../../middlewares/studentauth.js";
const editcomplaintrouter = express.Router();
editcomplaintrouter.put("/editcomplaints", studentauth,editcomplaint);
export default editcomplaintrouter;

