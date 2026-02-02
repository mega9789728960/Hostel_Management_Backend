import express from "express";
import changePassword from "../../../controllers/student/settings/changePassword.js";
import studentauth from "../../../middlewares/studentauth.js";

const changePasswordRouter = express.Router();

changePasswordRouter.post("/change-password", studentauth, changePassword);

export default changePasswordRouter;
