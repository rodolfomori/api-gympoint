import { Router } from 'express';

import authMiddleware from './app/middlewares/auth';

import UserController from './app/controllers/UserController';
import SessionControler from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionControler.store);

routes.use(authMiddleware);

routes.post('/students', StudentController.store);
routes.put('/students', StudentController.update);
routes.get('/students', StudentController.index);

routes.put('/users', UserController.update);
routes.get('/users', UserController.index);

routes.post('/plans', PlanController.store);
// routes.put('/plans', PlanController.update);
// routes.get('/plans', PlanController.index);

export default routes;
