import {
	PrimaryGeneratedColumn,
	Column,
	Entity,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity('ClinicalProcess')
class ClinicalProcess {
	@PrimaryGeneratedColumn('increment')
	id: number;

	@Column()
	diagnosis: string;

	@Column()
	reason: string;

	@Column()
	justification: string;

	@Column()
	generalObjective: string;

	@Column()
	plan: string;

	@Column()
	medication: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}

export default ClinicalProcess;
