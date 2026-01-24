import express from 'express';
import studentLogout from '../../../controllers/student/logout/logout.js';

const studentLogoutRouter = express.Router();

studentLogoutRouter.post('/logout', studentLogout);

export default studentLogoutRouter;
