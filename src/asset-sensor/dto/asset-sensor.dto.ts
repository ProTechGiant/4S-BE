import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export namespace AssetSensorDtos {
  export class CreateAssetSensorInput {
    @IsNotEmpty()
    @IsString()
    sensorId: string;

    @IsNotEmpty()
    @IsString()
    assetId: string;
  }
  export class UpdateAssetSensorInput {
    @IsOptional()
    @IsString()
    sensorId: string;

    @IsOptional()
    @IsString()
    assetId: string;
  }

  export class CreateAssetSensorDto {
    @IsNotEmpty()
    @IsUUID()
    assetId: string;

    @IsNotEmpty()
    @IsUUID()
    sensorId: string;
  }
}
