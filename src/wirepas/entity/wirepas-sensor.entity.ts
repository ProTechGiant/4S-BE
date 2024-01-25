import { PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn, Entity, Column, PrimaryColumn, OneToOne, RelationId, BeforeSoftRemove } from "typeorm";
import { WirepasData } from "./wirepas-data.entity";
import { WirepasBuilding } from "./wirepas-building.entity";
import { Sensor } from "../../sensor/entity/sensor.entity";
import { EntityBase } from "../../base/entityBase";
import { WirepasFloorlevel } from "./wirepass-floorlevel.entity";
import { WirepasSensorService } from "../wirepas-sensor.service";

@Entity({ name: "wirepas_sensor" })
export class WirepasSensor extends EntityBase {
  @PrimaryColumn({ name: "id" })
  id: number;

  @PrimaryGeneratedColumn("uuid", { name: "uuid" })
  uuid: string;

  @Column({ name: "wnt_gateway_id", type: "int" })
  wntGatewayId: number;

  @Column({ name: "wnt_gateway_name", type: "varchar" })
  wntGatewayName: string;

  @ManyToOne(() => WirepasFloorlevel, (wirepasFloorlevel) => wirepasFloorlevel.wirepasSensor, { nullable: false })
  @JoinColumn({ name: "wirepas_floorlevel_id", referencedColumnName: "id" })
  wirepasFloorlevel: WirepasFloorlevel;

  @ManyToOne(() => WirepasBuilding, (wirepasBuilding) => wirepasBuilding.wirepasSensor, { nullable: false })
  @JoinColumn({ name: "wirepas_building_id", referencedColumnName: "id" })
  wirepasBuilding: WirepasBuilding;

  @OneToMany(() => WirepasData, (wirepasData) => wirepasData.wirepasSensor, { nullable: false })
  wirepasData: WirepasData[];

  @OneToOne(() => Sensor, (sensor) => sensor.wirepasSensor)
  @JoinColumn({ name: "sensor_id", referencedColumnName: "id" })
  sensor: Sensor;

  @BeforeSoftRemove()
  async beforeSoftRemove() {
    const wirepasSensorService = new WirepasSensorService();
    await wirepasSensorService.deleteWirepasData({ wirepasSensor: this.id }, this.transactionScope);
  }
}
