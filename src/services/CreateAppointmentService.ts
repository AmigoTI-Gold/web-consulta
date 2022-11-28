import { isBefore } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import Appointment from '../models/Appointment';
import IAppointment from '../interfaces/IAppointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import AppError from '../errors/AppError';

class CreateAppointmentService {
	public async execute({
		specialist_id,
		patient_id,
		status,
		date,
	}: IAppointment): Promise<Appointment> {
		const appointmentsRepository = getCustomRepository(AppointmentsRepository);

		const findAppointmentInSameDate = await appointmentsRepository.findByDate({
			specialist_id,
			date,
		});

		if (findAppointmentInSameDate) {
			throw new AppError('O especialista ja esta ocupado neste horario');
		}

		if (isBefore(date, new Date())) {
			throw new AppError('Não é possivel fazer marcações em datas passadas!');
		}

		const appointment = appointmentsRepository.create({
			specialist_id,
			patient_id,
			status,
			date,
		});

		await appointmentsRepository.save(appointment);
		return appointment;
	}
}

export default CreateAppointmentService;
