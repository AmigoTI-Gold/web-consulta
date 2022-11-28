import { Router } from 'express';
import { getRepository, getManager, Not } from 'typeorm';

import Appointment from '../models/Appointment';
import ISpecialist from '../interfaces/ISpecialist';
import EnsureAuthenticated from '../middlewares/ensureAutenticated';
import CreateSpecialistService from '../services/CreateSpecialistService';
import Specialist from '../models/Specialist';

const specialistRouter = Router();

specialistRouter.get(
  '/:specialist_id?/appointments/',
  EnsureAuthenticated,
  async (request, response) => {
    const specialist_id = request.params.specialist_id || request.user.id;

    const appointmentRepository = getRepository(Appointment);
    const especialistAppointments = await appointmentRepository.find({
      where: { specialist_id, status: Not('Cancelada') },

      order: { date: 'DESC' },
    });

    return response.json(especialistAppointments);
  },
);

specialistRouter.get('/specialities', async (request, response) => {
  const specialities = await getManager()
    .createQueryBuilder(Specialist, 'specialists')
    .select(['DISTINCT specialists.clinicalSpecialty'])
    .getRawMany();

  response.json(specialities);
});

specialistRouter.get('/:id?', async (request, response) => {
  const { speciality } = request.query;
  const { id } = request.params;

  const SpecialistRepository = getRepository(Specialist);

  let filtredSpecialists;
  if (speciality) {
    console.log(speciality);
    filtredSpecialists = await SpecialistRepository.find({
      where: { clinicalSpecialty: speciality },
    });
  } else if (id) {
    filtredSpecialists = await SpecialistRepository.findOne({
      where: { id },
    });
  } else {
    filtredSpecialists = await SpecialistRepository.find();
  }

  return response.json(filtredSpecialists);
});

specialistRouter.post('/', async (request, response) => {
  const newSpecialist: ISpecialist = request.body;
  const createSpecialistService = new CreateSpecialistService();
  const specialist = await createSpecialistService.execute(newSpecialist);

  return response.json(specialist);
});

specialistRouter.put('/:id', async (request, response) => {
  const { id } = request.params;

  await getRepository(Specialist)
    .createQueryBuilder('specialists')
    .update()
    .set(request.body)
    .where('id = :id', { id })
    .execute();

  return response.status(204).json();
});

export default specialistRouter;
