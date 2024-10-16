import { MigrationInterface, QueryRunner } from "typeorm";

export class YourMigrationName1729072205447 implements MigrationInterface {
    name = 'YourMigrationName1729072205447'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Elections\` ADD \`endDate\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`Elections\` ADD \`isActive\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`ElectionResults\` ADD CONSTRAINT \`FK_3fe2076a7432d2e85b06ba72ed3\` FOREIGN KEY (\`electionId\`) REFERENCES \`Elections\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`result_tags\` ADD CONSTRAINT \`FK_9cb8ca62f545000e4ef67d0ccc0\` FOREIGN KEY (\`result_id\`) REFERENCES \`ElectionResults\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`result_tags\` ADD CONSTRAINT \`FK_9cb8ca62f545000e4ef67d0ccc0\` FOREIGN KEY (\`result_id\`) REFERENCES \`Election_results\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`result_tags\` DROP FOREIGN KEY \`FK_9cb8ca62f545000e4ef67d0ccc0\``);
        await queryRunner.query(`ALTER TABLE \`result_tags\` DROP FOREIGN KEY \`FK_9cb8ca62f545000e4ef67d0ccc0\``);
        await queryRunner.query(`ALTER TABLE \`ElectionResults\` DROP FOREIGN KEY \`FK_3fe2076a7432d2e85b06ba72ed3\``);
        await queryRunner.query(`ALTER TABLE \`Elections\` DROP COLUMN \`isActive\``);
        await queryRunner.query(`ALTER TABLE \`Elections\` DROP COLUMN \`endDate\``);
    }

}
