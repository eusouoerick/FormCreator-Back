import { IsNumber, IsOptional, IsString } from 'class-validator';

export class EditFormDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  desc?: string;

  @IsOptional()
  @IsNumber()
  average?: number;

  @IsOptional()
  @IsString()
  date?: string;
}
