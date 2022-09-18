import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditFormDto, FormDto } from './dto';
import { QueryType } from 'src/types';
import { AnswerDto } from './dto/answer.dto';

@Injectable()
export class FormService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: FormDto) {
    let formId: number;
    try {
      const form = await this.prisma.form.create({
        data: {
          createdBy: userId,
          title: dto.title,
          date: dto.date || null,
        },
      });

      formId = form.id;

      const addFormId = dto.questions.map((question) => {
        // bloqueia questões de selecionar sem as opções
        if (
          question.type === 'select' &&
          (!question.inputs || !question.inputs.length)
        ) {
          throw new Error(
            'Question error -  "select" type question must have inputs',
          );
        }

        // passa o id do formulário
        return { formId: form.id, ...question };
      });

      // create questions
      await this.prisma.question.createMany({ data: addFormId });

      const hash = new Date().getTime() + '' + Math.floor(Math.random() * 5);
      const value = dto.questions.reduce((pv, cv) => cv.value + pv, 0);

      await this.prisma.form.update({
        where: {
          id: form.id,
        },
        data: {
          hash,
          value,
          questions_length: dto.questions.length,
        },
        include: {
          questions: true,
        },
      });

      return { formId: form.id, hash };
      //
    } catch (error) {
      if (formId) {
        await this.prisma.form.delete({ where: { id: formId } });
      }

      throw new BadRequestException(error.message);
    }
  }

  async getFormByHash(hash: string, query: QueryType, userId: number) {
    try {
      const form = await this.prisma.form.findUniqueOrThrow({
        where: {
          hash,
        },
        include: {
          questions: true,
          users_answers: true,
        },
      });

      if (!query.questions) delete form.questions;

      if (!query.answers || (query.answers && form.createdBy !== userId)) {
        delete form.users_answers;
      }

      return form;
      //
    } catch (error) {
      throw new NotFoundException(error.message || 'Form not found');
    }
  }

  async updateForm(hash: string, dto: EditFormDto, userId: number) {
    const form = await this.prisma.form.findFirst({
      where: {
        hash,
      },
    });

    if (!form) throw new NotFoundException('Form not found');

    if (form.createdBy !== userId) {
      throw new ForbiddenException('User not authorized');
    }

    const updateForm = await this.prisma.form.update({
      where: { id: form.id, hash },
      data: { ...dto },
    });

    return updateForm;
  }

  async deleteForm(hash: string, userId: number) {
    const form = await this.prisma.form.findFirst({
      where: {
        hash,
      },
    });

    if (!form) throw new NotFoundException('Form not found');

    if (form.createdBy !== userId) {
      throw new ForbiddenException('User not authorized');
    }

    await this.prisma.form.delete({
      where: {
        id: form.id,
      },
    });

    return { formId: form.id, success: true };
  }

  async getAnswers(hash: string, userId: number) {
    const form = await this.prisma.form.findFirst({
      where: {
        hash,
      },
      select: {
        id: true,
        createdBy: true,
        answers_length: true,
        users_answers: {
          include: {
            answers: true,
          },
        },
      },
    });

    if (!form) throw new NotFoundException('Form not found');

    if (form.createdBy !== userId) {
      throw new ForbiddenException('User not authorized');
    }

    delete form.createdBy;
    return form;
  }

  async createAnswer(hash: string, dto: AnswerDto, userId: number) {
    const form = await this.prisma.form.findFirst({
      where: {
        hash,
      },
    });

    if (!form) throw new NotFoundException('Form not found');

    const checkUser = await this.prisma.user_Answer.findFirst({
      where: {
        createdBy: userId,
      },
    });

    if (checkUser) {
      throw new ForbiddenException(
        'The user has already responded to the form',
      );
    }

    const { id: answerId } = await this.prisma.user_Answer.create({
      data: {
        createdBy: userId,
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

    return {
      formId: form.id,
      answerId,
      count,
      success: true,
    };
  }
}
