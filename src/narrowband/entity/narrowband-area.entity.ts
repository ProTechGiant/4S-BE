import { Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Area } from "../../area/entity/area.entity";
import { EntityBase } from "../../base/entityBase";
import { NarrowbandSensorArea } from "./narrowband-sensor-area.entity";

@Entity({ name: "narrowband_area" })
export class NarrowbandArea extends EntityBase {
  @PrimaryGeneratedColumn("uuid", { name: "id"})
  id: string;

  @OneToMany(() => NarrowbandSensorArea, (narrowbandSensorArea) => narrowbandSensorArea.narrowbandArea, { cascade: true })
  narrowbandSensorArea: NarrowbandSensorArea[];

  @OneToOne(() => Area, (area) => area.narrowbandArea)
  @JoinColumn({ name: "area_id", referencedColumnName: "id" })
  area: Area;
}