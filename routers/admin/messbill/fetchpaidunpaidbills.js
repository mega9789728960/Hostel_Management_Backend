import express from 'express';
import { fetchPaidUnpaidBills } from '../../../controllers/admin/mesbill/fetchpaidunpaidbills.js';
import authorisation from '../../../controllers/authorisation.js';

const fetchPaidUnpaidRouter = express.Router();

fetchPaidUnpaidRouter.post('/fetch-paid-unpaid', authorisation, fetchPaidUnpaidBills);

export default fetchPaidUnpaidRouter;
