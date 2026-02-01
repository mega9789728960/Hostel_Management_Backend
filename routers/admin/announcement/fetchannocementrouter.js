import express from "express";
import fetchannocement from "../../../controllers/admin/announcement/fetchannocement.js";
import adminauth from "../../../controllers/adminauth.js";
const fetchannocementrouter = express.Router();
fetchannocementrouter.use("/fetchannocementforadmin",adminauth,fetchannocement);
export default fetchannocementrouter
