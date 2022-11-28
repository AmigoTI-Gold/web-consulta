import {
	MigrationInterface,
	QueryRunner,
	TableForeignKey,
	TableColumn,
} from 'typeorm';

export class createForeignKyesTriagePCEX1596373866864
	implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.addColumn(
			'appointments',
			new TableColumn({
				name: 'triage_id',
				type: 'int',
				isNullable: true,
			}),
		);

		await queryRunner.addColumn(
			'appointments',
			new TableColumn({
				name: 'clinicalProcess_id',
				type: 'int',
				isNullable: true,
			}),
		);

		await queryRunner.createForeignKey(
			'appointments',
			new TableForeignKey({
				columnNames: ['clinicalProcess_id'],
				referencedColumnNames: ['id'],
				referencedTableName: 'ClinicalProcess',
				onDelete: 'SET NULL',
				onUpdate: 'CASCADE',
			}),
		);

		await queryRunner.createForeignKey(
			'appointments',
			new TableForeignKey({
				columnNames: ['triage_id'],
				referencedColumnNames: ['id'],
				referencedTableName: 'triages',
				onDelete: 'SET NULL',
				onUpdate: 'CASCADE',
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropForeignKey('appointments', 'clinicalProcess_id');
		await queryRunner.dropForeignKey('appointments', 'triage_id');
	}
}
