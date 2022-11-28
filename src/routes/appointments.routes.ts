import { Router, Request, Response } from 'express';
import { getRepository, createQueryBuilder } from 'typeorm';
import { parseISO } from 'date-fns';

import CreateAppointmentService from '../services/CreateAppointmentService';
import ensureAuthenticated from '../middlewares/ensureAutenticated';

import AppointmentExams from '../models/Appointment-Exams';
import Appointment from '../models/Appointment';
import AppError from '../errors/AppError';

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.post('/', async (request: Request, response: Response) => {
  const { date, patient_id, specialist_id, status } = request.body;

  const parsedDate = parseISO(date);

  const createAppointmentService = new CreateAppointmentService();
  const appointment = await createAppointmentService.execute({
    date: parsedDate,
    patient_id,
    specialist_id,
    status,
  });

  return response.json(appointment);
});

appointmentsRouter.get(
  '/:id?',
  async (request: Request, response: Response) => {
    const { id } = request.params;

    const appointmentsRepository = getRepository(Appointment);
    let appointment;

    if (id) {
      appointment = await appointmentsRepository.findOne({
        where: { id },
      });
    } else {
      appointment = await appointmentsRepository.find({
        where: { status: 'Pendente' },
      });
    }

    if (!appointment) {
      throw new AppError(
        'Não existe nenhuma marcação com esta referencia.',
        404,
      );
    }

    return response.json(appointment);
  },
);

appointmentsRouter.put('/:id', async (request: Request, response: Response) => {
  const { id } = request.params;

  await getRepository(Appointment)
    .createQueryBuilder('appointments')
    .update()
    .set(request.body)
    .where('id = :id', { id })
    .execute();

  return response.status(204).json();
});

appointmentsRouter.post(
  '/:appointment_id/exams',
  async (request: Request, response: Response) => {
    const { appointment_id } = request.params;
    const { exams } = request.body;

    const AppointmentExamsRepository = getRepository(AppointmentExams);

    for (const exam_id of exams) {
      const newExam = AppointmentExamsRepository.create({
        exam_id,
        appointment_id,
      });

      await AppointmentExamsRepository.save(newExam);
    }

    return response.status(204).json();
  },
);

appointmentsRouter.get(
  '/:appointment_id/documents',
  async (request: Request, response: Response) => {
    const { appointment_id } = request.params;

    const result = await createQueryBuilder().connection.query(`
		select
		patients.id,
		patients.nationality,
		patients."brithDate",
		patients.genre,
		patients."insuranceCompany",
		patients.name as "patient_name",
		specialists.name as "specialist_name",
		patients."maritalStatus",
		patients.phone,
		specialists."orderNumber",
		specialists.name,
		appointments.date
		from appointments join patients on
		appointments.patient_id = patients.id join
		specialists on
		appointments.specialist_id = specialists.id
		where appointments.id = ${appointment_id}
`);

    return response.status(200).json(result);
  },
);

export default appointmentsRouter;
