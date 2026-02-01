// routes/monthlyCalculation.js
import express from 'express';
import { updateMessBill } from '../../../controllers/admin/mesbill/updatestudentsmessbill.js'; // adjust path

import adminauth from '../../../controllers/adminauth.js';

const updatemessbill = express.Router();

// Route to create monthly calculation
updatemessbill.post('/upadatemessbill', adminauth, updateMessBill);

export default updatemessbill;   
