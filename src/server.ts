import morgan from 'morgan';
import 'reflect-metadata';
import 'express-async-errors';

import Cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';

import './database';
import routes from './routes';
import AppError from './errors/AppError';

const app = express();

app.use(express.static('Frontend'));

app.use(morgan('dev'));
app.use(Cors());

app.use(express.json());
app.use(routes);

app.get('/', (request, response) => {
	response.sendfile('login.html')
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use(
	(error: Error, request: Request, response: Response, _: NextFunction) => {
		if (error instanceof AppError) {
			return response.status(error.statusCode).json({
				status: 'error',
				message: error.message,
			});
		}

		console.error(error);

		return response.status(500).json({
			status: 'error',
			message: 'Internal server error',
		});
	},
);

app.listen(3333, () => {
	// eslint-disable-next-line no-console
	console.log('server is running 👨‍🎤');
});
