import { getFormFields, $, notification, refreshPage } from './utils.js';
import {
  CreateResource,
  fetchData,
  baseURL,
  deleteResource,
} from './Service.js';
import './logout.js';

const triageFieldIds = `#height, #weight, #imc, #TA, #Temperature, #fc, #fr, #perimetro, #sp02,#duration, #painType, #consultationReason, #descriptionSymptoms, #followSymptoms, #reliefFactors, #painLocation, #aggrationFactors`;
const clinicalProcessFieldIds = `#diagnosis, #reason, #justification, #generalObjective, #plan, #medication`;
const requestedExams = $('.tests-requested > .test-items');
const avalibleExams = $('.tests-avalible > .test-items');
const inputSearch = $('.search__input');

let examList = [];

let appointment_id;
let current_patient;

let clinicalProcessId;
let triageId;

let triageEditMode = false;
let clinicalProcessEditMode = false;

const btnBox = document.querySelector('.btn-box');

const attachDocumentLinsks = () => {
  const MakePrintBtn = (textContent, resource) => {
    return `
		<a 
		href="${baseURL}/documents/${resource}/${appointment_id}" 
		target="_blank"
		class="link" 
		>
		${textContent}
		</a>`;
  };

  const btnPrescription = MakePrintBtn('Imprimir Pescrição', 'prescriptions');
  const btnReason = MakePrintBtn('Imprimir Motivo', 'reasons');
  const btnListExams = MakePrintBtn('Imprimir Lista de Exames', 'exams-lists');

  const documentButtons = [btnPrescription, btnReason, btnListExams];

  for (let btn of documentButtons) {
    btnBox.insertAdjacentHTML('afterbegin', btn);
  }
};

function loadAppointmentId() {
  if (!appointment_id) {
    const appointment = JSON.parse(localStorage.getItem('current_appointment'));
    appointment_id = appointment.appointmentid;
    attachDocumentLinsks();
  }
}

const calculateIMC = (weight, height) => weight / Math.pow(height, 2);

const weight = $('#weight');
const height = $('#height');
const IMC = $('#imc');

$('#weight').onkeyup = event => {
  if (!weight.value && !height.value) return;

  const imc = calculateIMC(weight.value, height.value).toFixed(2);
  IMC.value = imc;
};

const sendTriage = async event => {
  event.preventDefault();
  const triageForm = getFormFields(triageFieldIds);

  if (triageEditMode) {
    CreateResource({
      resource: `triages/${triageId}`,
      update: true,
      body: triageForm,
    });

    return;
  }

  const { triage_id } = await CreateResource({
    resource: 'triages',
    body: triageForm,
  });

  loadAppointmentId();

  CreateResource({
    resource: `appointments/${appointment_id}`,
    update: true,
    body: { triage_id },
  });
};

const sendClinicalProcess = async event => {
  const clinicalProcessForm = getFormFields(clinicalProcessFieldIds);

  if (clinicalProcessEditMode) {
    CreateResource({
      resource: `clinicalProcess/${clinicalProcessId}`,
      update: true,
      body: clinicalProcessForm,
    });
    refreshPage();
    return;
  }

  const { clinicalProcess_id } = await CreateResource({
    resource: 'clinicalProcess',
    body: clinicalProcessForm,
  });

  loadAppointmentId();

  CreateResource({
    resource: `appointments/${appointment_id}`,
    update: true,
    body: { clinicalProcess_id },
  });
  refreshPage();
};

const sendExams = async event => {
  loadAppointmentId();

  await CreateResource({
    resource: `appointments/${appointment_id}/exams`,
    body: { exams: examList },
  });

  refreshPage();
};

$('#sendTriage').onclick = sendTriage;
$('#sendClinicalProcess').onclick = sendClinicalProcess;
$('#sendExams').onclick = sendExams;

const avalibleExam = ({ id, designation }) => `
<li class="test-item" data-id="${id}" data-designation="${designation}">
  <div class="test__id">
    <img src="assets/hash.svg" class="consultation__icon"/>
    <span>${id}</span>
  </div>
  <div class="test__name">
    <img src="assets/recepient.svg" class="consultation__icon"/>
    <span>${designation}</span>
  </div>
  <button class="test__btn add__test">
	<img src="assets/arrowRight.svg" />

</button>
</li>`;

