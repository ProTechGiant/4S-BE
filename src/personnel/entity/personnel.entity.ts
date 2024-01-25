import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne, OneToMany } from "typeorm";

import { EntityBase } from "../../base/entityBase";
import { Site } from "../../site/entity/site.entity";
import { Alert } from "../../alert/entity/alert.entity";
import { Sensor } from "../../sensor/entity/sensor.entity";

@Entity({ name: "personnel" })
export class Personnel extends EntityBase {
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id: string;

  @Column({ name: "first_name", type: "varchar" })
  firstName: string;

  @Column({ name: "last_name", type: "varchar" })
  lastName: string;

  @Column({ name: "emergency_contact", type: "varchar" })
  emergencyContact: string;

  @Column({ name: "userId", type: "varchar", nullable: true })
  userId: string;

  @OneToOne(() => Alert, (alert) => alert.personnel)
  alert: Alert;

  @ManyToOne(() => Site, (site) => site.personnel)
  @JoinColumn({ name: "site_id", referencedColumnName: "id" })
  site: Site;
  @OneToMany(() => Sensor, (sensor) => sensor.personnel)
  sensor: Sensor;
}
