import { generateWaterMark } from './water-mark';
import { generateHeader } from './header';
import { generateFooter } from './footer';

// eslint-disable-next-line import/prefer-default-export
export const onAddPage = (
	doc: PDFKit.PDFDocument,
	appointment: IAppointment,
	title: string,
) => {
	doc.addPage();
	generateWaterMark(doc);
	generateHeader(doc, appointment, title);
	generateFooter(doc, appointment);
};
