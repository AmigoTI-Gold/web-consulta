import {
	PrimaryGeneratedColumn,
	Column,
	Entity,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity('exams')
class Exam {
	@PrimaryGeneratedColumn('increment')
	id: number;

	@Column()
	designation: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}

export default Exam;
