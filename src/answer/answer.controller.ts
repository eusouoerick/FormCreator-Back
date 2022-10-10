import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { AnswerService } from './answer.service';
import { AnswerDto, CheckAnswersDto } from './dto';

@UseGuards(JwtGuard)
@Controller('forms/:hash/answers')
export class AnswerController {
  constructor(private answerService: AnswerService) {}

  @Get()
  getAnswers(@Param('hash') hash: string, @GetUser('id') userId: number) {
    return this.answerService.getAnswers(hash, userId);
  }

  @Post()
  createAnswers(
    @Param('hash') hash: string,
    @Body() dto: AnswerDto,
    @GetUser('id') userId: number,
  ) {
    return this.answerService.createAnswer(hash, dto, userId);
  }

  @Patch()
  updateAnswer(
    @Param('hash') hash: string,
    @Body() dto: CheckAnswersDto,
    @GetUser('id') userId: number,
  ) {
    return this.answerService.updateAnswer(hash, dto, userId);
  }
}