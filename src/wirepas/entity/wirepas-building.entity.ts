import { Entity, Column, ManyToOne, JoinColumn, OneToMany, PrimaryColumn, BeforeSoftRemove, Index } from "typeorm";
import { EntityBase } from "../../base/entityBase";
import { Asset } from "../../asset/entity/asset.entity";
import { Site } from "../../site/entity/site.entity";
import { WirepasSensor } from "./wirepas-sensor.entity";
import { WirepasFloorlevel } from "./wirepass-floorlevel.entity";
import { WirepasFloorlevelService } from "../wirepas-floorlevel.service";
import { AssetService } from "../../asset/asset.service";

@Entity({ name: "wirepas_building" })
@Index("unique_building", ["name", "site"], { unique: true })
export class WirepasBuilding extends EntityBase {
  @PrimaryColumn({ name: "id" })
  id: string;

  @Column({ name: "name", type: "varchar" })
  name: string;

  @Column({ name: "latitude", type: "decimal", precision: 11, scale: 2 })
  latitude: number;

  @Column({ name: "longitude", type: "decimal", precision: 11, scale: 2 })
  longitude: number;

  @Column({ name: "location", type: "varchar" })
  location: string;

  @Column({ name: "street_address", type: "varchar" })
  streetAddress: string;

  @Column({ name: "asset_count", type: "int" })
  assetCount: number;

  @OneToMany(() => WirepasSensor, (wirepasSensor) => wirepasSensor.wirepasBuilding, { nullable: false })
  wirepasSensor: WirepasSensor[];

  @OneToMany(() => WirepasFloorlevel, (wirepasFloorlevel) => wirepasFloorlevel.wirepasBuilding, { nullable: false })
  wirepasFloorlevel: WirepasFloorlevel[];

  @OneToMany(() => Asset, (asset) => asset.wirepasBuilding)
  assets: Asset[];

  @ManyToOne(() => Site, (site) => site.wirepasBuilding)
  @JoinColumn({ name: "site_id", referencedColumnName: "id" })
  site: Site;

  @BeforeSoftRemove()
  async beforeRemove() {
    const wirepasFloorlevelService = new WirepasFloorlevelService();
    const assetService = new AssetService();

    await wirepasFloorlevelService.deleteWirepasFloorlevel({ wirepasBuilding: this.id }, this.currentUser, this.transactionScope);
    await assetService.deleteAsset({ wirepasFloorlevel: this.id }, this.transactionScope);
  }
}
