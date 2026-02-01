import express from "express";
import adminauth from "../../../controllers/adminauth.js";
import resolvecomplaints from "../../../controllers/admin/complaint/resolvecomplaints.js";
const resolvecomplaintsforadmins = express.Router();
resolvecomplaintsforadmins.use("/resolvecomplaints",adminauth,resolvecomplaints);
export default resolvecomplaintsforadmins;
