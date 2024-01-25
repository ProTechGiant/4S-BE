/* eslint-disable @typescript-eslint/no-namespace */
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export namespace WirepasAreaDtos {
  export class CreateWirepasAreaDto {
    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsArray()
    coordinates: PolygonLatLongDto[];

    @IsNotEmpty()
    r: number;

    @IsNotEmpty()
    g: number;

    @IsNotEmpty()
    b: number;

    @IsNotEmpty()
    a: number;

    @IsNotEmpty()
    @IsArray()
    sensorNodesIds: number[];

    @IsNotEmpty()
    @IsString()
    wirepasFloorlevelId: string;

    @IsNotEmpty()
    @IsString()
    siteId: string;
  }
  export class DeleteWirepasAreaDto {
    @IsNotEmpty()
    @IsString()
    siteId: string;
  }
  export class PolygonLatLongDto {
    @IsNotEmpty()
    @IsNumber()
    latitude: number;

    @IsNotEmpty()
    @IsNumber()
    longitude: number;

    @IsNotEmpty()
    @IsNumber()
    altitude: number;
  }

  export class UpdateWirepasAreaDto {
    @IsOptional()
    @IsNumber()
    wirepasFloorlevelId: number;

    @IsOptional()
    @IsString()
    description: string;

    @IsOptional()
    color: string;

    @IsOptional()
    @IsArray()
    polygonLatLong: PolygonLatLongDto[];

    @IsOptional()
    @IsArray()
    sensorNodesIds: number[];

    @IsOptional()
    @IsNumber()
    organizationId: number;
  }

  export class UnLinkWirepasAreaWithSensorNode {
    @IsNotEmpty()
    @IsNumber()
    sensorNodeId: number;
  }

  export class GetWirepasAreaByIdAndOrganizationIdDto {
    @IsOptional()
    @IsNumber()
    organizationId: number;
  }

  export class GetWirepasAreasForBulkImportsDto {
    organizationId: number;
    wirepasFloorlevelId: number;
    description: string;
  }

  export class GetAllWirepasAreasDto {
    @IsOptional()
    @IsString()
    description: string;
  }

  export class GetWirepasAreasByFilterDto {
    @IsOptional()
    @IsNumber()
    wirepasFloorlevelId: number;

    @IsOptional()
    @IsNumber()
    siteId: number;
  }
}
