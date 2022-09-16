import { Body, UseGuards } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { Controller, Get, Patch, Delete } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { FormDto } from './dto';
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

  @Get(':token')
  getFormById() {
    return 'get form by id';
  }

  @Patch(':token')
  editFormById() {
    return 'edit form by id';
  }

  @Delete(':token')
  deleteFormById() {
    return 'delete form by id';
  }

  @Get(':token/answers')
  getAnswers() {
    return 'get answers';
  }

  @Post(':token/answers')
  createAnswers() {
    return 'create answers';
  }
}
