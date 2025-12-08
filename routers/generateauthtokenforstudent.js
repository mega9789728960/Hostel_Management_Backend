import express from 'express';
import generateauthtoken from '../controllers/generateauthtokenforstudent.js';

const generateauthtokenRouter = express.Router();

generateauthtokenRouter.use('/generateauthtokenforstudent',generateauthtoken);
export default generateauthtokenRouter;