import editstudentsdetails from "../../../controllers/student/details/editstudentsdetails.js";
import adminauth from "../../../middlewares/adminauth.js";
import express from "express";
const editstudentsdetailsrouter = express.Router();
editstudentsdetailsrouter.use("/editstudentsdetails",adminauth,editstudentsdetails);
export default editstudentsdetailsrouter;

