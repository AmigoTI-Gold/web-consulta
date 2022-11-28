function generateTitle(doc: PDFKit.PDFDocument, title: string) {
	doc
		.lineCap('round')
		.moveTo(580, 205)
		.lineTo(30, 205)
		.fill('#87ceeb')
		.stroke()

		.lineCap('round')
		.moveTo(580, 240)
		.lineTo(30, 240)
		.fill()
		.stroke();

	doc.fill('#000000').fontSize(20).text(title, 50, 215, { align: 'center' });
}

export const generateHeader = (
	doc: PDFKit.PDFDocument,
	appointment: IAppointment,
	title: string,
) => {
	const patient = appointment.patient;

	doc
		.lineCap('round')
		.moveTo(580, 115)
		.lineTo(30, 115)
		.fill('#87ceeb')
		.stroke();

	doc
		.fill('#000000')
		.fontSize(16)
		.text(`${patient.name}`, 50, 125, { align: 'center' })

		.fontSize(10)
		.text(`PROCESSO: ${patient.id}`, 50, 160)
		.text(`IDADE: ${patient.age}`, 50, 180)

		.text(`CONVÉNIO: ${patient.insuranceCompany}`, 230, 160)
		.text(`GENÊRO: ${patient.genre}`, 230, 180)

		.text(`NACIONALIDADE: ${patient.nationality}`, 0, 160, { align: 'right' });
	generateTitle(doc, title);
};
