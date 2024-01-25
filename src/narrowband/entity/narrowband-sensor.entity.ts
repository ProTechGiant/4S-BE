import { PrimaryGeneratedColumn, JoinColumn, Entity, Column, PrimaryColumn, OneToOne, OneToMany } from "typeorm";
import { Sensor } from "../../sensor/entity/sensor.entity";
import { EntityBase } from "../../base/entityBase";
import { NarrowbandLocationData } from "./narrowband-location-data.entity";
import { NarrowbandSensorArea } from "./narrowband-sensor-area.entity";

@Entity({ name: "narrowband_sensor" })
export class NarrowbandSensor extends EntityBase {
  @PrimaryColumn({ name: "id" })
  id: string;

  @PrimaryGeneratedColumn("uuid", { name: "uuid" })
  uuid: string;

  @Column({ name: "location_priority", type: "varchar", default: "1,2" })
  locationPriority: string;

  @Column({ name: "sos_status", type: "boolean", default: 1 })
  sosStatus: number;

  @Column({ name: "location_interval", type: "varchar", default: "1@00002400" })
  locationInterval: string;

  @OneToOne(() => Sensor, (sensor) => sensor.narrowbandSensor)
  @JoinColumn({ name: "sensor_id", referencedColumnName: "id" })
  sensor: Sensor;

  @OneToMany(() => NarrowbandLocationData, (narrowbandLocationData) => narrowbandLocationData.narrowbandSensor, { nullable: false })
  narrowbandLocationData: NarrowbandLocationData[];

  @OneToMany(() => NarrowbandSensorArea, (narrowbandSensorArea) => narrowbandSensorArea.narrowbandArea, { cascade: true })
  narrowbandSensorArea: NarrowbandSensorArea[];
}
