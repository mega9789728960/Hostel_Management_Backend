import express from 'express';
import { getDepartmentVerifications } from '../../../controllers/admin/mesbill/getDepartmentVerifications.js';
import adminauth from '../../../middlewares/adminauth.js';

const getDepartmentVerificationsRouter = express.Router();

getDepartmentVerificationsRouter.post('/get-department-verifications', adminauth, getDepartmentVerifications);

export default getDepartmentVerificationsRouter;
