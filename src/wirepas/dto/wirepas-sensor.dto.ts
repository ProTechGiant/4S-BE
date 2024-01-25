import { IsBoolean, IsNumber, IsString, IsArray, IsInt, IsUUID, IsDate, IsOptional } from "class-validator";
import { CommonDTOs } from "../../common/dto";

export namespace WirepasSensorDto {
  export class WirepasAreaDto {
    @IsUUID()
    id: string;

    @IsString()
    name: string;
  }

  export class WirepasSensorDataDto {
    @IsString()
    node_name: string;

    @IsBoolean()
    is_approved: boolean;

    @IsBoolean()
    is_virtual: boolean;

    @IsInt()
    online_status: number;

    @IsString()
    online_status_string: string;

    @IsNumber()
    voltage: number;

    @IsNumber()
    latitude: number;

    @IsNumber()
    longitude: number;

    @IsNumber()
    altitude: number;

    @IsInt()
    position_pixel_x: number;

    @IsInt()
    position_pixel_y: number;

    @IsNumber()
    position_meter_x: number;

    @IsNumber()
    position_meter_y: number;

    @IsInt()
    positioning_role: number;

    @IsString()
    positioning_role_string: string;

    @IsInt()
    measurement_time_epoch: number;

    @IsString()
    measurement_time: string;

    @IsInt()
    positioning_time_epoch: number;

    @IsString()
    positioning_time: string;

    @IsUUID()
    building_id: string;

    @IsString()
    building_name: string;

    @IsUUID()
    floor_plan_id: string;

    @IsString()
    floor_plan_name: string;

    @IsArray()
    areas: WirepasAreaDto[];

    @IsInt()
    node_address: number;

    @IsInt()
    network_address: number;
  }

  export class CreateWirepasSensorDataDto {
    @IsNumber()
    version: number;

    @IsArray()
    nodes: WirepasSensorDataDto[];
  }
  export class GetWirepasSensor {
    @IsOptional()
    pagination: CommonDTOs.PaginationInput;

    @IsOptional()
    @IsString()
    siteId: string;
  }
}
