import express from "express";
import editannouncementforadmin from "../../../controllers/admin/announcement/editannouncement.js";
import adminauth from "../../../controllers/adminauth.js";
const editannouncementforadminrouter = express.Router();
editannouncementforadminrouter.use("/editannouncementforadmin",adminauth,editannouncementforadmin);
export default editannouncementforadminrouter;
