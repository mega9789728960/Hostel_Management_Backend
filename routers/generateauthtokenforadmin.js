import generateauthtokenforadmin from "../controllers/generateauthtokenforadmin";
import express from "express";
const generateauthtokenforadminRouter = express.Router();
generateauthtokenforadminRouter.post("/generateauthtokenforadmin", generateauthtokenforadmin);
export default generateauthtokenforadminRouter;