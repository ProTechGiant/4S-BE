import { CommonDTOs } from "../../common/dto";
import { OrderBy } from "../../common/enums";
import { WirepasBuilding } from "../entity/wirepas-building.entity";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export namespace WirepasBuildingDtos {
  export class CreateDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsNumber()
    latitude: number;

    @IsNotEmpty()
    @IsNumber()
    longitude: number;

    @IsNotEmpty()
    @IsString()
    streetAddress: string;

    @IsNotEmpty()
    @IsString()
    location: string;

    @IsNotEmpty()
    @IsString()
    siteId: string;
  }

  export class UpdateWirepasBuildingDto {
    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsNumber()
    latitude: number;

    @IsOptional()
    @IsNumber()
    longitude: number;

    @IsOptional()
    @IsString()
    location: string;

    @IsOptional()
    @IsString()
    streetAddress: string;

    @IsOptional()
    @IsString()
    siteId: string;
  }

  export class GetWirepasBuildingByIdResponse extends WirepasBuilding {
    sensorCounts: number;
    roomCounts: number;
    isAlert: boolean;
    wirepasFloorlevelCounts: number;
  }

  export class GetAllWirepasBuildingsDto {
    @IsOptional()
    @IsString()
    filterInputString: string;
  }
  export class GetBuildingDto extends GetAllWirepasBuildingsDto {
    @IsString()
    siteId: string;

    pagination: CommonDTOs.PaginationInput;
  }
  export class GetBuildingsDto extends GetAllWirepasBuildingsDto {
    @IsOptional()
    @IsString()
    siteId: string;

    pagination: CommonDTOs.PaginationInput;

    @IsOptional()
    @IsEnum(OrderBy)
    orderBy?: OrderBy;

    @IsOptional()
    @IsString()
    orderByColumn?: string;
  }

  export class GetWirepasBuildingForBulkImportDto {
    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    location: string;

    @IsNotEmpty()
    @IsNumber()
    organizationId: number;
  }

  export interface WntBuildingInterface {
    id: string;
    name: string;
    update_time: number;
  }
}
