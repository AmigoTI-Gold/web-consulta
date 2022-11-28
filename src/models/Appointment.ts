/* eslint-disable camelcase */
import {
	PrimaryGeneratedColumn,
	Column,
	Entity,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';

enum Status {
	Pending = 'pendente',
	Progress = 'presete',
	Done = 'termiada',
	Cancel = 'cancelada',
}

@Entity('appointments')
class Appointment {
	@PrimaryGeneratedColumn('increment')
	id: number;

	@Column()
	specialist_id: number;

	@Column()
	patient_id: number;

	@Column()
	triage_id: number;

	@Column()
	clinicalProcess_id: number;

	@Column({
		enum: Status,
		default: Status.Pending,
	})
	status: string;

	@Column('timestamp with time zone')
	date: Date;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}

export default Appointment;
