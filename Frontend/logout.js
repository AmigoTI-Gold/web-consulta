import { $ } from './utils.js';
import { baseURL } from './Service.js';

$('.btn--logout').onclick = async function () {
	await fetch(`${baseURL}/sessions/logout`, { method: 'POST' });
	window.location.replace(`${baseURL}/index.html`);
	console.log('saio')
};
