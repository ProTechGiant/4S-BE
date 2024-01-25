/* eslint-disable @typescript-eslint/no-namespace */
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export namespace PersonnelDtos {
  export class CreatePersonnelDto {
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsNotEmpty()
    @IsString()
    emergencyContact: string;

    @IsNotEmpty()
    @IsString()
    siteId: string;

    @IsOptional()
    @IsString()
    userId: string;
  }

  export class UpdatePersonnelDto {
    @IsOptional()
    @IsString()
    firstName: string;

    @IsOptional()
    @IsString()
    lastName: string;

    @IsOptional()
    @IsString()
    emergencyContact: string;

    @IsOptional()
    @IsString()
    siteId: string;

    @IsOptional()
    @IsString()
    userId: string;
  }
}
