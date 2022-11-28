import {
	MigrationInterface,
	QueryRunner,
	TableForeignKey,
	TableColumn,
} from 'typeorm';

export default class addingForeignKeysSpecialisAndPatient1594291333536
	implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.addColumn(
			'appointments',
			new TableColumn({
				name: 'specialist_id',
				type: 'int',
			}),
		);

		await queryRunner.addColumn(
			'appointments',
			new TableColumn({
				name: 'patient_id',
				type: 'int',
			}),
		);

		await queryRunner.createForeignKey(
			'appointments',
			new TableForeignKey({
				columnNames: ['specialist_id'],
				referencedColumnNames: ['id'],
				referencedTableName: 'specialists',
				onDelete: 'SET NULL',
				onUpdate: 'CASCADE',
			}),
		);

		await queryRunner.createForeignKey(
			'appointments',
			new TableForeignKey({
				columnNames: ['patient_id'],
				referencedColumnNames: ['id'],
				referencedTableName: 'patients',
				onDelete: 'SET NULL',
				onUpdate: 'CASCADE',
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropForeignKey('appointments', 'specialist_id');

		await queryRunner.dropForeignKey('appointments', 'patient_id');
	}
}
