import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { isAfter, isToday } from 'date-fns';
import { EmailService } from 'src/email/email.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryType } from 'src/types';
import { AnswerDto, CheckAnswersDto } from './dto';

@Injectable()
export class AnswerService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async getAnswers(hash: string, userId: number, query: QueryType) {
    const form = await this.prisma.form.findFirst({
      where: {
        hash,
      },
      select: {
        id: true,
        createdBy: true,
        answers_length: true,
        questions_length: true,
        corrected_length: true,
        average: true,
        value: true,
        users_answers: {
          include: {
            author: {
              select: {
                name: true,
                email: true,
              },
            },
            answers: {
              include: {
                question: {
                  select: {
                    title: true,
                    type: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!form) throw new NotFoundException('Form not found');

    if (form.createdBy !== userId) {
      throw new ForbiddenException('User not authorized');
    }

    const limit = query.limit;
    const skip = ((+query.page || 1) - 1) * limit;
    form.users_answers = form.users_answers
      .reverse()
      .slice(skip)
      .slice(0, limit);
    return form;
  }

  async createAnswer(hash: string, dto: AnswerDto, userReq: User) {
    const form = await this.prisma.form.findFirst({
      where: { hash },
      include: {
        author: true,
        users_answers: {
          select: {
            createdBy: true,
          },
        },
      },
    });

    if (!form) throw new NotFoundException('Form not found');

    if (form.date) {
      if (isAfter(new Date(), form.date) && !isToday(form.date)) {
        throw new ForbiddenException(
          'This form is no longer receiving responses',
        );
      }
    }

    const checkUser = form.users_answers.some(
      (item) => item.createdBy === userReq.id,
    );

    if (checkUser) {
      throw new ForbiddenException(
        'The user has already responded to the form',
      );
    }

    const { id: answerId } = await this.prisma.user_Answer.create({
      data: {
        createdBy: userReq.id,
        formId: form.id,
      },
    });

    const data = dto.answers.map((item) => ({
      user_answerId: answerId,
      ...item,
    }));

    const { count } = await this.prisma.answer.createMany({
      data,
    });

    await this.prisma.form.update({
      where: { id: form.id },
      data: { answers_length: { increment: 1 } },
    });

    if (userReq.id !== form.createdBy && form.author.notify) {
      await this.emailService.newAnswer({
        from: userReq.name,
        form: { title: form.title, hash: form.hash },
        to: { name: form.author.name, email: form.author.email },
      });
    }

    return {
      formId: form.id,
      answerId,
      count,
      success: true,
    };
  }

  async updateAnswer(hash: string, dto: CheckAnswersDto, userId: number) {
    // vai buscar as questões do formulário
    const { questions, createdBy } = await this.prisma.form.findFirst({
      where: {
        hash,
      },
      select: {
        createdBy: true,
        questions: {
          select: {
            id: true,
            value: true,
          },
        },
      },
    });

    if (createdBy !== userId) {
      throw new ForbiddenException('User not authorized');
    }

    const checkAnswer = await this.prisma.user_Answer.findUnique({
      where: {
        id: dto.user_answerId,
      },
    });

    await Promise.all(
      dto.answers.map(async (item) => {
        return await this.prisma.answer.update({
          where: {
            id: item.id,
          },
          data: {
            isCorrect: item.isCorrect,
          },
        });
      }),
    );

    const value = questions.reduce((pv, cv) => {
      const answer = dto.answers.find((item) => item.questionId === cv.id);
      if (answer && answer.isCorrect) {
        return pv + cv.value;
      }
      return pv;
    }, 0);

    await this.prisma.user_Answer.update({
      where: {
        id: dto.user_answerId,
      },
      data: {
        value,
        form: {
          update: {
            corrected_length: {
              increment: checkAnswer.value === null ? 1 : 0,
            },
          },
        },
      },
    });

    return {
      user_answerId: dto.user_answerId,
      value,
      increment: checkAnswer.value === null,
      success: true,
    };
  }
}
