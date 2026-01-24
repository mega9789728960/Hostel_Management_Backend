

import express from 'express';
import { getMessBillStatusByMonthYear } from '../../../controllers/admin/mesbill/getmessbillstatus.js';

import authorisation from '../../../controllers/authorisation.js';

const getmessbillstatus = express.Router();

// ✅ POST endpoint
getmessbillstatus.post('/getmessbillstatus', authorisation, getMessBillStatusByMonthYear);

export default getmessbillstatus;
