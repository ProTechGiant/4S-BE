import { ArrayUnique, IsArray, IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";
import { SensorProtocolTypes } from "../../sensor/enum/sensor.enum";
import { ActionType, AlertCriteriaTypes, AlertSeverity, AlertTypes } from "../../common/enums";

export namespace AlertsRuleDtos {
  export class CreateAlertRuleInput {
    @IsNotEmpty()
    @IsEnum(AlertTypes)
    alertType: AlertTypes;

    @IsNotEmpty()
    @IsEnum(AlertSeverity)
    alertSeverity: AlertSeverity;

    @IsNotEmpty()
    @IsEnum(AlertCriteriaTypes)
    alertCriteria: AlertCriteriaTypes;

    @IsNotEmpty()
    @IsArray()
    // @ArrayUnique()
    // @ValidateNested({ each: true })
    // @IsEnum(ActionType, { each: true })
    actionType: ActionType[];

    @IsNotEmpty()
    @IsArray()
    recepients: string[];

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsArray()
    sensorIdz: string[];

    @IsNotEmpty()
    @IsString()
    siteId: string;

    @IsOptional()
    @IsString()
    areaId: string;
  }

  export class UpdateAlertRuleInput {
    @IsOptional()
    @IsEnum(AlertTypes)
    alertType: AlertTypes;

    @IsOptional()
    @IsEnum(AlertSeverity)
    alertSeverity: AlertSeverity;

    @IsOptional()
    @IsEnum(AlertCriteriaTypes)
    alertCriteria: AlertCriteriaTypes;

    @IsOptional()
    @IsArray()
    // @ArrayUnique()
    // @ValidateNested({ each: true })
    // @IsEnum(ActionType, { each: true })
    actionType: ActionType[];

    @IsOptional()
    @IsArray()
    recepients: string[];

    @IsOptional()
    @IsString()
    createdBy: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsArray()
    sensorIdz: string[];

    @IsOptional()
    @IsString()
    siteId: string;

    @IsOptional()
    @IsString()
    areaId: string;
  }
}
