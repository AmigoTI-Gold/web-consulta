import { onAddPage } from './add-page';

function generateTableRow(doc: PDFKit.PDFDocument, y: number, c1: string) {
	doc.fontSize(13).text(c1, 50, y, { width: 500 });
}

export const generateExamsTable = (
	doc: PDFKit.PDFDocument,
	appointment: IAppointment,
	title: string,
) => {
	const TableTop = 240;
	let index = 0;
	for (const exam of appointment.exams) {
		let position = TableTop + (index + 1) * 20;
		if (position > 630) {
			onAddPage(doc, appointment, title);

			index = 0;
			position = TableTop + (index + 1) * 20;
		}
		generateTableRow(doc, position, exam.name);
		index++;
	}
};

export const generatePrescriptionTable = (
	doc: PDFKit.PDFDocument,
	appointment: IAppointment,
	title: string,
) => {
	const TableTop = 240;
	let index = 0;
	for (const medicate of appointment.medication) {
		let position = TableTop + (index + 1) * 20;
		if (position > 620) {
			onAddPage(doc, appointment, title);

			index = 0;
			position = 240 + (index + 1) * 20;
		}
		generateTableRow(doc, position, medicate);
		index++;
	}
};

export const generateReason = (
	doc: PDFKit.PDFDocument,
	appointment: IAppointment,
	title: string,
) => {
	const TableTop = 240;
	doc.fontSize(11).text(appointment.reason || '', 50, TableTop + 20, {
		width: 500,
		lineGap: 4,
		wordSpacing: 1.6,
		align: 'justify',
	});
};
