import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { EntityBase } from "../../base/entityBase";
import { NarrowbandArea } from "./narrowband-area.entity";
import { NarrowbandSensor } from "./narrowband-sensor.entity";

@Entity({ name: "narrowband_sensor_area" })
export class NarrowbandSensorArea extends EntityBase {
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id: string;

  @ManyToOne(() => NarrowbandSensor, (narrowbandSensor) => narrowbandSensor.narrowbandSensorArea)
  @JoinColumn({ name: "narrowband_sensor_id", referencedColumnName: "id" })
  narrowbandSensor: NarrowbandSensor;

  @ManyToOne(() => NarrowbandArea, (narrowbandArea) => narrowbandArea.narrowbandSensorArea)
  @JoinColumn({ name: "narrowband_area_id", referencedColumnName: "id" })
  narrowbandArea: NarrowbandArea;
}
