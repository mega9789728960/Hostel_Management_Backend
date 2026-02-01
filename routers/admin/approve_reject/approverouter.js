import express from "express"
import adminauth from "../../../controllers/adminauth.js"
import approve from "../../../controllers/admin/approval/approve.js"
const approverouter = express.Router()
approverouter.put("/approve/:id", adminauth, approve)
export default approverouter;

