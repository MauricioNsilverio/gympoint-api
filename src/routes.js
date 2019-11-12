import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import EnrollmentController from './app/controllers/EnrollmentController';
import CheckinController from './app/controllers/CheckinController';
import HelpRequestController from './app/controllers/HelpRequestController';
import AnswerHelpRequestController from './app/controllers/AnswerHelpRequestController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.get('/students/:id/checkins', CheckinController.index);
routes.post('/students/:id/checkins', CheckinController.store);

routes.post('/students/:id/help-requests', HelpRequestController.store); // Crie uma rota para o aluno cadastrar pedidos de auxílio apenas informando seu ID de cadastro (ID do banco de dados);
routes.get('/students/:id/help-requests', HelpRequestController.index); // Crie uma rota para listar todos pedidos de auxílio de um usuário com base em seu ID de cadastro;

routes.use(authMiddleware); // aplicado apenas na rota após ele

routes.post('/students', StudentController.store);
routes.put('/students', StudentController.update);

routes.put('/users', UserController.update);

routes.get('/plans', PlanController.index);
routes.post('/plans', PlanController.store);
routes.put('/plans/:id', PlanController.update);
routes.delete('/plans/:id', PlanController.delete);

routes.get('/enrollments', EnrollmentController.index);
routes.post('/enrollments', EnrollmentController.store);
routes.put('/enrollments/:id', EnrollmentController.update);
routes.delete('/enrollments/:id', EnrollmentController.delete);

routes.post('/help-requests/:id/answer', AnswerHelpRequestController.store); // Crie uma rota para a academia responder um pedido de auxílio:
routes.get('/students/help-requests', AnswerHelpRequestController.index); // Crie uma rota para a academia listar todos pedidos de auxílio sem resposta;

export default routes;
