import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { RoleTypes } from "../../common/enums";

export namespace RoleDtos {
  export class CreateRoleDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsArray()
    resources: ResourcesPermissionDto[];
  }
  export class UpdateRoleDto {
    @IsOptional()
    @IsString()
    name: string;
  }
  export class ResourcesPermissionDto {
    @IsNotEmpty()
    @IsString()
    resourceId: string;

    @IsOptional()
    @IsBoolean()
    canRead: boolean;

    @IsOptional()
    @IsBoolean()
    canWrite: boolean;

    @IsOptional()
    @IsBoolean()
    canUpdate: boolean;

    @IsOptional()
    @IsBoolean()
    canDelete: boolean;
  }
}
