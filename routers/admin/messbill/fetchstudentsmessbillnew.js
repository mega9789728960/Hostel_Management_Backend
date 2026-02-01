// routes/monthlyCalculation.js
import express from 'express';
import { fetchMessBills } from '../../../controllers/admin/mesbill/fetchstudentsmessbillnew.js'; // adjust path

import adminauth from '../../../middlewares/adminauth.js';

const fetchstudentsmessbillnew = express.Router();

// Route to create monthly calculation
fetchstudentsmessbillnew.post('/fetchstudentsmessbillnew', adminauth, fetchMessBills);

export default fetchstudentsmessbillnew;   

