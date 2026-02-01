// routes/monthlyCalculation.js
import express from 'express';
import { fetchMonthlyCalculations } from '../../../controllers/admin/mesbill/messbillshow.js'; // adjust path

import adminauth from '../../../controllers/adminauth.js';

const messbillshow = express.Router();

// Route to create monthly calculation
messbillshow.post('/show', adminauth, fetchMonthlyCalculations);

export default messbillshow;   
