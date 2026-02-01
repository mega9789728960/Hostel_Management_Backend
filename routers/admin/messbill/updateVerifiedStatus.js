import express from "express";
import { updateVerifiedStatus } from "../../../controllers/admin/mesbill/updateVerifiedStatus.js";

import adminauth from '../../../middlewares/adminauth.js';

const updateVerifiedStatusrouter = express.Router();

// ✅ POST route to update verified field
updateVerifiedStatusrouter.post("/update-verified-status", adminauth, updateVerifiedStatus);

export default updateVerifiedStatusrouter;


