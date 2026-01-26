import express from 'express';
import fetchStudentPayments from '../../../controllers/student/payment/fetchpayments.js';

const paymentHistoryRouter = express.Router();

paymentHistoryRouter.post('/fetch-transaction-history', fetchStudentPayments);

export default paymentHistoryRouter;
