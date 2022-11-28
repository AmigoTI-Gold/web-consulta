import { $, notification, refreshPage } from './utils.js';
import { fetchData, CreateResource, baseURL } from './Service.js';

import './logout.js';

const selectSpeciality = $('#clinicalSpecialitySelect');
const selectSpecialist = $('#SpecialistSelect');
const marcation_date = $('#date');

function loadPatientId() {
	return localStorage.getItem('Patient_id');
}

const optionSpeciality = ({ name }) =>
	`<option value="${name}">${name}</option>`;
const optionSpecialist = ({ name, id }) =>
	`<option value="${id}">${name}</option>`;

async function loadSpeciality() {
	const specialities = await fetchData({
		resource: 'specialists/specialities',
	});

	for (let speciality of specialities) {
		selectSpeciality.insertAdjacentHTML(
			'beforeend',
			optionSpeciality({ name: speciality.clinicalSpecialty }),
		);
	}
}

loadSpeciality();

const handleSpecialityChange = async event => {
	const speciality = event.target.value;
	selectSpecialist.innerHTML = '';
	const specialists = await fetchData({
		resource: `specialists?speciality=${speciality}`,
	});

	for (let specialist of specialists) {
		selectSpecialist.insertAdjacentHTML(
			'beforeend',
			optionSpecialist({ ...specialist }),
		);
	}
};

selectSpeciality.onchange = handleSpecialityChange;
selectSpeciality.onfocus = handleSpecialityChange;

$('#sendAppointment').onclick = () => {
	const patient_id = loadPatientId();

	if (!selectSpecialist.value) {
		notification({
			title: 'Seccione a especialidade do especialista',
			icon: 'warning',
		});
		return;
	}

	if (!selectSpeciality.value) {
		notification({ title: 'Seleccione o especialista', icon: 'warning' });
		return;
	}

	if (!date.value) {
		notification({ title: 'Horario da marcação em falta', icon: 'warning' });
		return;
	}

	if (!patient_id) {
		notification({ title: 'Nenhum paciente seleccionado', icon: 'warning' });
		return;
	}

	const appointment = {
		patient_id,
		specialist_id: selectSpecialist.value,
		status: 'Pendente',
		date: marcation_date.value,
	};

	CreateResource({ resource: 'appointments', body: appointment });
	localStorage.setItem('Patient_id', '');
	refreshPage();
};

const patientTamplete = ({ id, name, brithDate, phone, genre }) => `
<tr>
  <td class="patientName">${name}</td>
  <td>${genre}</td>
  <td>${phone}</td>
  <td>${moment().diff(brithDate, 'years')}</td>
  <td>
    <button class="consultation__btn btn" data-id="${id}" data-name="${name}">Seleccionar</button>
  </td>
</tr>`;

function attachEventConsultaion() {
	document.querySelectorAll('.consultation__btn').forEach(btn => {
		btn.onclick = event => {
			const { id, name } = event.target.dataset;
			localStorage.setItem('Patient_id', id);
			notification({
				title: `Paciente ${name} Seleccionado(a)`,
				icon: 'success',
			});
		};
	});
}

setTimeout(() => {
	document.querySelectorAll('.cancel__appointment').forEach(btn => {
		btn.onclick = event => {
			const { appointmentid } = event.target.dataset;

			CreateResource({
				resource: `appointments/${appointmentid}`,
				body: {
					status: 'Cancelada',
				},
				update: true,
			});

			setTimeout(() => {
				window.location.reload();
			}, 1500);
		};
	});
}, 1000);

async function loadPatients() {
	const patients = await fetchData({ resource: 'patients' });

	for (let patient of patients) {
		$('.patiente-list').insertAdjacentHTML(
			'beforeend',
			patientTamplete({ ...patient }),
		);
	}

	attachEventConsultaion();
}

const formatDate = date => {
	return new Intl.DateTimeFormat('pt-PT', {
		year: 'numeric',
		month: 'numeric',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
	}).format(new Date(date));
};

const appointmentTamplete = ({
	id,
	specialist_name,
	speciality,
	marcation_date,
	status,
	patient_id,
	patient_name,
}) => `
<tr>
	<td>${specialist_name}</td>
	<td>${speciality}</td>

  <td>${patient_name}</td>
  <td>${formatDate(marcation_date)}</td>

	<td>${status}</td>
	<td>
		<button
		class="triage__btn btn"
		data-id="${patient_id}"
		data-createdAt="${marcation_date}"
		data-appointmentId="${id}">
		Começar Triagem
		</button>

		<button
		class="btn cancel__appointment"
		data-appointmentId="${id}">
			Cancelar
		</button>
	</td>
</tr>`;

async function loadAppointments() {
	const appointments = await fetchData({ resource: 'triages' });
	for (let appointment of appointments) {
		$('.appointment-list').insertAdjacentHTML(
			'beforeend',
			appointmentTamplete({ ...appointment }),
		);
	}

	openTriage();
}

function openTriage() {
	document.querySelectorAll('.triage__btn').forEach(btn => {
		btn.onclick = async event => {
			const { id, appointmentid, createdat } = event.target.dataset;

			localStorage.setItem('current_patient', id);
			localStorage.setItem(
				'current_appointment',
				JSON.stringify({ appointmentid, createdat }),
			);
			setTimeout(() => {
				window.location.replace(`${baseURL}/appointment-form.html`);
			}, 500);
		};
	});
}

loadPatients();
loadAppointments();

$('#searchPatient').onkeyup = e => {
	let seachText = e.target.value.toLowerCase();

	document.querySelectorAll('tbody tr td.patientName').forEach(item => {
		let itemExam = item.textContent.toLowerCase();
		const parent = item.parentNode;
		parent.style.display = !itemExam.includes(seachText) ? 'none' : '';
	});
};