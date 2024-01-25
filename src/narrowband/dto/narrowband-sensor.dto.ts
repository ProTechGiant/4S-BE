import { IsNumber, IsString, IsArray, IsInt, IsUUID, IsDate, IsNotEmpty } from "class-validator";

export namespace NarrowbandSensorDto {

  export class CreateNarrowbandSensorDto {
    @IsNotEmpty()
    @IsString()
    id: string;

    @IsString()
    locationPriority:string;

    @IsNumber()
    sosStatus:number;

    @IsString()
    locationInterval:string;
  }

  export class NarrowbandSensorsCSVPayload {
    @IsNotEmpty()
    @IsArray()
    imeies: string[];

    @IsString()
    siteId: string;
  }
}
