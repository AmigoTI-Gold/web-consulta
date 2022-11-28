import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class createTableUser1594491125725
	implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'users',
				columns: [
					{
						name: 'id',
						type: 'int',
						isPrimary: true,
						isGenerated: true,
					},
					{
						name: 'username',
						type: 'varchar',
						isUnique: true,
					},
					{
						name: 'password',
						type: 'varchar',
						isNullable: true
					},
					{
						name: 'owner_id',
						type: 'int',
						isNullable: true,
					},
					{
						name: 'rules',
						type: 'varchar',
						isNullable: true,
					},
					{ name: 'createdAt', type: 'timestamp', default: 'NOW()' },
					{ name: 'updatedAt', type: 'timestamp', default: 'NOW()' },
				],
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('users');
	}
}
