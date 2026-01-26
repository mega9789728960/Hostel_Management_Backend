import express from "express";
import removesession from "../../controllers/removesession.js";

const removesessionrouter = express.Router();

removesessionrouter.post("/remove-session", removesession);

export default removesessionrouter;
