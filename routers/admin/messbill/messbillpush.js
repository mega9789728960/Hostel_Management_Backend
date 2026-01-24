// routes/monthlyCalculation.js
import express from 'express';
import { createMonthlyCalculation } from '../../../controllers/admin/mesbill/messbillpush.js'; // adjust path

import authorisation from '../../../controllers/authorisation.js';

const messbillpush = express.Router();

// Route to create monthly calculation
messbillpush.post('/create', authorisation, createMonthlyCalculation);

export default messbillpush;   