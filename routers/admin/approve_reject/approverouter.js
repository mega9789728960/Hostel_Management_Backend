import express from "express"
import adminauth from "../../../middlewares/adminauth.js"
import approve from "../../../controllers/admin/approval/approve.js"
const approverouter = express.Router()
approverouter.put("/approve/:id", adminauth, approve)
export default approverouter;


