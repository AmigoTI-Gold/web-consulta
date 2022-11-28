import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateExams1595760353297 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'exams',
				columns: [
					{
						name: 'id',
						type: 'int',
						isPrimary: true,
						isGenerated: true,
					},
					{ name: 'designation', type: 'varchar', isNullable: true },
					{ name: 'createdAt', type: 'timestamp', default: 'NOW()' },
					{ name: 'updatedAt', type: 'timestamp', default: 'NOW()' },
				],
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('exams');
	}
}
