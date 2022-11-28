import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class createPatient1594218174101 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'patients',
				columns: [
					{
						name: 'id',
						type: 'int',
						isPrimary: true,
						isGenerated: true,
					},
					{ name: 'name', type: 'varchar' },
					{ name: 'genre', type: 'varchar', enum: ['M', 'F'] },
					{ name: 'brithDate', type: 'Date' },
					{ name: 'nationality', type: 'varchar', isNullable: true },
					{ name: 'address', type: 'varchar', isNullable: true },
					{ name: 'phone', type: 'varchar' },
					{ name: 'email', type: 'varchar', isNullable: true },
					{ name: 'fatherName', type: 'varchar', isNullable: true },
					{ name: 'motherName', type: 'varchar', isNullable: true },
					{ name: 'BI', type: 'varchar', isNullable: true },
					{ name: 'passport', type: 'varchar', isNullable: true },
					{ name: 'insuranceCompany', type: 'varchar', isNullable: true },
					{ name: 'maritalStatus', type: 'varchar', isNullable: true },
					{ name: 'createdAt', type: 'timestamp', default: 'NOW()' },
					{ name: 'updatedAt', type: 'timestamp', default: 'NOW()' },
				],
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('patients');
	}
}
