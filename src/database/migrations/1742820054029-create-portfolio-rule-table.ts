import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePortfolioRuleTable1742820054029 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE SCHEMA IF NOT EXISTS "portfolio_concentration";
          `);
    // Create the table inside the "portfolio_concentration" schema
    await queryRunner.query(`
            CREATE TABLE "portfolio_concentration"."portfolio_concentration_limit_rule" (
              "id" SERIAL NOT NULL PRIMARY KEY, 
              "name" character varying(100) NOT NULL,
              "description" character varying(200)
            );
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(`
    //     DROP TABLE "portfolio_concentration_limit_rule";
    //   `);
  }
}
