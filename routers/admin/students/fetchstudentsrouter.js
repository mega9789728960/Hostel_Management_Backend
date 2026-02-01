import express from "express";
import fetchstudent from "../../../controllers/admin/student/fetchstudents.js";
import adminauth from "../../../middlewares/adminauth.js";
const fetchstudentrouter = express.Router();
fetchstudentrouter.post("/fetchstudents", adminauth,fetchstudent);
export default fetchstudentrouter


