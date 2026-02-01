import express from "express";
import pushannocement from "../../../controllers/admin/announcement/pushannocement.js";
import adminauth from "../../../middlewares/adminauth.js";
const pushannocementrouter = express.Router();
pushannocementrouter.use("/pushannocement",adminauth,pushannocement);
export default pushannocementrouter

