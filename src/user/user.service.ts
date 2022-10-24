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
    const checkUser = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!checkUser) throw new NotFoundException('User not found');

    delete dto.image;

    if (dto.currentPassword) {
      const checkPass = await argon.verify(
        checkUser.password,
        dto.currentPassword,
      );
      if (checkPass) throw new ForbiddenException('Invalid credential');
      delete dto.currentPassword;
    }

    const data = {};
    for (const key in dto) {
      if (key === 'newPassword') {
        if (dto.newPassword) {
          data['password'] = await argon.hash(dto.newPassword);
        }
        delete dto.newPassword;
      } else if (dto[key]) {
        data[key] = dto[key];
      }
    }

    return await this.prisma.user.update({
      where: {
        id: userId,
      },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        adm: true,
        createdAt: true,
        updateAt: true,
      },
    });
  }

  async findFormsByUser(userId: number, query: QueryType) {
    let forms = await this.prisma.form.findMany({
      where: {
        createdBy: userId,
      },
      include: {
        questions: query.questions ? true : false,
        users_answers: query.answers ? { include: { answers: true } } : false,
      },
    });

    const limit = query.limit;
    const skip = ((+query.page || 1) - 1) * limit;
    forms = forms.reverse().slice(skip).slice(0, limit);
    return { forms };
  }

  async findAnswersByUser(userId: number, query: QueryType) {
    let answers = await this.prisma.user_Answer.findMany({
      where: {
        createdBy: userId,
      },
      include: {
        answers: true,
      },
    });
    const limit = query.limit;
    const skip = ((+query.page || 1) - 1) * limit;
    answers = answers.reverse().slice(skip).slice(0, limit);
    return { answers };
  }

  async findUserAnswerById(userId: number, answerId: string) {
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
