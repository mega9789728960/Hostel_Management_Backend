import express from 'express';
import studentLogout from '../../../controllers/student/logout/logout.js';
import studentauth from '../../../controllers/studentauth.js';

const studentLogoutRouter = express.Router();

studentLogoutRouter.post('/logout', studentauth, studentLogout);

export default studentLogoutRouter;
