import {
	PrimaryGeneratedColumn,
	Column,
	Entity,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity('appointment-exams')
class AppointmentExams {
	@PrimaryGeneratedColumn('increment')
	id: number;

	@Column()
	appointment_id: number;

	@Column()
	exam_id: number;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}

export default AppointmentExams;
