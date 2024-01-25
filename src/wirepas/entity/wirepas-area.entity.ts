import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, OneToOne, PrimaryColumn, BeforeSoftRemove } from "typeorm";
import { WirepasFloorlevel } from "./wirepass-floorlevel.entity";
import { EntityBase } from "../../base/entityBase";
import { Area } from "../../area/entity/area.entity";

@Entity({ name: "wirepas_area" })
export class WirepasArea extends EntityBase {
  @PrimaryColumn({ name: "id" })
  id: string;

  @ManyToOne(() => WirepasFloorlevel, (wirepasFloorlevel) => wirepasFloorlevel.wirepasArea)
  @JoinColumn({ name: "wirepas_floorlevel_id", referencedColumnName: "id" })
  wirepasFloorlevel: WirepasFloorlevel;

  @OneToOne(() => Area, (area) => area.wirepasArea)
  @JoinColumn({ name: "area_id", referencedColumnName: "id" })
  area: Area;
}
