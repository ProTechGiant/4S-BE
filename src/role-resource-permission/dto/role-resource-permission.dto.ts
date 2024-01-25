import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export namespace RoleResourcePermissionDtos {
  export class UpdateRoleResourcePermissionDto {
    @IsNotEmpty()
    @IsString()
    roleId: string;

    @IsNotEmpty()
    resource: ResourcePermissionDto[];
  }
  export class DeleteResourcePermissionDto {
    @IsNotEmpty()
    @IsString()
    roleId: string;

    @IsNotEmpty()
    @IsString()
    resourceName: string;
  }
  export class ResourcePermissionDto {
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

    @IsOptional()
    @IsString()
    resourceName: string;
  }
}
