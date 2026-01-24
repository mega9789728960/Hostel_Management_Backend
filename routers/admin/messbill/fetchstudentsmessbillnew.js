// routes/monthlyCalculation.js
import express from 'express';
import { fetchMessBills } from '../../../controllers/admin/mesbill/fetchstudentsmessbillnew.js'; // adjust path

import authorisation from '../../../controllers/authorisation.js';

const fetchstudentsmessbillnew = express.Router();

// Route to create monthly calculation
fetchstudentsmessbillnew.post('/fetchstudentsmessbillnew', authorisation, fetchMessBills);

export default fetchstudentsmessbillnew;   