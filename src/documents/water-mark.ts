import { join } from 'path';

export const generateWaterMark = (doc: PDFKit.PDFDocument) => {
	doc.image(join(__dirname, 'images', 'logo.png'), 150, 0, {
		height: 120,
		width: 220,
	});
};
