import { EntityRepository, Repository } from 'typeorm';

import Appointment from '../models/Appointment';

interface Request {
	date: Date;
	specialist_id: number;
}

@EntityRepository(Appointment)
class AppointmentRepository extends Repository<Appointment> {
	public async findByDate({
		date,
		specialist_id,
	}: Request): Promise<Appointment | null> {
		const foundAppointment = await this.findOne({
			where: { date, specialist_id },
		});

		return foundAppointment || null;
	}
}

export default AppointmentRepository;
