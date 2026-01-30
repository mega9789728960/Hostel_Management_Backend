import express from "express";
import changepassword from "../../controllers/forgot_password/changepassword.js";
const changepassowordrouter = express.Router();
changepassowordrouter.post("/changepassword", changepassword);
export default changepassowordrouter;