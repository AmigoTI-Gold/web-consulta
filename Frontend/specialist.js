import { $, getFormFields, notification, refreshPage } from './utils.js';
import { CreateResource, fetchData } from './Service.js';

import './logout.js';

const formSpecialistIds = `#name,#nationality,#address,#phone,#email,#orderNumber, #maritalStatus,#clinicalSpecialty, #username, #password`;
let specialistEdit = false;
let specialistId;

$('#sendSpecialist').onclick = event => {
	event.preventDefault();

	if (!$('#name').value) {
		notification({ title: 'Nome do Especialista em falta', icon: 'warning' });
		return;
	}

	if (!$('input[name=gender]:checked')) {
		notification({
			title: 'Seleccione o genero do Especialista',
			icon: 'warning',
		});
		return;
	}

	if (!$('#orderNumber').value) {
		notification({ title: 'O numéro de ordem em falta', icon: 'warning' });
		return;
	}

	if (!specialistEdit) {
		if (!$('#username').value) {
			notification({ title: 'O nome de Usuário em falta', icon: 'warning' });
			return;
		}

		if (!$('#password').value) {
			notification({ title: 'O senha em falta', icon: 'warning' });
			return;
		}
	}

	if (!$('#clinicalSpecialty').value) {
		notification({ title: 'Especialidade em falta', icon: 'warning' });
		return;
	}

	const specialistForm = {
		...getFormFields(formSpecialistIds),
		genre: $('input[name=gender]:checked').value,
	};

	if (specialistEdit) {
		CreateResource({
			resource: `specialists/${specialistId}`,
			body: {
				...getFormFields(formSpecialistIds.replace(', #username, #password', '')),
				genre: $('input[name=gender]:checked').value,
			},
			update: true,
		});
		refreshPage()
		return;
	}

	CreateResource({
		resource: 'specialists',
		body: specialistForm,
	});
	refreshPage()
};

const specialistTamplete = ({ id, name, clinicalSpecialty }) => `
<tr>
  <td class="specialistName">${name}</td>
  <td>${clinicalSpecialty}</td>
	<td> <button class="edit__btn btn" data-id="${id}">Editar</button> </td>
</tr>`;

async function loadSpecialists() {
	const specialists = await fetchData({ resource: 'specialists' });

	for (let specialist of specialists) {
		$('.specialists-list').insertAdjacentHTML(
			'beforeend',
			specialistTamplete({
				...specialist,
			}),
		);
	}

	attachEventEdit();
}

loadSpecialists();

function notEditable(el) {
	el.disabled = true;
	el.style.cursor = 'not-allowed';
	el.value = '';
}

function attachEventEdit() {
	document.querySelectorAll('.edit__btn').forEach(btn => {
		btn.onclick = async event => {
			const { id } = event.target.dataset;
			specialistId = id;
			const specialist = await fetchData({ resource: `specialists/${id}` });

			document.querySelectorAll(formSpecialistIds).forEach(field => {
				field.value = specialist[field.getAttribute('id')];

				specialistEdit = true;
			});

			notEditable($('#username'));
			notEditable($('#password'));

			$('#NewSpecialist').style.display = 'block'
			$('#ListSpecialists').style.display = 'none'
		};
	});
}

$('#clear-fields').onclick = () =>
	document
		.querySelectorAll(formSpecialistIds)
		.forEach(field => (field.value = ''));

$('#searchSpecialist').onkeyup = e => {
	let seachText = e.target.value.toLowerCase();

	document.querySelectorAll('tbody tr td.specialistName').forEach(item => {
		let itemExam = item.textContent.toLowerCase();
		const parent = item.parentNode;
		parent.style.display = !itemExam.includes(seachText) ? 'none' : '';
	});
};
