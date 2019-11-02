import { Router } from 'express';

import authMiddleware from './app/middlewares/auth';

import UserController from './app/controllers/UserController';
import SessionControler from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import RegistrationController from './app/controllers/RegistrationController';
import CheckinController from './app/controllers/CheckinController';
import HelpOrderController from './app/controllers/HelpOrderController';
import HelpOrderAnswerController from './app/controllers/HelpOrderAnswerController';

const routes = new Router();

routes.post('/users', UserController.store);

routes.post('/sessions', SessionControler.store);

routes.post('/students/:id/help-orders', HelpOrderController.store);

routes.use(authMiddleware);

routes.post('/students', StudentController.store);
routes.put('/students', StudentController.update);
routes.get('/students', StudentController.index);

routes.put('/users', UserController.update);
routes.get('/users', UserController.index);

routes.post('/plans', PlanController.store);
routes.put('/plans/:id', PlanController.update);
routes.get('/plans', PlanController.index);
routes.delete('/plans/:id', PlanController.delete);

routes.post('/registration', RegistrationController.store);
routes.get('/registration/:id', RegistrationController.show);
routes.get('/registration', RegistrationController.index);
routes.put('/registration/:id', RegistrationController.update);
routes.delete('/registration/:id', RegistrationController.delete);

routes.post('/students/:id/checkins', CheckinController.store);
routes.get('/students/:id/checkins', CheckinController.index);

routes.get('/students/help-orders', HelpOrderController.index);
routes.get('/students/:id/help-orders', HelpOrderController.show);
routes.post('/students/:id/help-orders', HelpOrderController.store);

routes.post('/help-orders/:id/answer', HelpOrderAnswerController.store);

export default routes;
