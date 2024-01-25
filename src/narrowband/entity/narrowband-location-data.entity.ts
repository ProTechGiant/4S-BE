import { PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, Entity } from "typeorm";
import { EntityBase } from "../../base/entityBase";
import { NarrowbandSensor } from "./narrowband-sensor.entity";

@Entity({ name: "narrowband-location-data" })
export class NarrowbandLocationData extends EntityBase {
  @PrimaryGeneratedColumn("uuid", { name: "id"})
  id: string;

  @Column({ name: "time_stamp", type: "int" })
  timeStamp: number;

  @Column({ name: "battery", type: "int" ,nullable:true})
  battery: number;

  @Column({ name: "latitude", type: "decimal", precision: 10, scale: 8 })
  latitude: number;

  @Column({ name: "longitude", type: "decimal", precision: 11, scale: 8 })
  longitude: number;

  @Column({ name: "wifi", type: "varchar" ,nullable:true})
  wifi: string;

  @Column({ name: "cumulative_steps", type: "int" ,nullable:true })
  cumulativeSteps: number;

  @Column({ name: "network_info_strength", type: "int" ,nullable:true})
  networkInfoStrength: number;

  @Column({ name: "alarm", type: "int" ,nullable:true})
  alarm: number;

  @ManyToOne(() => NarrowbandSensor, (narrowbandSensor) => narrowbandSensor.narrowbandLocationData, { nullable: false })
  @JoinColumn({ name: "narrowband_sensor_id", referencedColumnName: "id" })
  narrowbandSensor: NarrowbandSensor;
}
