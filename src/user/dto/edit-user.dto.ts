import { IsString, IsEmail, IsOptional, IsBoolean } from 'class-validator';

export class EditUserDto {
  @IsOptional()
  @IsEmail()
  image?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsBoolean()
  notify?: boolean;

  @IsOptional()
  @IsString()
  currentPassword?: string;

  @IsOptional()
  @IsString()
  newPassword?: string;
}
