import express from 'express';
import { updateShowFlagByMonthYear } from '../../../controllers/admin/mesbill/showmessbilltoall.js';

import authorisation from '../../../controllers/authorisation.js';

const showmessbilltoall = express.Router();

showmessbilltoall.post('/showmessbilltoall', authorisation, updateShowFlagByMonthYear);

export default showmessbilltoall;
