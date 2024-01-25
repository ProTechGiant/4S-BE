/* eslint-disable @typescript-eslint/no-namespace */
import { ArrayMinSize, IsArray, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString, IsStrongPassword } from "class-validator";
import { RoleTypes } from "../../common/enums";

export namespace UserDtos {
  export class RegisterDto {
    @IsOptional()
    @IsString()
    firstName: string;

    @IsOptional()
    @IsString()
    lastName: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    password: string;

    @IsOptional()
    @IsString()
    phoneNumber: string;

    @IsOptional()
    @IsString()
    siteId: string;

    @IsOptional()
    @IsString()
    pushNotificationToken: string;

    @IsOptional()
    @IsString()
    image: string;

    @IsNotEmpty()
    @IsArray()
    @ArrayMinSize(1)
    @IsString({ each: true })
    roleIdz: string[];
  }
  export class LoginDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
  }

  export class ForgotPasswordDto {
    @IsEmail()
    @IsOptional()
    email: string;

    @IsString()
    @IsOptional()
    phoneNumber: string;
  }

  export class ResetPasswordDto {
    @IsNotEmpty()
    @IsString()
    userId: string;

    @IsNotEmpty()
    @IsString()
    token: string;

    @IsNotEmpty()
    @IsStrongPassword()
    password: string;
  }

  export class UpdateUserDto {
    @IsOptional()
    @IsString()
    firstName: string;

    @IsOptional()
    @IsString()
    lastName: string;

    @IsOptional()
    @IsString()
    siteId: string;

    @IsOptional()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsNotEmpty()
    phoneNumber: string;

    @IsOptional()
    @IsString({ each: true })
    roleIdz: string[];
  }
  export class InserUserDto extends UpdateUserDto {
    @IsOptional()
    @IsString()
    @IsStrongPassword()
    password: string;
  }

  export class GetAllUsersDto {
    @IsOptional()
    @IsString()
    filterInputString: string;

    @IsNotEmpty()
    @IsNumber()
    limit: number;

    @IsNotEmpty()
    @IsNumber()
    offset: number;
  }

  export class ChangePasswordDto {
    @IsNotEmpty()
    @IsString()
    currentPassword: string;

    @IsNotEmpty()
    @IsString()
    newPassword: string;
  }
  export class VerifyUserDto {
    @IsNotEmpty()
    @IsString()
    token: string;
  }
  export class PhoneNumberVerifyDto {
    @IsNotEmpty()
    @IsPhoneNumber()
    phoneNumber: string;

    @IsNotEmpty()
    @IsString()
    code: string;
  }

  export class GetUserByIdWithRoleAndRightsOutput {
    canread: boolean;
    canupdate: boolean;
    candelete: boolean;
    canwrite: boolean;
    resourceid: string;
    resourcename: string;
  }
}