const addedExam = ({ id, designation }) => `
<li class="test-item" data-examid="${id}" data-designation="${designation}">
  <div class="test__id">
    <img src="assets/hash.svg" class="consultation__icon"/>
    <span>${id}</span>
    </div>
    <div class="test__name">
      <img src="assets/recepient.svg" class="consultation__icon"/>
      <span>${designation}</span>
    </div>
  <button class="test__btn remove__test">
  <img src="assets/cancel.svg" />
</button>
</li>`;

function initExamEvents() {
  document.querySelectorAll('.add__test').forEach(btn => {
    btn.onclick = e => {
      const { id, designation } = event.target.parentNode.parentNode.dataset;

      if ((id || designation) !== undefined) {
        requestedExams.insertAdjacentHTML(
          'beforeend',
          addedExam({ id, designation }),
        );
        examList.push(id * 1);
      }

      document.querySelectorAll('.remove__test').forEach(btn => {
        btn.onclick = e => {
          const parent = e.currentTarget.parentNode;
          const { examid } = e.currentTarget.parentNode.dataset;
          requestedExams.removeChild(parent);
          examList = examList.filter(exam_id => exam_id != examid);
        };
      });
    };
  });
}

async function loadExams() {
  const exams = await fetchData({ resource: 'exams' });

  for (const exam of exams) {
    avalibleExams.insertAdjacentHTML('beforeend', avalibleExam({ ...exam }));
  }
  initExamEvents();
}

loadExams();

inputSearch.onkeyup = e => {
  const seachText = e.target.value.toLowerCase();
  document
    .querySelectorAll(
      '.tests-avalible > .test-items .test-item .test__name span',
    )
    .forEach(item => {
      const itemExam = item.textContent.toLowerCase();
      const parent = item.parentElement.parentElement;
      parent.style.display = !itemExam.includes(seachText) ? 'none' : '';
    });
};

function renderPatient({ name, brithDate, id, phone }) {
  $('.patient__id').textContent = `#${id}`;
  $('.patient__name').textContent = name;
  $('.patient__phone').textContent = phone;
  $('.patient__age').textContent = moment().diff(brithDate, 'years');
}

async function renderCurrentPatient() {
  const patientId = localStorage.getItem('current_patient');

  if (!patientId) {
    notification({
      title: 'Você precisa de criar uma consulta Antes',
      icon: 'error',
    });

    setTimeout(() => {
      window.location.replace(`${baseURL}/appointments.html`);
    }, 4000);
  }

  current_patient = await fetchData({ resource: `patients/${patientId}` });

  renderPatient({ ...current_patient });
}

renderCurrentPatient();

async function loadIfExists() {
  loadAppointmentId();
  const { triage_id, clinicalProcess_id } = await fetchData({
    resource: `appointments/${appointment_id}`,
  });

  if (triage_id) {
    triageId = triage_id;
    const triage = await fetchData({
      resource: `triages/${triage_id}`,
    });

    document.querySelectorAll(triageFieldIds).forEach(field => {
      field.value = triage[field.getAttribute('id')];
    });
    triageEditMode = true;
  }

  if (clinicalProcess_id) {
    clinicalProcessId = clinicalProcess_id;
    const clinicalProcess = await fetchData({
      resource: `clinicalProcess/${clinicalProcess_id}`,
    });

    document.querySelectorAll(clinicalProcessFieldIds).forEach(field => {
      field.value = clinicalProcess[field.getAttribute('id')];
    });

    clinicalProcessEditMode = true;
  }

  const exams = await fetchData({
    resource: `exams/${appointment_id}`,
  });

  if (!(exams == 204)) {
    for (let exam of exams) {
      requestedExams.insertAdjacentHTML('beforeend', addedExam({ ...exam }));
      examList.push(exam.id * 1);
    }

    document.querySelectorAll('.remove__test').forEach(btn => {
      btn.onclick = e => {
        const parent = e.currentTarget.parentNode;
        const { examid } = e.currentTarget.parentNode.dataset;
        requestedExams.removeChild(parent);
        examList = examList.filter(exam_id => exam_id != examid);

        deleteResource(`exams/${appointment_id}`, {
          examToDelete: examid,
        });
      };
    });
  }
}

loadIfExists();

$('#end-appointment').onclick = async event => {
  await Promise.all([sendClinicalProcess(event), sendExams(event)]);

  loadAppointmentId();

  CreateResource({
    resource: `appointments/${appointment_id}`,
    body: {
      status: 'Concluida',
    },
    update: true,
  });

  setTimeout(() => {
    window.location.replace(`${baseURL}/specialist-appointments.html`);
  }, 1500);
};
