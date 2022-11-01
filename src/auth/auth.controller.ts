// prettier-ignore
import { BadRequestException, Body, Controller, HttpCode, Post, Query } from '@nestjs/common';
// prettier-ignore
import { ChangePasswordDto, ForgotPasswordDto, SigninDto, SignupDto } from './dto';
import { AuthService } from './auth.service';
import { GetUser } from './decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  signin(@Body() dto: SigninDto) {
    return this.authService.signin(dto);
  }

  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Post('forgot-password')
  @HttpCode(200)
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.authService.forgotPassword(dto);
    return { statusCode: 200, message: 'Success' };
  }

  @Post('change-password')
  changePassword(
    @Query('token') token: string,
    @Body() dto: ChangePasswordDto,
  ) {
    if (!token) throw new BadRequestException('Token must be passed');
    return this.authService.changePassword(token, dto);
  }
}
