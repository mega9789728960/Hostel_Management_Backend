import express from "express";
import fetchcomplaintsforstudents from "../../../controllers/student/complaint/fetchcomplaintsforstudents.js";
import studentauth from "../../../middlewares/studentauth.js";
const fetchcomplaintsforstudentsrouter = express.Router();
fetchcomplaintsforstudentsrouter.use("/fetchcomplaintsforstudents",studentauth,fetchcomplaintsforstudents);
export default fetchcomplaintsforstudentsrouter;
