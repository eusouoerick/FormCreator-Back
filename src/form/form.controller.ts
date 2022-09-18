import { Body, Param, Query, UseGuards } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { Controller, Get, Patch, Delete } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { QueryType } from 'src/types';
import { EditFormDto, FormDto } from './dto';
import { AnswerDto } from './dto/answer.dto';
import { FormService } from './form.service';

@UseGuards(JwtGuard)
@Controller('forms')
export class FormController {
  constructor(private formService: FormService) {}

  @Get()
  getForms() {
    // only adm
    return 'all forms';
  }

  @Post()
  createForm(@Body() dto: FormDto, @GetUser('id') userId: number) {
    return this.formService.create(userId, dto);
  }

  @Get(':hash')
  getFormByhash(
    @Param('hash') hash: string,
    @Query() query: QueryType,
    @GetUser('id') userId: number,
  ) {
    return this.formService.getFormByHash(hash, query, userId);
  }

  @Patch(':hash')
  editFormByhash(
    @Param(':hash') hash: string,
    @Body() dto: EditFormDto,
    @GetUser('id') userId: number,
  ) {
    return this.formService.updateForm(hash, dto, userId);
  }

  @Delete(':hash')
  deleteFormById(@Param(':hash') hash: string, @GetUser('id') userId: number) {
    return this.formService.deleteForm(hash, userId);
  }

  @Get(':hash/answers')
  getAnswers(@Param(':hash') hash: string, @GetUser('id') userId: number) {
    return this.formService.getAnswers(hash, userId);
  }

  @Post(':hash/answers')
  createAnswers(
    @Param(':hash') hash: string,
    @Body() dto: AnswerDto,
    @GetUser('id') userId: number,
  ) {
    return this.formService.createAnswer(hash, dto, userId);
  }
}
