import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryType } from 'src/types';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findUser(userId: number, query: QueryType) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        forms: query.forms ? true : false,
        user_answers: query.answers ? { include: { answers: true } } : false,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    delete user.password;
    return user;
  }

  async findUserAndUpdate(userId: number, dto: EditUserDto) {
    const cehckUser = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!cehckUser) throw new NotFoundException('User not found');

    if (dto.password) {
      dto.password = await argon.hash(dto.password);
    }

    return await this.prisma.user.update({
      where: {
        id: userId,
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

  async findFormsByUser(userId: number, query) {
    const forms = await this.prisma.form.findMany({
      where: {
        createdBy: userId,
      },
      include: {
        questions: query.questions ? true : false,
        users_answers: query.answers ? { include: { answers: true } } : false,
      },
    });
    return { forms: [...forms] };
  }

  async findAnswersByUser(userId: number) {
    const answers = await this.prisma.user_Answer.findMany({
      where: {
        createdBy: userId,
      },
      include: {
        answers: true,
      },
    });
    return { answers };
  }

  async findUserAnswerById(userId: number, answerId: number) {
    const answer = await this.prisma.user_Answer.findUnique({
      where: {
        id: answerId,
      },
      include: {
        answers: true,
      },
    });
    if (!answer) throw new NotFoundException('Answer not found');
    if (answer.createdBy !== userId) {
      throw new ForbiddenException('User not authorized');
    }
    return answer;
  }
}
