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
    return await this.userService.findUser(userId, query);
  }

  @Patch()
  async editUser(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
    return await this.userService.findUserAndUpdate(userId, dto);
  }

  @Get('forms')
  getForms(@GetUser('id') userId: number, @Query() query: QueryType) {
    return this.userService.findFormsByUser(userId, query);
  }

  @Get('answers')
  getAnswers(@GetUser('id') userId: number, @Query() query: QueryType) {
    return this.userService.findAnswersByUser(userId, query);
  }

  @Get('answers/:id')
  getAnswerById(@GetUser('id') userId: number, @Param('id') answerId: string) {
    return this.userService.findUserAnswerById(userId, answerId);
  }
}
