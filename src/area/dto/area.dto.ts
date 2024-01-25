import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from "class-validator";
import { SensorProtocolTypes } from "../../sensor/enum/sensor.enum";
import { CoordinatesPoints } from "../../common/interfaces/point.interface";
import { WirepasAreaDtos } from "../../wirepas/dto/wirepas-area.dto";

export namespace AreaDtos {
  export class DeleteAreaInputData {
    @IsNotEmpty()
    @IsString()
    wirepasFloorlevelId: string;

    @IsNotEmpty()
    @IsString()
    siteId: string;
  }
  export class CreateAreaInputData {
    @IsNotEmpty()
    @IsString()
    wirepasFloorlevelId: string;

    @IsNotEmpty()
    @IsString()
    siteId: string;

    @IsArray()
    coordinates: CoordinatesPoints[];

    @IsNotEmpty()
    @IsString()
    a: string;

    @IsNotEmpty()
    @IsString()
    b: string;

    @IsNotEmpty()
    @IsString()
    r: string;

    @IsNotEmpty()
    @IsString()
    g: string;

    @IsOptional()
    @IsString()
    description: string;
  }

  export class UpdateAreaDto {
    @IsOptional()
    @IsString()
    wirepasFloorlevelId: string;

    @IsOptional()
    @IsString()
    siteId: string;

    @IsOptional()
    @IsArray()
    coordinates: WirepasAreaDtos.PolygonLatLongDto[];

    @IsOptional()
    @IsString()
    a: string;

    @IsOptional()
    @IsString()
    b: string;

    @IsOptional()
    @IsString()
    r: string;

    @IsOptional()
    @IsString()
    g: string;

    @IsOptional()
    @IsString()
    description: string;
  }

  export class CreateAreaInput {
    @IsNotEmpty()
    @IsEnum(SensorProtocolTypes)
    protocol: SensorProtocolTypes;

    @IsNotEmpty()
    @IsObject()
    data: CreateAreaInputData;
  }

  export class DeleteAreaDto {
    @IsNotEmpty()
    @IsString()
    siteId: string;
  }

  export class GetAreaDto {
    @IsNotEmpty()
    @IsString()
    siteId: string;

    @IsEnum(SensorProtocolTypes)
    protocol: SensorProtocolTypes;
  }
}
