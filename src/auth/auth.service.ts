// prettier-ignore
import { ForbiddenException, Injectable, NotFoundException, } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as argon from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
// prettier-ignore
import { ChangePasswordDto, ForgotPasswordDto, SigninDto, SignupDto } from './dto';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private emailService: EmailService,
    private jwt: JwtService,
    private prisma: PrismaService,
  ) {}

  async signin(dto: SigninDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
      select: {
        id: true,
        password: true,
      },
    });

    if (!user) throw new NotFoundException('Invalid credentials');

    const hash = await argon.verify(user.password, dto.password);
    if (!hash) throw new ForbiddenException('Invalid credentials');

    const token = await this.createToken(user.id);
    return { token };
  }

  async signup(dto: SignupDto) {
    try {
      const hash = await argon.hash(dto.password);
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          name: dto.name,
          password: hash,
        },
      });

      const token = await this.createToken(user.id);
      await this.emailService.welcome({ email: user.email, name: user.name });
      return { token };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('Credentials taken');
        }
      }
      throw error;
    }
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) return;
    console.log(user);
    const { id, name, email } = user;
    const token = await this.jwt.signAsync(
      { userId: id },
      { secret: process.env.JWT_SECRET, expiresIn: '1h' },
    );
    await this.emailService.forgotPassword({ name, email, token });
    return;
  }

  async changePassword(token: string, dto: ChangePasswordDto) {
    try {
      const { userId } = this.jwt.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      const password = await argon.hash(dto.password);
      await this.prisma.user.update({
        where: { id: userId },
        data: { password },
      });
      return { statusCode: 202, message: 'Success' };
    } catch (error) {
      throw new BadRequestException('Something went wrong... Try again');
    }
  }

  async createToken(userId: number) {
    const payload = { userId: userId };
    const secret = process.env.JWT_SECRET;
    return await this.jwt.signAsync(payload, { secret });
  }
}
