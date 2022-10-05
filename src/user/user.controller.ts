import { Controller, Get, Patch, Query, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { UserService } from './user.service';
import { Body } from '@nestjs/common';
import { EditUserDto } from './dto';
import { Param } from '@nestjs/common';
import { QueryType } from 'src/types';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getUser(@GetUser('id') userId: number, @Query() query: QueryType) {
    const data = await this.userService.findUser(userId, query);
    return { user: data };
  }

  @Patch()
  async editUser(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
    const data = await this.userService.findUserAndUpdate(userId, dto);
    return { user: data };
  }

  @Get('forms')
  getForms(@GetUser('id') userId: number, @Query() query: QueryType) {
    return this.userService.findFormsByUser(userId, query);
  }

  @Get('answers')
  getAnswers(@GetUser('id') userId: number) {
    return this.userService.findAnswersByUser(userId);
  }

  @Get('answers/:id')
  getAnswerById(@GetUser('id') userId: number, @Param('id') answerId: string) {
    return this.userService.findUserAnswerById(userId, answerId);
  }
}
