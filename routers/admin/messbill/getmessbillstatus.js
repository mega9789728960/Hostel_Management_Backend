

import express from 'express';
import { getMessBillStatusByMonthYear } from '../../../controllers/admin/mesbill/getmessbillstatus.js';

import adminauth from '../../../middlewares/adminauth.js';

const getmessbillstatus = express.Router();

// ✅ POST endpoint
getmessbillstatus.post('/getmessbillstatus', adminauth, getMessBillStatusByMonthYear);

export default getmessbillstatus;


