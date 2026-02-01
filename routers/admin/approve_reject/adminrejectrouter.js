import express from "express";
import adminreject from "../../../controllers/admin/approval/adminreject.js";
import adminauth from "../../../controllers/adminauth.js";
const adminrejectrouter = express.Router();
adminrejectrouter.put("/adminreject/:id", adminauth, adminreject);
export default adminrejectrouter;
