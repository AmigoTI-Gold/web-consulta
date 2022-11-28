import {
	PrimaryGeneratedColumn,
	Column,
	Entity,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity('specialists')
class Specialist {
	@PrimaryGeneratedColumn('increment')
	id: number;

	@Column()
	name: string;

	@Column({
		enum: ['M', 'F'],
	})
	genre: string;

	@Column()
	brithDate: Date;

	@Column()
	nationality: string;

	@Column()
	address: string;

	@Column()
	phone: string;

	@Column()
	active: boolean;

	@Column()
	email: string;

	@Column()
	orderNumber: string;

	@Column()
	maritalStatus: string;

	@Column()
	clinicalSpecialty: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}

export default Specialist;
