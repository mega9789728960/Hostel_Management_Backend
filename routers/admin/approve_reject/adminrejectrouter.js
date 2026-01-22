import express from "express";
import adminreject from "../../../controllers/admin/approval/adminreject.js";
import authorisation from "../../../controllers/authorisation.js";
const adminrejectrouter = express.Router();
adminrejectrouter.put("/adminreject/:id", authorisation, adminreject);
export default adminrejectrouter;