import {
  IsString,
  IsArray,
  ArrayNotEmpty,
  IsNotEmpty,
  ValidateNested,
  IsOptional,
  IsNumber,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { QuestionDto } from './question.dto';

export class FormDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  desc: string;

  @IsOptional()
  @Matches(/\d{4}(-|\/)\d{2}(-|\/)\d{2}/)
  date: string;

  @IsOptional()
  @IsNumber()
  average: number;

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions: QuestionDto[];
}
