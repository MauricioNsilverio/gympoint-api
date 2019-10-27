import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware); // aplicado apenas na rota após ele

routes.post('/students', StudentController.store);

routes.put('/students', StudentController.update);
routes.put('/users', UserController.update);

export default routes;
