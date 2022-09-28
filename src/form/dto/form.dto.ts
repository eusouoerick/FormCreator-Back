import {
  IsString,
  IsArray,
  ArrayNotEmpty,
  IsNotEmpty,
  ValidateNested,
  IsOptional,
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
  @IsString()
  date: Date;

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions: QuestionDto[];
}
