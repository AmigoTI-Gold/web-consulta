import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class createTriage1594983930821 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'triages',
				columns: [
					{
						name: 'id',
						type: 'int',
						isPrimary: true,
						isGenerated: true,
					},
					{ name: 'height', type: 'decimal', isNullable: true },
					{ name: 'weight', type: 'decimal', isNullable: true },
					{ name: 'imc', type: 'decimal', isNullable: true },
					{ name: 'TA', type: 'decimal', isNullable: true },
					{ name: 'Temperature', type: 'decimal', isNullable: true },
					{ name: 'fc', type: 'decimal', isNullable: true },
					{ name: 'fr', type: 'decimal', isNullable: true },
					{ name: 'perimetro', type: 'decimal', isNullable: true },
					{ name: 'sp02', type: 'decimal', isNullable: true },
					{ name: 'duration', type: 'varchar', isNullable: true },
					{ name: 'painType', type: 'varchar', isNullable: true },
					{ name: 'consultationReason', type: 'varchar', isNullable: true },
					{ name: 'descriptionSymptoms', type: 'varchar', isNullable: true },
					{ name: 'followSymptoms', type: 'varchar', isNullable: true },
					{ name: 'reliefFactors', type: 'varchar', isNullable: true },
					{ name: 'painLocation', type: 'varchar', isNullable: true },
					{ name: 'aggrationFactors', type: 'varchar', isNullable: true },
					{ name: 'createdAt', type: 'timestamp', default: 'NOW()' },
					{ name: 'updatedAt', type: 'timestamp', default: 'NOW()' },
				],
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('triages');
	}
}
