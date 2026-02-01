import express from 'express';
import showMessBillsByStudentId from '../../../controllers/student/payment/billsfetch.js';
import studentauth from '../../../middlewares/studentauth.js';

const showMessBillsByIdRouter = express.Router();

showMessBillsByIdRouter.post('/showmessbillbyid1', studentauth, showMessBillsByStudentId);

export default showMessBillsByIdRouter;

