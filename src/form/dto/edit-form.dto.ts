import { IsOptional, IsString } from 'class-validator';

export class EditFormDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  date?: string;
}
