/* eslint-disable @typescript-eslint/no-namespace */
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { CommonDTOs } from "../../common/dto";
import { OrderBy } from "../../common/enums";

export namespace WirepasFloorlevelDtos {
  export class PolygonLatLong {
    @IsOptional()
    @IsNumber()
    latitudeLefttop: number;

    @IsOptional()
    @IsNumber()
    longitudeLefttop: number;

    @IsOptional()
    @IsNumber()
    altitudeLefttop: number;

    @IsOptional()
    @IsNumber()
    xNormcoordLefttop: number;

    @IsOptional()
    @IsNumber()
    yNormcoordLefttop: number;

    @IsOptional()
    @IsNumber()
    latitudeRighttop: number;

    @IsOptional()
    @IsNumber()
    longitudeRighttop: number;

    @IsOptional()
    @IsNumber()
    altitudeRighttop: number;

    @IsOptional()
    @IsNumber()
    xNormcoordRighttop: number;

    @IsOptional()
    @IsNumber()
    yNormcoordRighttop: number;

    @IsOptional()
    @IsNumber()
    latitudeLeftbottom: number;

    @IsOptional()
    @IsNumber()
    longitudeLeftbottom: number;

    @IsOptional()
    @IsNumber()
    altitudeLeftbottom: number;

    @IsOptional()
    @IsNumber()
    xNormcoordLeftbottom: number;

    @IsOptional()
    @IsNumber()
    yNormcoordLeftbottom: number;

    @IsOptional()
    @IsNumber()
    latitudeRightbottom: number;

    @IsOptional()
    @IsNumber()
    longitudeRightbottom: number;

    @IsOptional()
    @IsNumber()
    altitudeRightbottom: number;

    @IsOptional()
    @IsNumber()
    xNormcoordRightbottom: number;

    @IsOptional()
    @IsNumber()
    yNormcoordRightbottom: number;

    @IsOptional()
    @IsNumber()
    xDistancePoint1: number;

    @IsOptional()
    @IsNumber()
    yDistancePoint1: number;

    @IsOptional()
    @IsNumber()
    xDistancePoint2: number;

    @IsOptional()
    @IsNumber()
    yDistancePoint2: number;

    @IsOptional()
    @IsNumber()
    distanceInM: number;
  }

  export class CreateWirepasFloorlevelDto extends PolygonLatLong {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    wirepasBuildingId: string;

    @IsNumber()
    @IsNotEmpty()
    level: number;
  }

  export class GetFloorlevelDto {
    @IsOptional()
    @IsString()
    siteId: string;

    pagination: CommonDTOs.PaginationInput;

    @IsOptional()
    @IsString()
    filterInputString: string;

    @IsOptional()
    @IsEnum(OrderBy)
    orderBy?: OrderBy;

    @IsOptional()
    @IsString()
    orderByColumn?: string;
  }

  export class UpdateWirepasFloorlevelDto extends PolygonLatLong {
    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsNumber()
    level: number;

    @IsOptional()
    @IsString()
    wirepasBuildingId: string;
  }

  export class WntFloorlevelUpdateInputType {
    imageHeight: number;
    imageWidth: number;
    imageId: string;
    wirepasBuildingId: string;
  }

  export class StoreUserIdInRedis {
    @IsString()
    wirepasFloorlevelId: string;

    @IsString()
    token: string;
  }
}
