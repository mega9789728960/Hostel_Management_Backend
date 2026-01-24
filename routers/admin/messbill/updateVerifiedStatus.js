import express from "express";
import { updateVerifiedStatus } from "../../../controllers/admin/mesbill/updateVerifiedStatus.js";

import authorisation from '../../../controllers/authorisation.js';

const updateVerifiedStatusrouter = express.Router();

// ✅ POST route to update verified field
updateVerifiedStatusrouter.post("/update-verified-status", authorisation, updateVerifiedStatus);

export default updateVerifiedStatusrouter;
