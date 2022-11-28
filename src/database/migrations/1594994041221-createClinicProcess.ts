import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class createClinicProcess1594994041221
	implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'ClinicalProcess',
				columns: [
					{
						name: 'id',
						type: 'int',
						isPrimary: true,
						isGenerated: true,
					},
					{ name: 'diagnosis', type: 'varchar', isNullable: true },
					{ name: 'reason', type: 'varchar', isNullable: true },
					{ name: 'justification', type: 'varchar', isNullable: true },
					{ name: 'generalObjective', type: 'varchar', isNullable: true },
					{ name: 'plan', type: 'varchar', isNullable: true },
					{ name: 'medication', type: 'varchar', isNullable: true },
					{ name: 'createdAt', type: 'timestamp', default: 'NOW()' },
					{ name: 'updatedAt', type: 'timestamp', default: 'NOW()' },
				],
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('ClinicalProcess');
	}
}
