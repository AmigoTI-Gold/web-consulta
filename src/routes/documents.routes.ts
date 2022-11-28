import { Router, Request, Response } from 'express';
import { differenceInYears } from 'date-fns';
import { createQueryBuilder } from 'typeorm';
import { join } from 'path';
import { readFile } from 'fs';
import { promisify } from 'util';

import { makeExamsList, makePrescriptionList, makeReason } from '../documents';

const readFilePro = promisify(readFile);

const documentsRouter = Router();

interface PatientAndDoctor {
	id: number;
	nationality: string;
	brithDate: Date;
	genre: string;
	insuranceCompany: string;
	date: Date;
	patient_name: string;
	orderNumber: string;
	doctor: string;
	maritalStatus: string;
}

function getPatientAndDoctor({
	id,
	nationality,
	brithDate,
	genre,
	insuranceCompany,
	date,
	patient_name,
	orderNumber,
	doctor,
	maritalStatus,
}: PatientAndDoctor) {
	return {
		specialist: {
			name: doctor,
			orderNumber,
		},
		patient: {
			id,
			genre,
			nationality,
			maritalStatus,
			insuranceCompany,
			name: patient_name,
			age: differenceInYears(new Date(), brithDate),
		},
		date,
	};
}

const basequery = (appointment_id: string, extraField: string = '') => `
select
	patients.id,
	patients.nationality,
	patients."brithDate",
	patients.genre,
	patients."insuranceCompany",
	patients.name as "patient_name",
	patients."maritalStatus",
	appointments.date,
	specialists."orderNumber",
	specialists.name as "doctor"
	${extraField}
from
	appointments
	join patients on appointments.patient_id = patients.id
	join specialists on appointments.specialist_id = specialists.id
	join "ClinicalProcess" on appointments."clinicalProcess_id" = "ClinicalProcess".id
where
	appointments.id = ${appointment_id}
`;

async function buildResponse(response: Response, filename: string) {
	setTimeout(async () => {
		response.setHeader('Content-Type', 'application/pdf');
		response.setHeader(
			'Content-Disposition',
			`attachment; filename=${filename}.pdf`,
		);
		const filePath = join(__dirname, '..', 'tmp', `${filename}.pdf`);
		const fileContent = await readFilePro(filePath);
		response.send(fileContent);
	}, 2000);
}

documentsRouter.get(
	'/prescriptions/:appointment_id',
	async (request: Request, response: Response) => {
		const [result] = await createQueryBuilder().connection.query(
			basequery(
				request.params.appointment_id,
				' ,"ClinicalProcess".medication',
			),
		);

		if (!result || !result.medication) {
			return response.status(400).json({
				message:
					'Não é possivel realizar a impressão, porque não há dados preenchidos no campo medicação do processo clínico',
			});
		}

		const appointment = {
			...getPatientAndDoctor(result),
			medication: result.medication.trim().split('\n'),
		};

		makePrescriptionList('Prescrição Medica', appointment);
		buildResponse(response, 'Prescrição-Medica');
	},
);

documentsRouter.get(
	'/reasons/:appointment_id',
	async (request: Request, response: Response) => {
		const [result] = await createQueryBuilder().connection.query(
			basequery(request.params.appointment_id, ', "ClinicalProcess".reason'),
		);

		if (!result || !result.reason) {
			return response.status(400).json({
				message:
					'Não é possivel realizar a impressão, porque não há dados preenchidos no campo motivo do processo clínico',
			});
		}

		const appointment = {
			...getPatientAndDoctor(result),
			reason: result.reason,
		};

		makeReason('Motivo', appointment);
		buildResponse(response, 'Motivo');
	},
);

documentsRouter.get(
	'/exams-lists/:appointment_id',
	async (request: Request, response: Response) => {
		const result = createQueryBuilder().connection.query(
			basequery(request.params.appointment_id),
		);

		const exams_list = createQueryBuilder().connection.query(`
    select
    string_agg(DISTINCT exams.designation, '!') as exam_list
    from
    appointments join "appointment-exams" on
    "appointment-exams".appointment_id = appointments.id
    join exams on
    exams.id = "appointment-exams".exam_id
    where appointments.id = ${request.params.appointment_id}
`);

		const [[list], [personalDatas]] = await Promise.all([exams_list, result]);

		if (!list.exam_list) {
			return response.status(400).json({
				message:
					'Não é possivel realizar a impressão, porque não foi adicionado nenhum exame. por favor adicione e grave.',
			});
		}

		const appointment = {
			...getPatientAndDoctor(personalDatas),
			exams: list.exam_list.split('!').map((exam: string) => ({ name: exam })),
		};

		makeExamsList('Lista-de-Exames', appointment);
		buildResponse(response, 'Lista-de-Exames');
	},
);

export default documentsRouter;
