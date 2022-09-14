import { Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { UserService } from './user.service';
import { UserReq } from 'src/types';
import { Body } from '@nestjs/common';
import { EditUserDto } from './dto';
import { Param } from '@nestjs/common';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getUser(@GetUser() user: UserReq) {
    const data = await this.userService.findUser(user);
    return { user: data };
  }

  @Patch()
  async editUser(@GetUser() user: UserReq, @Body() dto: EditUserDto) {
    const data = await this.userService.findUserAndUpdate(user, dto);
    return { user: data };
  }

  @Get('forms')
  getForms(@GetUser() user: UserReq) {
    return this.userService.findFormsByUser(user.id);
  }

  @Get('answers')
  getAnswers(@GetUser() user: UserReq) {
    return this.userService.findAnswersByUser(user.id);
  }

  @Get('answers/:id')
  getAnswerById(@GetUser() user: UserReq, @Param('id') answerId: number) {
    return this.userService.findUserAnswerById(user.id, +answerId);
  }
}
