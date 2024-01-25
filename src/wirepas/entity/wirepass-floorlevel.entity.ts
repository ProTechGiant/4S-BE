import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, BeforeSoftRemove } from "typeorm";

import { WirepasArea } from "./wirepas-area.entity";
import { WirepasBuilding } from "./wirepas-building.entity";
import { Asset } from "../../asset/entity/asset.entity";
import { EntityBase } from "../../base/entityBase";
import { WirepasSensor } from "./wirepas-sensor.entity";
import { AreaService } from "../../area/area.service";
import { AssetService } from "../../asset/asset.service";

@Entity({ name: "wirepas_floorlevel" })
export class WirepasFloorlevel extends EntityBase {
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id: string;

  @Column({ name: "gateway_network_address", type: "varchar", nullable: true })
  gatewayNetworkAddress: string;

  @Column({ name: "name", type: "varchar" })
  name: string;

  @Column({ name: "level", type: "int" })
  level: number;

  @Column({ name: "floorplan_image", type: "bytea", nullable: true })
  floorplanImage: Buffer;

  @Column({ name: "floorplan_image_id", type: "varchar", nullable: true })
  floorplanImageId: string;

  @Column({ name: "floorplan_image_url", type: "varchar", nullable: true })
  floorplanImageUrl: string;

  @Column({ name: "asset_count", type: "int" })
  assetCount: number;

  @Column({ name: "sensor_count", type: "int" })
  sensorCount: number;

  @Column({ name: "image_width", type: "decimal", precision: 11, scale: 8, default: null })
  imageWidth: number;

  @Column({ name: "image_height", type: "decimal", precision: 11, scale: 8, default: null })
  imageHeight: number;

  @Column({ name: "altitude_leftbottom", type: "decimal", precision: 11, scale: 8, default: null })
  altitudeLeftbottom: number;

  @Column({ name: "altitude_lefttop", type: "decimal", precision: 11, scale: 8, default: null })
  altitudeLefttop: number;

  @Column({ name: "altitude_rightbottom", type: "decimal", precision: 11, scale: 8, default: null })
  altitudeRightbottom: number;

  @Column({ name: "altitude_righttop", type: "decimal", precision: 11, scale: 8, default: null })
  altitudeRighttop: number;

  @Column({ name: "distance_in_m", type: "decimal", precision: 11, scale: 8, default: null })
  distanceInM: number;

  @Column({ name: "latitude_leftbottom", type: "decimal", precision: 11, scale: 8, default: null })
  latitudeLeftbottom: number;

  @Column({ name: "latitude_lefttop", type: "decimal", precision: 11, scale: 8, default: null })
  latitudeLefttop: number;

  @Column({ name: "latitude_rightbottom", type: "decimal", precision: 11, scale: 8, default: null })
  latitudeRightbottom: number;

  @Column({ name: "latitude_righttop", type: "decimal", precision: 11, scale: 8, default: null })
  latitudeRighttop: number;

  @Column({ name: "longitude_leftbottom", type: "decimal", precision: 11, scale: 8, default: null })
  longitudeLeftbottom: number;

  @Column({ name: "longitude_lefttop", type: "decimal", precision: 11, scale: 8, default: null })
  longitudeLefttop: number;

  @Column({ name: "longitude_rightbottom", type: "decimal", precision: 11, scale: 8, default: null })
  longitudeRightbottom: number;

  @Column({ name: "longitude_righttop", type: "decimal", precision: 11, scale: 8, default: null })
  longitudeRighttop: number;

  @Column({ name: "x_distance_point1", type: "float" })
  xDistancePoint1: number;

  @Column({ name: "x_distance_point2", type: "float" })
  xDistancePoint2: number;

  @Column({ name: "x_normcoord_leftbottom", type: "decimal", precision: 11, scale: 8, default: 0 })
  xNormcoordLeftbottom: number;

  @Column({ name: "x_normcoord_lefttop", type: "decimal", precision: 11, scale: 8, default: 0 })
  xNormcoordLefttop: number;

  @Column({ name: "x_normcoord_righttop", type: "decimal", precision: 11, scale: 8, default: 1 })
  xNormcoordRighttop: number;

  @Column({ name: "x_normcoord_rightbottom", type: "decimal", precision: 11, scale: 8, default: 1 })
  xNormcoordRightbottom: number;

  @Column({ name: "y_distance_point1", type: "float", default: 0 })
  yDistancePoint1: number;

  @Column({ name: "y_distance_point2", type: "float", default: 0 })
  yDistancePoint2: number;

  @Column({ name: "y_normcoord_leftbottom", type: "decimal", precision: 11, scale: 8, default: 1 })
  yNormcoordLeftbottom: number;

  @Column({ name: "y_normcoord_lefttop", type: "decimal", precision: 11, scale: 8, default: 0 })
  yNormcoordLefttop: number;

  @Column({ name: "y_normcoord_rightbottom", type: "decimal", precision: 11, scale: 8, default: 1 })
  yNormcoordRightbottom: number;

  @Column({ name: "y_normcoord_righttop", type: "decimal", precision: 11, scale: 8, default: 0 })
  yNormcoordRighttop: number;

  @OneToMany(() => WirepasArea, (wirepasArea) => wirepasArea.wirepasFloorlevel, { cascade: true })
  wirepasArea: WirepasArea[];

  @OneToMany(() => WirepasSensor, (wirepasSensor) => wirepasSensor.wirepasFloorlevel, { nullable: true })
  wirepasSensor: WirepasSensor[];

  @OneToMany(() => Asset, (asset) => asset.wirepasFloorlevel, { cascade: true })
  asset: Asset[];

  @ManyToOne(() => WirepasBuilding, (wirepasBuilding) => wirepasBuilding.wirepasFloorlevel)
  @JoinColumn({ name: "wirepas_building_id", referencedColumnName: "id" })
  wirepasBuilding: WirepasBuilding;

  @BeforeSoftRemove()
  async beforeRemove() {
    const areaService = new AreaService();
    const assetService = new AssetService();
    await areaService.deleteArea({ wirepasFloorlevel: this.id }, this.currentUser, this.transactionScope);
    await assetService.deleteAsset({ wirepasFloorlevel: this.id }, this.transactionScope);
  }
}
