import express from 'express';
import { fetchPaidUnpaidBills } from '../../../controllers/admin/mesbill/fetchpaidunpaidbills.js';
import { fetchStudentMessBillsForAdmin } from '../../../controllers/admin/mesbill/fetchstudentmessbills.js';
import adminauth from '../../../middlewares/adminauth.js';

const fetchPaidUnpaidRouter = express.Router();

fetchPaidUnpaidRouter.post('/fetch-paid-unpaid', adminauth, fetchPaidUnpaidBills);
fetchPaidUnpaidRouter.post('/fetch-student-mess-bills', adminauth, fetchStudentMessBillsForAdmin);

export default fetchPaidUnpaidRouter;


