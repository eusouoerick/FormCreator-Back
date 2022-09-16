import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsArray,
  ArrayNotEmpty,
  IsNotEmpty,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { QuestionDto } from './question.dto';

export class FormDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  date: Date;

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions: QuestionDto[];

  @IsNotEmpty()
  @IsNumber()
  value: number;
}
