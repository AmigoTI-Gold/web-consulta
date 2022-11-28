import {
	PrimaryGeneratedColumn,
	Column,
	Entity,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity('users')
class User {
	@PrimaryGeneratedColumn('increment')
	id: number;

	@Column()
	username: string;

	@Column()
	password: string;

	@Column()
	owner_id: number;

	@Column()
	rules: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}

export default User;
