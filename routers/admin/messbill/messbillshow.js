// routes/monthlyCalculation.js
import express from 'express';
import { fetchMonthlyCalculations } from '../../../controllers/admin/mesbill/messbillshow.js'; // adjust path

import authorisation from '../../../controllers/authorisation.js';

const messbillshow = express.Router();

// Route to create monthly calculation
messbillshow.post('/show', authorisation, fetchMonthlyCalculations);

export default messbillshow;   