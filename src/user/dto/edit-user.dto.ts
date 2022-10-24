import { IsString, IsEmail, IsOptional } from 'class-validator';

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
  @IsString()
  currentPassword?: string;

  @IsOptional()
  @IsString()
  newPassword?: string;
}
