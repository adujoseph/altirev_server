import { MigrationInterface, QueryRunner } from "typeorm";

export class MyInit1723992987162 implements MigrationInterface {
    name = 'MyInit1723992987162'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`role\` (\`id\` int NOT NULL, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`status\` (\`id\` int NOT NULL, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`altirevId\` varchar(36) NOT NULL, \`tenantId\` varchar(255) NULL, \`email\` varchar(255) NULL, \`password\` varchar(255) NULL, \`provider\` varchar(255) NOT NULL DEFAULT 'email', \`socialId\` varchar(255) NULL, \`firstName\` varchar(255) NULL, \`lastName\` varchar(255) NULL, \`username\` varchar(255) NULL, \`phoneNumber\` varchar(255) NULL, \`gender\` varchar(255) NULL, \`state\` varchar(255) NULL, \`country\` varchar(255) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`election\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`status\` enum ('previous', 'ongoing', 'upcoming') NOT NULL, \`electionDate\` date NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`createdById\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`election_results\` (\`id\` varchar(36) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`notification_entity\` (\`id\` varchar(36) NOT NULL, \`title\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`status\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`createdById\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`otp_tokens\` (\`altirevId\` varchar(36) NOT NULL, \`email\` varchar(255) NOT NULL, \`token\` varchar(255) NULL, UNIQUE INDEX \`IDX_09ed30046d97c2b8dc073bfdf2\` (\`email\`), PRIMARY KEY (\`altirevId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`session\` (\`id\` int NOT NULL AUTO_INCREMENT, \`hash\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`file\` (\`id\` varchar(36) NOT NULL, \`path\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`election\` ADD CONSTRAINT \`FK_f3ecb2bcb7315c4134b0cec1564\` FOREIGN KEY (\`createdById\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`notification_entity\` ADD CONSTRAINT \`FK_dec1e63dfdaf3010d727234328f\` FOREIGN KEY (\`createdById\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`session\` ADD CONSTRAINT \`FK_3d2f174ef04fb312fdebd0ddc53\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`session\` DROP FOREIGN KEY \`FK_3d2f174ef04fb312fdebd0ddc53\``);
        await queryRunner.query(`ALTER TABLE \`notification_entity\` DROP FOREIGN KEY \`FK_dec1e63dfdaf3010d727234328f\``);
        await queryRunner.query(`ALTER TABLE \`election\` DROP FOREIGN KEY \`FK_f3ecb2bcb7315c4134b0cec1564\``);
        await queryRunner.query(`DROP TABLE \`file\``);
        await queryRunner.query(`DROP TABLE \`session\``);
        await queryRunner.query(`DROP INDEX \`IDX_09ed30046d97c2b8dc073bfdf2\` ON \`otp_tokens\``);
        await queryRunner.query(`DROP TABLE \`otp_tokens\``);
        await queryRunner.query(`DROP TABLE \`notification_entity\``);
        await queryRunner.query(`DROP TABLE \`election_results\``);
        await queryRunner.query(`DROP TABLE \`election\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`status\``);
        await queryRunner.query(`DROP TABLE \`role\``);
    }

}
