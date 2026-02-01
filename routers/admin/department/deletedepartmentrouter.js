import express from "express";
import deletedepartment from "../../../controllers/admin/departments/deletedepartment.js";
import adminauth from "../../../middlewares/adminauth.js";
const deletedepartmentrouter = express.Router();
deletedepartmentrouter.use("/deletedepartment",adminauth,deletedepartment);
export default deletedepartmentrouter

