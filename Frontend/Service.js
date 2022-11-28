import { notification, showSpinner, hideSpinner } from './utils.js';

export const baseURL = 'http://192.168.100.20:3333';

export const ensureIsLogged = response => {
	if (response.status === 401) {
		notification({
			title: 'Por favor faça o login para continuar!',
			icon: 'error',
		});

		setInterval(() => {
			window.location.replace(`${baseURL}/index.html`);
		}, 3000);
	}
};

export const fetchData = async ({ resource }) => {
	const response = await fetch(`${baseURL}/${resource}`, { method: 'GET' });
	ensureIsLogged(response);
	if (response.status === 204) return 204
	return response.json();
};

export const CreateResource = async ({ resource, body, update = false }) => {
	const response = await fetch(`${baseURL}/${resource}`, {
		method: update ? 'PUT' : 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
		credentials: 'include',
	});

	ensureIsLogged(response);

	if (!response.ok) {
		hideSpinner();
		notification({ title: 'Não é possivel gravar os dados', icon: 'error' });
		return;
	}

	notification({ title: 'Dados Salvos com sucesso', icon: 'success' });
	if (response.status === 204) return 204

	return response.json();
};

export const deleteResource = async (resource, body,) => {
	const response = await fetch(`${baseURL}/${resource}`, {
		method: 'DELETE',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
		credentials: 'include',
	});

	ensureIsLogged(response);

	if (!response.ok) return;


	notification({ title: 'Eliminado com sucesso!', icon: 'success' });
	if (response.status === 204) return 204

	return response.json();
}
