import { Router, Request, Response } from 'express';
import { createQueryBuilder, getRepository } from 'typeorm';
import Exam from '../models/Exam';
import AppointmentExams from '../models/Appointment-Exams';
import AppointmentRepository from '../repositories/AppointmentsRepository';

const examRouter = Router();

examRouter.get('/', async (request: Request, response: Response) => {
	const examRepository = getRepository(Exam);
	const exams = await examRepository.find();

	return response.json(exams);
});

examRouter.get(
	'/:appointmentId',
	async (request: Request, response: Response) => {
		const { appointmentId } = request.params;

		const examRepository = getRepository(Exam);
		const appointmentExamsRepository = getRepository(AppointmentExams);

		const appointmentExams = await appointmentExamsRepository.find({
			where: {
				appointment_id: appointmentId,
			},
		});

		if (!appointmentExams.length) {
			return response.status(204).json();
		}

		const examsIds = appointmentExams.map(item => item.exam_id);
		const exams = await examRepository.findByIds(examsIds);

		return response.json(exams);
	},
);

examRouter.delete(
	'/:appointmentId',
	async (request: Request, response: Response) => {
		const { appointmentId } = request.params;
		const { examToDelete } = request.body;
		const appointmentExamsRepository = getRepository(AppointmentExams);

		await appointmentExamsRepository.delete({
			exam_id: examToDelete,
			appointment_id: appointmentId,
		});

		return response.status(204).json();
	},
);

export default examRouter;
