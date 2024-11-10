import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNewColumnToUsers1729406831698 implements MigrationInterface {
    name = 'AddNewColumnToUsers1729406831698'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Elections\` ADD \`startDate\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`ElectionResults\` ADD CONSTRAINT \`FK_b7dd3741f0146655d7316bbb7f7\` FOREIGN KEY (\`locationId\`) REFERENCES \`locations\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`result_tags\` ADD CONSTRAINT \`FK_9cb8ca62f545000e4ef67d0ccc0\` FOREIGN KEY (\`result_id\`) REFERENCES \`ElectionResults\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`result_tags\` ADD CONSTRAINT \`FK_9cb8ca62f545000e4ef67d0ccc0\` FOREIGN KEY (\`result_id\`) REFERENCES \`Election_results\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`result_tags\` DROP FOREIGN KEY \`FK_9cb8ca62f545000e4ef67d0ccc0\``);
        await queryRunner.query(`ALTER TABLE \`result_tags\` DROP FOREIGN KEY \`FK_9cb8ca62f545000e4ef67d0ccc0\``);
        await queryRunner.query(`ALTER TABLE \`ElectionResults\` DROP FOREIGN KEY \`FK_b7dd3741f0146655d7316bbb7f7\``);
        await queryRunner.query(`ALTER TABLE \`Elections\` DROP COLUMN \`startDate\``);
    }

}
