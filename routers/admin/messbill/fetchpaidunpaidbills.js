import express from 'express';
import { fetchPaidUnpaidBills } from '../../../controllers/admin/mesbill/fetchpaidunpaidbills.js';
import { fetchStudentMessBillsForAdmin } from '../../../controllers/admin/mesbill/fetchstudentmessbills.js';
import authorisation from '../../../controllers/authorisation.js';

const fetchPaidUnpaidRouter = express.Router();

fetchPaidUnpaidRouter.post('/fetch-paid-unpaid', authorisation, fetchPaidUnpaidBills);
fetchPaidUnpaidRouter.post('/fetch-student-mess-bills', authorisation, fetchStudentMessBillsForAdmin);

export default fetchPaidUnpaidRouter;
