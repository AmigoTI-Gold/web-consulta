import { Router } from 'express';
import { getRepository } from 'typeorm';

import IPatient from '../interfaces/IPatient';
import Patient from '../models/Patient';
import AppError from '../errors/AppError';

const patientsRouter = Router();

patientsRouter.get('/:id', async (request, response) => {
  const { id } = request.params;

  const patientsRepository = getRepository(Patient);
  const patient = await patientsRepository.findOne({
    where: { id },
  });

  if (!patient) {
    throw new AppError('Paciente não encotrado!', 404);
  }

  return response.json(patient);
});

patientsRouter.get('/', async (request, response) => {
  const patientsRepository = getRepository(Patient);
  const patients = await patientsRepository.find();

  return response.json(patients);
});

patientsRouter.post('/', async (request, response) => {
  const patient: IPatient = request.body;

  const patientsRepository = getRepository(Patient);

  const newPatient = patientsRepository.create(patient);
  await patientsRepository.save(newPatient);

  return response.json(newPatient.id);
});

patientsRouter.put('/:id', async (request, response) => {
  const { id } = request.params;

  await getRepository(Patient)
    .createQueryBuilder('patients')
    .update()
    .set(request.body)
    .where('id = :id', { id })
    .execute();

  return response.status(204).json();
});

export default patientsRouter;
