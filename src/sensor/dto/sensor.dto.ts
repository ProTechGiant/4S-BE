import { IsString, IsEnum, IsOptional } from "class-validator";
import { SensorProtocolTypes } from "../enum/sensor.enum";
import { CommonDTOs } from "../../common/dto";
import { OrderBy } from "../../common/enums";

export namespace SensorDto {
  export class GetSensorDto {
    @IsEnum(SensorProtocolTypes)
    protocol: SensorProtocolTypes;

    @IsString()
    filterInputString: string;

    @IsString()
    siteId: string;
  }
  export class GetSensorWithSiteDto {
    @IsOptional()
    @IsString()
    siteId: string;

    @IsOptional()
    @IsString()
    filterInputString: string;

    pagination: CommonDTOs.PaginationInput;

    @IsOptional()
    @IsEnum(OrderBy)
    orderBy?: OrderBy;

    @IsOptional()
    @IsString()
    orderByColumn?: string;
  }

  export class DeleteSensorDto {
    @IsString()
    siteId: string;
  }

  export class CreateSensorDto {
    @IsEnum(SensorProtocolTypes)
    protocol: SensorProtocolTypes;

    @IsString()
    type: string;

    @IsString()
    siteId: string;
  }
}
