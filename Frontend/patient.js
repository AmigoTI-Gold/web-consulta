import { getFormFields, $, notification, refreshPage } from './utils.js';
import { CreateResource, fetchData } from './Service.js';

import './logout.js';

const patientFieldIds = `#name, #nationality,#brithDate, #maritalStatus, #fatherName, #motherName, #email, #phone, #insuranceCompany, #BI, #address`;

let patientEdit = false;
let patientId;

$('#sendPatient').onclick = event => {
	event.preventDefault();

	if (!Date.parse($('#brithDate').value)) {
		notification({
			title: 'Data de Nacimento em falta',
			icon: 'warning',
		});
		return;
	}

	if (!$('#name').value) {
		notification({
			title: 'Nome do Paciente em falta',
			icon: 'warning',
		});
		return;
	}

	if (!$('#phone').value) {
		notification({
			title: 'Telefone do Paciente em falta',
			icon: 'warning',
		});
		return;
	}

	if (!$('input[name=gender]:checked')) {
		notification({
			title: 'Seleccione o genero do Paciente',
			icon: 'warning',
		});
		return;
	}

	const patientForm = {
		...getFormFields(patientFieldIds),
		genre: $('input[name=gender]:checked').value,
	};

	if (patientEdit) {
		CreateResource({
			resource: `patients/${patientId}`,
			body: patientForm,
			update: true,
		});
		refreshPage();
		return;
	}

	CreateResource({
		resource: 'patients',
		body: patientForm,
	});

	refreshPage();
};

const patientTamplete = ({ id, name, brithDate, phone, genre }) => `
<tr>
  <td class="specialistName">${name}</td>
  <td>${genre}</td>
  <td>${phone}</td>
  <td>${moment().diff(brithDate, 'years')}</td>
  <td>
    <button class="edit__btn btn" data-id="${id}">Editar</button>
  </td>
</tr>`;

async function loadPatients() {
	const patients = await fetchData({ resource: 'patients' });

	for (let patient of patients) {
		$('.patiente-list').insertAdjacentHTML(
			'beforeend',
			patientTamplete({ ...patient }),
		);
	}

	attachEventEdit();
}

loadPatients();

function attachEventEdit() {
	document.querySelectorAll('.edit__btn').forEach(btn => {
		btn.onclick = async event => {
			const { id } = event.target.dataset;
			patientId = id;
			const patient = await fetchData({ resource: `patients/${id}` });

			document.querySelectorAll(patientFieldIds).forEach(field => {
				field.value = patient[field.getAttribute('id')];

				if (field.getAttribute('id') == 'brithDate') {
					field.value = moment(patient[field.getAttribute('id')]).format(
						'YYYY-MM-DD',
					);
				}
				$('#NewPatient').style.display = 'block';
				$('#ListPatients').style.display = 'none';
				patientEdit = true;
			});
		};
	});
}

$('#clear-fields').onclick = () =>
	document
		.querySelectorAll(patientFieldIds)
		.forEach(field => (field.value = ''));

$('#searchPatient').onkeyup = e => {
	let seachText = e.target.value.toLowerCase();

	document.querySelectorAll('tbody tr td.specialistName').forEach(item => {
		let itemExam = item.textContent.toLowerCase();
		const parent = item.parentNode;
		parent.style.display = !itemExam.includes(seachText) ? 'none' : '';
	});
};
