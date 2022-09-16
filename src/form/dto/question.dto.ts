import {
  IsString,
  IsNumber,
  IsArray,
  IsNotEmpty,
  ValidateIf,
  IsOptional,
} from 'class-validator';

export class QuestionDto {
  @IsNotEmpty()
  @IsString()
  @ValidateIf((txt) => txt === 'select' || txt === 'text' || txt === 'textarea')
  type: 'select' | 'text' | 'textarea';

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsArray()
  inputs?: string[];

  @IsNotEmpty()
  @IsNumber()
  value: number;
}
