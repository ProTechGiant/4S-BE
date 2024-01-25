import { IsString, IsNumber, IsNotEmpty, IsOptional, IsUUID, IsArray } from "class-validator";

export namespace AssetDtos {
  export class CreateAssetDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    model: string;

    @IsOptional()
    @IsString()
    imageUrl: string;

    @IsNotEmpty()
    @IsString()
    deviceType: string;

    @IsNotEmpty()
    @IsString()
    serialNumber: string;

    @IsNotEmpty()
    @IsNumber()
    warrantyDate: number;

    @IsNotEmpty()
    @IsNumber()
    issueDate: number;

    @IsNotEmpty()
    @IsUUID()
    wirepasBuildingId: string;

    @IsNotEmpty()
    @IsUUID()
    wirepasFloorlevelId: string;

    @IsNotEmpty()
    @IsUUID()
    siteId: string;

    @IsArray()
    @IsString({ each: true })
    sensorIdz: string[];
  }

  export class UpdateAssetDto {
    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    model: string;

    @IsOptional()
    @IsString()
    serialNumber: string;

    @IsOptional()
    @IsString()
    warrantyDate: string;

    @IsOptional()
    @IsString()
    issueDate: string;

    @IsOptional()
    @IsString()
    wirepasFloorLevelId: string;

    @IsOptional()
    @IsString()
    wirepasBuildingId: string;

    @IsOptional()
    @IsString()
    siteId: string;

    @IsOptional()
    @IsString()
    deviceType: string;

    @IsOptional()
    @IsString()
    image: string;
  }
}
