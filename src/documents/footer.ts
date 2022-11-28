import { format } from 'date-fns';
import { join } from 'path';

export const generateFooter = (
	doc: PDFKit.PDFDocument,
	appointment: IAppointment,
) => {
	const { orderNumber, name } = appointment.specialist;

	doc
		.lineCap('round')
		.moveTo(580, 660)
		.lineTo(30, 660)
		.fill('#87ceeb')
		.stroke();

	doc
		.lineCap('round')
		.moveTo(160, 740)
		.lineTo(415, 740)
		.fill('#87ceeb')
		.stroke();

	doc
		.fill('#000')
		.text('Médico(a)', 50, 700, { align: 'center' })
		.fontSize(10)
		.text(`${name} (${orderNumber})`, 50, 750, { align: 'center' })
		.fontSize(10)
		.text(`Data: ${format(appointment.date, 'dd/MM/yyyy')}`, 30, 670);;
		
		doc.image(join(__dirname, 'images', 'footer.png'), 185, 780, {
			height: 37,
			width: 209,
		});
};
