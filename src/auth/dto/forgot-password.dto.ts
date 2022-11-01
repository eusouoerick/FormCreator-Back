import { IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class ForgotPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  password: string;
}
