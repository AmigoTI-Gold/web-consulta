import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateAppointments1594116742236
	implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'appointments',
				columns: [
					{
						name: 'id',
						type: 'int',
						isPrimary: true,
						isGenerated: true,
					},
					{
						name: 'date',
						type: 'timestamp with time zone',
					},
					{
						name: 'status',
						type: 'varchar',
					},
					{
						name: 'createdAt',
						type: 'timestamp',
						default: 'NOW()',
					},
					{
						name: 'updatedAt',
						type: 'timestamp',
						default: 'NOW()',
					},
				],
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('appointments');
	}
}
