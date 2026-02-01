import express from "express";
import deleteannouncement from "../../../controllers/admin/announcement/deleteannouncement.js";
import adminauth from "../../../middlewares/adminauth.js";
const deleteannouncementrouter = express.Router();
deleteannouncementrouter.use("/deleteannounce",adminauth,deleteannouncement);
export default deleteannouncementrouter

