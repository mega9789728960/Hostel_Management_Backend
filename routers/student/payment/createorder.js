import express from "express";
import createorder from "../../../controllers/student/payment/createorder.js";
import studentauth from "../../../middlewares/studentauth.js";
const createorderrouter = express.Router();
createorderrouter.post("/create-order", studentauth, createorder);
export default createorderrouter
