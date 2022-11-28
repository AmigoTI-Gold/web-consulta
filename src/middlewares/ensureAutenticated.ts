import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '../configs/auth';
import AppError from '../errors/AppError';

interface tokenPayload {
	iat: number;
	exp: number;
	sub: string;
}

function EnsureAuthenticated(
	request: Request,
	response: Response,
	next: NextFunction,
): void {
	const { authorization } = request.headers;
	let token = authorization?.split(' ')[1];

	if (!token || token === 'undefined') {
		token = request.headers.cookie;

		token = token?.split('=')[1];
	}

	if (!token) {
		throw new AppError('Faça o login para poder continuar!', 401);
	}

	try {
		const decoded = verify(token, authConfig.jwt.secret);
		const { sub } = decoded as tokenPayload;

		request.user = {
			id: sub,
		};

		return next();
	} catch {
		throw new AppError('Token JWT invalido!', 401);
	}
}

export default EnsureAuthenticated;
