import { Injectable, NotFoundException } from '@nestjs/common';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserReq } from 'src/types';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findUser(userReq: UserReq) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userReq.id,
      },
      include: {
        forms: true,
        user_answers: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    delete user.password;
    return user;
  }

  async findUserAndUpdate(userReq: UserReq, dto: EditUserDto) {
    const cehckUser = await this.prisma.user.findUnique({
      where: {
        id: userReq.id,
      },
    });

    if (!cehckUser) throw new NotFoundException('User not found');

    if (dto.password) {
      dto.password = await argon.hash(dto.password);
    }

    return await this.prisma.user.update({
      where: {
        id: userReq.id,
      },
      data: {
        ...dto,
      },
      select: {
        email: true,
        name: true,
      },
    });
  }

  async findFormsByUser(userId: number) {
    const forms = await this.prisma.form.findMany({
      where: {
        createdBy: userId,
      },
    });
    return { forms };
  }

  async findAnswersByUser(userId: number) {
    const answers = await this.prisma.user_Answer.findMany({
      where: {
        createdBy: userId,
      },
    });
    return { answers };
  }

  async findUserAnswerById(userId: number, answerId: number) {
    const answer = await this.prisma.user_Answer.findMany({
      where: {
        createdBy: userId,
        id: answerId,
      },
    })[0];
    if (!answer) throw new NotFoundException('Answer not found');
    return { answer };
  }
}
