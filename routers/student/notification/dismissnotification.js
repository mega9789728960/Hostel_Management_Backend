import express from "express";
import dismissnotification from "../../../controllers/student/notification/dismissnotification.js";
import studentauth from "../../../middlewares/studentauth.js";
const dismissnotificationrouter= express.Router();
dismissnotificationrouter.use("/dismissnotificationforstudent",studentauth,dismissnotification);
export default dismissnotificationrouter
