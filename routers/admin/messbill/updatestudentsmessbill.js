// routes/monthlyCalculation.js
import express from 'express';
import { updateMessBill } from '../../../controllers/admin/mesbill/updatestudentsmessbill.js'; // adjust path

import authorisation from '../../../controllers/authorisation.js';

const updatemessbill = express.Router();

// Route to create monthly calculation
updatemessbill.post('/upadatemessbill', authorisation, updateMessBill);

export default updatemessbill;   