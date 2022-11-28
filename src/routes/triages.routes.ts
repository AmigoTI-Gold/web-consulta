import { Router, Request, Response } from 'express';
import { getRepository, createQueryBuilder } from 'typeorm';

import ITriage from '../interfaces/ITriage';
import Triage from '../models/Triage';

const triageRouter = Router();

triageRouter.post('/', async (request: Request, response: Response) => {
  const triage: ITriage = request.body;
  const triageRepository = getRepository(Triage);

  const newTriage = await triageRepository.save(
    triageRepository.create(triage),
  );
  return response.json({ triage_id: newTriage.id });
});

triageRouter.get('/:id', async (request: Request, response: Response) => {
  const { id } = request.params;

  const triageRepository = getRepository(Triage);
  const triage = await triageRepository.findOne({
    where: { id },
  });

  return response.json(triage);
});

triageRouter.put('/:id', async (request: Request, response: Response) => {
  const { id } = request.params;

  const triageRepository = getRepository(Triage);

  await triageRepository
    .createQueryBuilder('triages')
    .update()
    .set(request.body)
    .where('id = :id', { id })
    .execute();

  return response.status(204).json();
});

triageRouter.get('/', async (request: Request, response: Response) => {
  const result = await createQueryBuilder().connection.query(`
	select
		ap.id, ap.patient_id, ap.date as marcation_date,
		sp.name as specialist_name , sp."clinicalSpecialty" speciality,
		pa.name as patient_name, ap.status
		from appointments as ap  join specialists as sp
		on ap.specialist_id = sp.id
		join patients as pa
		on ap.patient_id = pa.id
    where ap.status = 'Pendente'
		order by ap.date
`);

  return response.status(200).json(result);
});

export default triageRouter;
