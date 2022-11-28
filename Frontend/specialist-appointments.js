import { fetchData, baseURL, CreateResource } from './Service.js';
import { $ } from './utils.js';

import './logout.js';

let patients = [];
let myPatients = [];

const consultationTamplete = ({
	id,
	name,
	age,
	status,
	date,
	appointment_id,
	appointment_createdAt,
}) => `
<tr>
	<td>${name}</td>
	<td>${moment().diff(age, 'years')}</td>
  <td>${status}</td>
	<td>${moment(date).format('D MMMM YYYY HH:mm')}</td>
	<td>
    <button class="consultation__btn btn" data-id="${id}" data-createdAt="${appointment_createdAt}" data-appointmentId="${appointment_id}">Consultar</button>
  </td>
</tr>`;

async function getPatients() {
	const Patients = await fetchData({ resource: 'patients' });
	return Patients;
}

async function findPatientById(id) {
	if (patients) {
		patients = await getPatients();
	}

	let findedPatient = patients.find(patient => patient.id == id);
	return findedPatient;
}

function getPendentAppointmentsAsDefault() {
	document.querySelectorAll('.consultations-list tr td:nth-child(3)').forEach(td => {
		if (td.textContent != 'Pendente') td.parentElement.style = 'display: none'
		else td.parentElement.style = ''
		$('#filterAppointment').value = 'Pendente'
	})
}

async function loadAppointments() {
	const appointments = await fetchData({
		resource: 'specialists/appointments',
	});

	for (let appointment of appointments) {
		let patient = await findPatientById(appointment.patient_id);

		myPatients.push({
			id: appointment.patient_id,
			name: patient.name,
			age: patient.brithDate,
			status: appointment.status,
			date: appointment.date,
			appointment_id: appointment.id,
			appointment_createdAt: appointment.createdAt,
		});
	}

	for (let patient of myPatients) {
		$('.consultations-list').insertAdjacentHTML(
			'beforeend',
			consultationTamplete({ ...patient }),
		);
	}

	attachEventConsultaion();
	getPendentAppointmentsAsDefault()
}

loadAppointments();

document.querySelector('#filterAppointment').onchange = event => {
	let status = event.target.value;

	document.querySelectorAll('.consultations-list tr td:nth-child(3)').forEach(td => {
		if (td.textContent === status) td.parentElement.style = ''
		else if (status === '') td.parentElement.style = ''
		else td.parentElement.style = 'display: none'
	})
};

function attachEventConsultaion() {
	document.querySelectorAll('.consultation__btn').forEach(btn => {
		btn.onclick = async event => {
			const { id, appointmentid, createdat } = event.target.dataset;

			localStorage.setItem('current_patient', id);

			await CreateResource({
				resource: `appointments/${appointmentid}`,
				body: {
					status: 'Em progresso',
				},
				update: true,
			});

			setTimeout(() => {
				localStorage.setItem(
					'current_appointment',
					JSON.stringify({ appointmentid, createdat }),
				);

				window.location.replace(`${baseURL}/appointment-form.html`);
			}, 1500);
		};
	});
}
