import {
	MigrationInterface,
	QueryRunner,
	Table,
	TableForeignKey,
} from 'typeorm';

export default class CreateAppointmentsExams1595760963745
	implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'appointment-exams',
				columns: [
					{
						name: 'id',
						type: 'int',
						isPrimary: true,
						isGenerated: true,
					},
					{ name: 'appointment_id', type: 'int' },
					{ name: 'exam_id', type: 'int' },
					{ name: 'createdAt', type: 'timestamp', default: 'NOW()' },
					{ name: 'updatedAt', type: 'timestamp', default: 'NOW()' },
				],
			}),
		);

		await queryRunner.createForeignKey(
			'appointment-exams',
			new TableForeignKey({
				columnNames: ['appointment_id'],
				referencedColumnNames: ['id'],
				referencedTableName: 'appointments',
			}),
		);

		await queryRunner.createForeignKey(
			'appointment-exams',
			new TableForeignKey({
				columnNames: ['exam_id'],
				referencedColumnNames: ['id'],
				referencedTableName: 'exams',
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		queryRunner.dropTable('appointment-exams');
	}
}
