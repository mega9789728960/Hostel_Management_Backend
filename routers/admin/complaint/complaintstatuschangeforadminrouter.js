import express from "express";
import complaintstatuschangeforadmin from "../../../controllers/admin/complaint/complaintstatuschangeforadmin.js";
import adminauth from "../../../middlewares/adminauth.js";
const complaintstatuschangeforadminrouter = express.Router();
complaintstatuschangeforadminrouter.use("/complaintstatuschangeforadmin",adminauth,complaintstatuschangeforadmin);
export default complaintstatuschangeforadminrouter;


