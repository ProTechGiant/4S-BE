import { EntityBase } from "../../base/entityBase";
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Asset } from "../../asset/entity/asset.entity";
import { Sensor } from "../../sensor/entity/sensor.entity";

@Entity({ name: "asset_sensor" })
export class AssetSensor extends EntityBase {
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id: string;

  @ManyToOne(() => Sensor, (sensor) => sensor.assetSensor)
  @JoinColumn({ name: "sensor_id", referencedColumnName: "id" })
  sensor: Sensor;

  @ManyToOne(() => Asset, (asset) => asset.assetSensor)
  @JoinColumn({ name: "asset_id", referencedColumnName: "id" })
  asset: Asset;
}
