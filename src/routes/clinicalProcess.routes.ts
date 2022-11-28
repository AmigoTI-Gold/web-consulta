import { Router, Request, Response } from 'express';
import { getRepository } from 'typeorm';

import IclinicalProcess from '../interfaces/IClinicalProcess';
import ClinicalProcess from '../models/ClinicalProcess';

const clinicalProcessRouter = Router();

clinicalProcessRouter.post(
	'/',
	async (request: Request, response: Response) => {
		const clinicalProcess: IclinicalProcess = request.body;
		const clinicalProcessRepository = getRepository(ClinicalProcess);

		const newclinicalProcess = await clinicalProcessRepository.save(
			clinicalProcessRepository.create(clinicalProcess),
		);
		return response.json({ clinicalProcess_id: newclinicalProcess.id });
	},
);

clinicalProcessRouter.get(
	'/:id',
	async (request: Request, response: Response) => {
		const { id } = request.params;

		const clinicalprocessRepository = getRepository(ClinicalProcess);
		const clinicalProcess = await clinicalprocessRepository.findOne({
			where: { id },
		});

		return response.json(clinicalProcess);
	},
);

clinicalProcessRouter.put(
	'/:id',
	async (request: Request, response: Response) => {
		const { id } = request.params;

		const clinicalProcessRepository = getRepository(ClinicalProcess);

		await clinicalProcessRepository
			.createQueryBuilder('ClinicalProcess')
			.update()
			.set(request.body)
			.where('id = :id', { id })
			.execute();

		return response.status(204).json();
	},
);

export default clinicalProcessRouter;
