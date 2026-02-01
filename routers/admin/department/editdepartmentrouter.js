import express from "express";
import editdepartment from "../../../controllers/admin/departments/editdepartment.js";
import adminauth from "../../../controllers/adminauth.js";
const editdepartmentrouter = express.Router();
editdepartmentrouter.use("/editdepartment",adminauth,editdepartment)
export default editdepartmentrouter
