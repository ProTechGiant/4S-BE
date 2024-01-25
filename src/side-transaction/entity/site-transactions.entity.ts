import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToMany, OneToOne, ManyToOne } from "typeorm";

import { EntityBase } from "../../base/entityBase";

@Entity({ name: "site_transaction" })
export class SideTransaction extends EntityBase {
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id: string;

  @Column({ name: "sql_query", type: "varchar" })
  sqlQuery: string;
}
