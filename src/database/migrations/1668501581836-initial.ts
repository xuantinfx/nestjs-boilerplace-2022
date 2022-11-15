import { MigrationInterface, QueryRunner } from "typeorm";

export class initial1668501581836 implements MigrationInterface {
    name = 'initial1668501581836'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`role\` (\`id\` int NOT NULL, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`status\` (\`id\` int NOT NULL, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NULL, \`password\` varchar(255) NULL, \`provider\` varchar(255) NOT NULL DEFAULT 'email', \`socialId\` varchar(255) NULL, \`firstName\` varchar(255) NULL, \`lastName\` varchar(255) NULL, \`hash\` varchar(255) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`roleId\` int NULL, \`statusId\` int NULL, INDEX \`IDX_9bd2fe7a8e694dedc4ec2f666f\` (\`socialId\`), INDEX \`IDX_58e4dbff0e1a32a9bdc861bb29\` (\`firstName\`), INDEX \`IDX_f0e1b4ecdca13b177e2e3a0613\` (\`lastName\`), INDEX \`IDX_e282acb94d2e3aec10f480e4f6\` (\`hash\`), UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_c28e52f758e7bbc53828db92194\` FOREIGN KEY (\`roleId\`) REFERENCES \`role\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_dc18daa696860586ba4667a9d31\` FOREIGN KEY (\`statusId\`) REFERENCES \`status\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_dc18daa696860586ba4667a9d31\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_c28e52f758e7bbc53828db92194\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_e282acb94d2e3aec10f480e4f6\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_f0e1b4ecdca13b177e2e3a0613\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_58e4dbff0e1a32a9bdc861bb29\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_9bd2fe7a8e694dedc4ec2f666f\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`status\``);
        await queryRunner.query(`DROP TABLE \`role\``);
    }

}
