import PDFDocument from 'pdfkit';
import { createWriteStream } from 'fs';
import { join } from 'path';

const { onAddPage } = require('./add-page');
import {
	generateExamsTable,
	generatePrescriptionTable,
	generateReason,
} from './body';

const createFile = (doc: PDFKit.PDFDocument, title: string) => {
	const filename = title.replace(' ', '-').concat('.pdf');
	doc.end();
	doc.pipe(createWriteStream(join(__dirname, '..', 'tmp', filename)));
};

function createBaseDocument(
	doc: PDFKit.PDFDocument,
	appointment: IAppointment,
	title: string,
) {
	onAddPage(doc, appointment, title);
}

export const makePrescriptionList = async (
	title: string,
	appointment: IAppointment,
) => {
	const doc = new PDFDocument({ autoFirstPage: false, size: 'A4' });

	createBaseDocument(doc, appointment, title);
	generatePrescriptionTable(doc, appointment, title);
	createFile(doc, title);
};

export const makeExamsList = async (
	title: string,
	appointment: IAppointment,
) => {
	const doc = new PDFDocument({ autoFirstPage: false, size: 'A4' });

	createBaseDocument(doc, appointment, title);
	generateExamsTable(doc, appointment, title);
	createFile(doc, title);
};

export const makeReason = async (title: string, appointment: IAppointment) => {
	const doc = new PDFDocument({ autoFirstPage: false, size: 'A4' });
	createBaseDocument(doc, appointment, title);
	generateReason(doc, appointment, title);
	createFile(doc, title);
};
