import { MigrationInterface, QueryRunner, getRepository } from "typeorm";
import { RESOURCES_TYPES, RoleTypes } from "../../common/enums";
import { Resource } from "../entity/resource.entity";

export class ResourcesSeeder1693212625714 implements MigrationInterface {
  public async up(): Promise<void> {
    const resourceRepository = getRepository(Resource);
    const seedingData = [
      ...Object.values(RESOURCES_TYPES).map((resourceType) => ({ name: resourceType })),
    ];
    await resourceRepository.save(seedingData);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM resource`);
  }
}
