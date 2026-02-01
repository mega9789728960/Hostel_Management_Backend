import express from "express";
import adddepartments from "../../../controllers/admin/departments/adddepartmets.js";
import adminauth from "../../../controllers/adminauth.js";
const adddepartmentsrouter = express.Router();
adddepartmentsrouter.use("/adddepartments",adminauth,adddepartments);
export default adddepartmentsrouter;
