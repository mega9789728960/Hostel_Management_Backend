import express from 'express';
import { updateShowFlagByMonthYear } from '../../../controllers/admin/mesbill/showmessbilltoall.js';

import adminauth from '../../../controllers/adminauth.js';

const showmessbilltoall = express.Router();

showmessbilltoall.post('/showmessbilltoall', adminauth, updateShowFlagByMonthYear);

export default showmessbilltoall;

