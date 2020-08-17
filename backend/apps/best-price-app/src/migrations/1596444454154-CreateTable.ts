import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateTable1596444454154 implements MigrationInterface {
    name = 'CreateTable1596444454154'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tests" ("id" bigint NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "price" numeric(13,2) NOT NULL DEFAULT 0, CONSTRAINT "PK_4301ca51edf839623386860aed2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "groups" ("id" bigint NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "price" numeric(13,2) NOT NULL DEFAULT 0, CONSTRAINT "PK_659d1483316afb28afd3a90646e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "groups_tests_tests" ("groupsId" bigint NOT NULL, "testsId" bigint NOT NULL, CONSTRAINT "PK_2cba86acb83517ebe8c8ec522f5" PRIMARY KEY ("groupsId", "testsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7815f8ac1bf26cc9d7f5ec0a6d" ON "groups_tests_tests" ("groupsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_23d21fa5710d2657a75d8bc00b" ON "groups_tests_tests" ("testsId") `);
        await queryRunner.query(`ALTER TABLE "groups_tests_tests" ADD CONSTRAINT "FK_7815f8ac1bf26cc9d7f5ec0a6d1" FOREIGN KEY ("groupsId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "groups_tests_tests" ADD CONSTRAINT "FK_23d21fa5710d2657a75d8bc00bd" FOREIGN KEY ("testsId") REFERENCES "tests"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "groups_tests_tests" DROP CONSTRAINT "FK_23d21fa5710d2657a75d8bc00bd"`);
        await queryRunner.query(`ALTER TABLE "groups_tests_tests" DROP CONSTRAINT "FK_7815f8ac1bf26cc9d7f5ec0a6d1"`);
        await queryRunner.query(`DROP INDEX "IDX_23d21fa5710d2657a75d8bc00b"`);
        await queryRunner.query(`DROP INDEX "IDX_7815f8ac1bf26cc9d7f5ec0a6d"`);
        await queryRunner.query(`DROP TABLE "groups_tests_tests"`);
        await queryRunner.query(`DROP TABLE "groups"`);
        await queryRunner.query(`DROP TABLE "tests"`);
    }

}
