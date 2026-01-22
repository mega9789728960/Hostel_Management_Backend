import express from "express";
import forgotpasswordemailpush from "../../controllers/forgot_password/forgotpasswordmailpush.js";
const forgotpasswordemailpushrouter = express.Router();
forgotpasswordemailpushrouter.post("/forgotpasswordemailpush", forgotpasswordemailpush);
export default forgotpasswordemailpushrouter;