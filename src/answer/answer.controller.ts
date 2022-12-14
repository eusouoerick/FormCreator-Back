import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Query,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { QueryType } from 'src/types';
import { AnswerService } from './answer.service';
import { AnswerDto, CheckAnswersDto } from './dto';

@UseGuards(JwtGuard)
@Controller('forms/:hash/answers')
export class AnswerController {
  constructor(private answerService: AnswerService) {}

  @Get()
  getAnswers(
    @Param('hash') hash: string,
    @GetUser('id') userId: number,
    @Query() query: QueryType,
  ) {
    return this.answerService.getAnswers(hash, userId, query);
  }

  @Post()
  createAnswer(
    @Param('hash') hash: string,
    @Body() dto: AnswerDto,
    @GetUser() user: User,
  ) {
    return this.answerService.createAnswer(hash, dto, user);
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
