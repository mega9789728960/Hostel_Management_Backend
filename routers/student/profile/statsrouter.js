import express from "express";
import fetchProfileStats from "../../../controllers/student/profile/fetchstats.js";

const statsrouter = express.Router();

// Using POST to easily send student_id in body, matching pattern seen in other files
statsrouter.post("/stats", fetchProfileStats);

export default statsrouter;
