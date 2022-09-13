import { Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { UsersService } from './users.service';
import { UserReq } from 'src/types';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getUser(@GetUser() user: UserReq) {
    return '';
  }

  @Patch()
  editUser(@GetUser() user: UserReq) {
    return 'edit user';
  }

  @Get('forms')
  getForms(@GetUser() user: UserReq) {
    return 'forms';
  }

  @Get('asnswers')
  getAsnAnswers(@GetUser() user: UserReq) {
    return 'answers';
  }

  @Get('asnswers/:id')
  getAsnAnswerById(@GetUser() user: UserReq) {
    return 'answers';
  }
}
