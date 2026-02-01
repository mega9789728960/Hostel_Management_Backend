// routes/monthlyCalculation.js
import express from 'express';
import { createMonthlyCalculation } from '../../../controllers/admin/mesbill/messbillpush.js'; // adjust path

import adminauth from '../../../middlewares/adminauth.js';

const messbillpush = express.Router();

// Route to create monthly calculation
messbillpush.post('/create', adminauth, createMonthlyCalculation);

export default messbillpush;   

