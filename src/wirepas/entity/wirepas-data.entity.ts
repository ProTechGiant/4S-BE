import { PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, Entity } from "typeorm";
import { WirepasSensor } from "./wirepas-sensor.entity";
import { EntityBase } from "../../base/entityBase";

@Entity({ name: "wirepas_data" })
export class WirepasData extends EntityBase {
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id: string;

  @Column({ name: "is_approved", type: "boolean", default: false })
  isApproved: boolean;

  @Column({ name: "online_status_string", type: "int" })
  onlineStatus: number;

  @Column({ name: "voltage", type: "int" })
  voltage: number;

  @Column({ name: "latitude", type: "decimal", precision: 11, scale: 8 })
  latitude: number;

  @Column({ name: "longitude", type: "decimal", precision: 11, scale: 8 })
  longitude: number;

  @Column({ name: "altitude", type: "decimal", precision: 11, scale: 8 })
  altitude: number;

  @Column({ name: "position_pixel_x", type: "int" })
  positionPixelX: number;

  @Column({ name: "position_pixel_y", type: "int" })
  positionPixelY: number;

  @Column({ name: "position_meter_x", type: "varchar" })
  positionMeterX: string;

  @Column({ name: "position_meter_y", type: "varchar" })
  positionMeterY: string;

  @Column({ name: "positioning_role_string", type: "int" })
  positioningRole: number;

  @Column({ name: "measurement_time", type: "timestamp" })
  measuremenTime: Date;

  @Column({ name: "positioning_time", type: "timestamp" })
  positioningTime: Date;

  @Column({ name: "wirepas_building_id", type: "uuid" })
  wirepasBuildingId: string;

  @Column({ name: "wirepas_building_name", type: "varchar" })
  wirepasBuildingName: string;

  @Column({ name: "floor_plan_id", type: "uuid" })
  floorPlanId: string;

  @Column({ name: "floor_plan_name", type: "varchar" })
  floorPlanName: string;

  @Column({ name: "wire_pas_areas", type: "text" })
  wirepasAreas: string;

  @Column({ name: "node_address", type: "int" })
  nodeAddress: number;

  @Column({ name: "network_address", type: "int" })
  networkAddress: number;

  @ManyToOne(() => WirepasSensor, (wirepasSensor) => wirepasSensor.wirepasData, { nullable: false })
  @JoinColumn({ name: "wirepas_sensor_id", referencedColumnName: "id" })
  wirepasSensor: WirepasSensor;
}
