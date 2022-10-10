import {
  Body,
  Param,
  Query,
  UseGuards,
  Controller,
  Get,
  Patch,
  Delete,
  Post,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { QueryType } from 'src/types';
import { EditFormDto, FormDto } from './dto';
import { FormService } from './form.service';

@Controller('forms')
export class FormController {
  constructor(private formService: FormService) {}

  // @Get()
  // getForms() {
  //   // only adm
  //   return 'all forms';
  // }

  @UseGuards(JwtGuard)
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

  @UseGuards(JwtGuard)
  @Patch(':hash')
  editFormByhash(
    @Param('hash') hash: string,
    @Body() dto: EditFormDto,
    @GetUser('id') userId: number,
  ) {
    return this.formService.updateForm(hash, dto, userId);
  }

  @UseGuards(JwtGuard)
  @Delete(':hash')
  deleteFormById(@Param('hash') hash: string, @GetUser('id') userId: number) {
    return this.formService.deleteForm(hash, userId);
  }
}
