import { getFormFields, $, notification } from './utils.js';
import { baseURL } from './Service.js';

const userCredentials = `#username, #password`;

$('#sendLogin').onclick = event => {
	const credentials = getFormFields(userCredentials);
	login(credentials);
};

document.querySelectorAll(userCredentials).forEach(field => {
	field.onkeyup = event => {
		if (event.keyCode === 13) $('#sendLogin').click();
	};
});

async function login(Credentials) {
	const response = await fetch(`${baseURL}/sessions`, {
		method: 'POST',
		body: JSON.stringify(Credentials),
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		},
	});

	const parsedResponse = await response.json();
	if (parsedResponse.id) {
		localStorage.setItem('specialist_logged', parsedResponse.id);
		window.location.replace(`${baseURL}/specialist-appointments.html`);
	}

	if (parsedResponse.status) {
		const { status, message } = parsedResponse;
		notification({ icon: status, title: message });
	}
}
