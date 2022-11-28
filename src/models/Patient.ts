import {
	PrimaryGeneratedColumn,
	Column,
	Entity,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity('patients')
class Patient {
	@PrimaryGeneratedColumn('increment')
	id: number;

	@Column()
	name: string;

	@Column()
	genre: string;

	@Column()
	brithDate: Date;

	@Column({
		default: 'Angolana',
	})
	nationality: string;

	@Column()
	address: string;

	@Column()
	phone: string;

	@Column({
		unique: true,
	})
	email: string;

	@Column()
	fatherName: string;

	@Column()
	motherName: string;

	@Column()
	BI: string;

	@Column()
	passport: string;

	@Column()
	insuranceCompany: string;

	@Column()
	maritalStatus: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}

export default Patient;
