import express from "express";
import getsession from "../../controllers/getsession.js";

const getsessionrouter = express.Router();

getsessionrouter.post("/get-session", getsession);

export default getsessionrouter;
