import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class AnswerDto {
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Answer)
  answers: Answer[];
}

export class Answer {
  @IsNotEmpty()
  @IsString()
  questionId: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}
