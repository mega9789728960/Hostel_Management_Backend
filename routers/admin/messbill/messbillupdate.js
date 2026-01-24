// routes/monthlyCalculation.js
import express from 'express';
import { updateMonthlyCalculation } from '../../../controllers/admin/mesbill/messbillupdate.js'; // adjust path

import authorisation from '../../../controllers/authorisation.js';

const messbillupdate = express.Router();

// Route to create monthly calculation
messbillupdate.post('/update', authorisation, updateMonthlyCalculation);

export default messbillupdate;   