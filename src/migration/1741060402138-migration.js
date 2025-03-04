const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class Migration1741060402138 {
  name = 'Migration1741060402138';

  async up(queryRunner) {
    await queryRunner.query(`
        CREATE TABLE "test_migration" (
          "id" SERIAL NOT NULL, 
          "name" character varying(100) NOT NULL, 
          CONSTRAINT "PK_test_migration" PRIMARY KEY ("id")
        )
      `);
  }

  async down(queryRunner) {
    // This will drop the "test_migration" table.
    await queryRunner.query(`
        DROP TABLE "test_migration";
      `);
  }
};
