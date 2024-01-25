import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";
import { ChartTypes, RESOURCES_TYPES } from "../../common/enums";
import { CommonDTOs } from "../../common/dto";

export namespace UserProfileDtos {
  export class DashboardChartDto {
    @IsEnum(ChartTypes)
    chart: ChartTypes;

    @IsEnum(RESOURCES_TYPES)
    entity: RESOURCES_TYPES;
  }

  export class DashboardTableDto {
    entity: string;
    friendlyName: string;
  }

  export class DashboardDto {
    @ValidateNested({ each: true })
    @IsArray()
    card: RESOURCES_TYPES[];

    @ValidateNested({ each: true })
    @Type(() => DashboardChartDto)
    @IsArray()
    chart: DashboardChartDto[];

    @IsObject()
    @IsNotEmpty()
    table: DashboardTableInterface;

    @IsArray()
    sequence: string[];
  }

  export type DashboardTableInterface = {
    entity: RESOURCES_TYPES;
    filterInputString: string;
    columns: string[];
    joinTables: CommonDTOs.JoinTable[];
  };

  export class NotificationPreferencesDto {
    @IsBoolean()
    pushSms: boolean;

    @IsBoolean()
    pushEmail: boolean;

    @IsBoolean()
    pushNotification: boolean;
  }

  export class UpdateUserProfileDto {
    @IsOptional()
    @IsString()
    notificationPreferences: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => DashboardDto)
    dashboard: DashboardDto;

    @IsOptional()
    @IsString()
    image: string;
  }
}
