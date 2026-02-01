// routes/monthlyCalculation.js
import express from 'express';
import { updateMonthlyCalculation } from '../../../controllers/admin/mesbill/messbillupdate.js'; // adjust path

import adminauth from '../../../middlewares/adminauth.js';

const messbillupdate = express.Router();

// Route to create monthly calculation
messbillupdate.post('/update', adminauth, updateMonthlyCalculation);

export default messbillupdate;   

