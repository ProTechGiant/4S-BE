import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { AlertTypes, OrderBy } from "../../common/enums";
import { Sensor } from "../../sensor/entity/sensor.entity";
import { NarrowbandLocationData } from "../../narrowband/entity/narrowband-location-data.entity";
import { CommonDTOs } from "../../common/dto";

export namespace AlertDtos {
  export class CreateAlertInput {
    @IsOptional()
    @IsUUID()
    personnelId?: string;

    @IsNotEmpty()
    @IsUUID()
    siteId: string;

    @IsNotEmpty()
    @IsUUID()
    alertRuleId: string;

    @IsNotEmpty()
    sensorId: string | number;
  }
  export class GetAllAlerts {
    @IsOptional()
    @IsString()
    filterInputString: string;

    @IsNotEmpty()
    @IsUUID()
    siteId: string;

    pagination: CommonDTOs.PaginationInput;

    @IsOptional()
    @IsEnum(OrderBy)
    orderBy?: OrderBy;

    @IsOptional()
    @IsString()
    orderByColumn?: string;
  }

  export class AlertHandlerInput {
    alertType: AlertTypes;
    sensor: Sensor;
    data?: {
      currentLocation?: NarrowbandLocationData;
      previousLocation?: NarrowbandLocationData;
    };
  }
}
