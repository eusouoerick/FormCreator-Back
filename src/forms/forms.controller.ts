import { UseGuards } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { Controller, Get, Patch, Delete } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('forms')
export class FormsController {
  @Get()
  getForms() {
    // only adm
    return 'all forms';
  }

  @Post()
  createForm() {
    return 'create form';
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
