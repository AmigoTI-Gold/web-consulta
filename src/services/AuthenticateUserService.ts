import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { getRepository } from 'typeorm';

import authConfig from '../configs/auth';
import AppError from '../errors/AppError';

import User from '../models/User';

interface Request {
	username: string;
	password: string;
}

interface Response {
	user: User;
	token: string;
}

class AuthenticateUserService {
	public async excute({ username, password }: Request): Promise<Response> {
		const userRepository = getRepository(User);

		const user = await userRepository.findOne({
			where: { username },
		});

		if (!user) {
			throw new AppError('Nome de Utilizador/Senha incorrecta!', 401);
		}

		const passwordMatched = await compare(password, user.password);

		if (!passwordMatched) {
			throw new AppError(' Nome de Utilizador/Senha incorrecta!', 401);
		}

		const token = sign({}, authConfig.jwt.secret, {
			expiresIn: authConfig.jwt.expiresIn,
			subject: `${user.owner_id || user.id}`,
		});

		return {
			token,
			user,
		};
	}
}

export default AuthenticateUserService;
