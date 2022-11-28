import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class createSpecialist1594217446050
	implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'specialists',
				columns: [
					{ name: 'id', type: 'int', isPrimary: true, isGenerated: true },
					{ name: 'name', type: 'varchar' },
					{ name: 'genre', type: 'varchar' },
					{ name: 'brithDate', type: 'Date', isNullable: true },
					{ name: 'nationality', type: 'varchar', isNullable: true},
					{ name: 'address', type: 'varchar', isNullable: true },
					{ name: 'phone', type: 'varchar', isNullable: true},
					{ name: 'email', type: 'varchar', isNullable: true },
					{ name: 'orderNumber', type: 'varchar' },
					{ name: 'maritalStatus', type: 'varchar', isNullable: true },
					{ name: 'clinicalSpecialty', type: 'varchar' },
					{ name: 'createdAt', type: 'timestamp', default: 'NOW()' },
					{ name: 'updatedAt', type: 'timestamp', default: 'NOW()' },
					{ name: 'active', type: 'boolean', default: true },
				],
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('specialists');
	}
}
