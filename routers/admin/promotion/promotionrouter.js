import express from "express";
import promotion from "../../../controllers/admin/promotion/promotion.js";
import adminauth from "../../../controllers/adminauth.js";
const promotionrouter = express.Router();
promotionrouter.use("/promotion",adminauth,promotion);
export default promotionrouter;
