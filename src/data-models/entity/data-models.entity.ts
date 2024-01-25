import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

import { EntityBase } from "../../base/entityBase";

@Entity({ name: "data_models" })
export class DataModels extends EntityBase {
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id: string;

  @Column({ name: "table_name", type: "varchar", unique: true })
  tableName: string;

  @Column({ name: "entity_name", type: "varchar", unique: true })
  entityName: string;

  @Column({ name: "friendly_name", type: "varchar" })
  friendlyName: string;

  @Column({ name: "description", type: "varchar", nullable: true })
  description?: string;

  @Column({ name: "column_meta_data", type: "json" })
  columnMetaData: JSON;

  @Column({
    name: "is_internal_table",
    type: "boolean",
    default: true,
  })
  public isInternalTable: boolean;

  @Column({
    name: "roles_meta_data",
    type: "json",
    nullable: true,
    default: null,
  })
  rolesMetaData: JSON;
}
