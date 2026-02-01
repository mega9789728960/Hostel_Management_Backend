import express from "express";
import adminreject from "../../../controllers/admin/approval/adminreject.js";
import adminauth from "../../../middlewares/adminauth.js";
const adminrejectrouter = express.Router();
adminrejectrouter.put("/adminreject/:id", adminauth, adminreject);
export default adminrejectrouter;

