import express from "express";
import fetchcomplaintforadmins from "../../../controllers/admin/complaint/fetchcomplaintforadmins.js";
import adminauth from "../../../controllers/adminauth.js";
const fetchcomplaintforadminrouter = express.Router();
fetchcomplaintforadminrouter.use("/fetchcomplaintforadmins",adminauth,fetchcomplaintforadmins);
export default fetchcomplaintforadminrouter;
