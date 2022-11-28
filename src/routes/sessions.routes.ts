import { Router } from 'express';

import AuthenticateUserService from '../services/AuthenticateUserService';

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
	const { username, password } = request.body;

	const authenticateUserService = new AuthenticateUserService();
	const { user, token } = await authenticateUserService.excute({
		password,
		username,
	});

	delete user.password;
	response.cookie('token', token, { httpOnly: true });
	return response.json({ ...user });
});

sessionsRouter.post('/logout', async (request, response) => {
	response.cookie('token', '', { httpOnly: true });
	return response.json();
});

export default sessionsRouter;
