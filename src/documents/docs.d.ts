interface IAppointment {
	patient: {
		age: number;
		nationality: string;
		insuranceCompany: string;
		genre: string;
		name: string;
		id: number;
	};
	date: Date;
	medication?: Array;
	reason?: string;
	exams?: Array;
	specialist: {
		orderNumber: string;
		name: string;
	};
}
