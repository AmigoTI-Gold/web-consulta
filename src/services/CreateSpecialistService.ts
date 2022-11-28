import { hash } from 'bcryptjs';
import { getRepository } from 'typeorm';

import User from '../models/User';
import Specialist from '../models/Specialist';
import ISpecialist from '../interfaces/ISpecialist';
import AppError from '../errors/AppError';

class CreateSpecialistService {
	public async execute(specialist: ISpecialist): Promise<ISpecialist> {
		const specialistsRespository = getRepository(Specialist);
		const usersRespository = getRepository(User);

		const checkSameUsername = await usersRespository.findOne({
			where: { username: specialist.username },
		});

		const existsSameOrderNumber = await specialistsRespository.findOne({
			where: { orderNumber: specialist.orderNumber },
		});

		if (checkSameUsername) {
			throw new AppError('Este nome de usuario ja esta em uso');
		}

		if (existsSameOrderNumber) {
			throw new AppError('Ja há um especialista com este número de ordem!');
		}

		const hashedPassword = await hash(specialist.password, 8);

		const newSpecialist = specialistsRespository.create(specialist);

		const { id } = await specialistsRespository.save(newSpecialist);

		const user = usersRespository.create({
			username: specialist.username,
			password: hashedPassword,
			rules: specialist.rules,
			owner_id: id,
		});

		await usersRespository.save(user);

		return {
			...newSpecialist,
			...user,
		};
	}
}


export default CreateSpecialistService;
