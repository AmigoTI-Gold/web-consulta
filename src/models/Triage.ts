import {
	PrimaryGeneratedColumn,
	Column,
	Entity,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity('triages')
class Triage {
	@PrimaryGeneratedColumn('increment')
	id: number;

	@Column()
	height: number;

	@Column()
	weight: number;

	@Column()
	imc: number;

	@Column()
	TA: number;

	@Column()
	Temperature: number;

	@Column()
	fc: number;

	@Column()
	fr: number;

	@Column()
	perimetro: number;

	@Column()
	sp02: number;

	@Column()
	duration: string;

	@Column()
	painType: string;

	@Column()
	consultationReason: string;

	@Column()
	descriptionSymptoms: string;

	@Column()
	followSymptoms: string;

	@Column()
	reliefFactors: string;

	@Column()
	painLocation: string;

	@Column()
	aggrationFactors: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}

export default Triage;
