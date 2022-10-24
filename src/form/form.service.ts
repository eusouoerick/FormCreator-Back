import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryType } from 'src/types';
import { EditFormDto, FormDto } from './dto';

@Injectable()
export class FormService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: FormDto) {
    let formId: string;
    try {
      const form = await this.prisma.form.create({
        data: {
          createdBy: userId,
          title: dto.title,
          date: dto.date || null,
          average: dto.average || null,
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
            'Question error - "select" type question must have inputs',
          );
        }

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

    const form = await this.prisma.form.findUnique({
      where: {
        hash,
      },
      include: {
        questions: !!query.questions,
        users_answers: {
          include: {
            author: {
              select: {
                name: true,
                email: true,
              },
            },
            answers: true,
          },
        },
      },
    });

    if (!form) throw new NotFoundException('Form not found');

    let userBlocked = false;
    if (form.createdBy !== userId) {
      userBlocked = form.users_answers.some(
        (item) => item.createdBy === userId,
      );
    }

    if (!query.answers || (query.answers && form.createdBy !== userId)) {
      delete form.users_answers;
    }

    return { userBlocked, ...form };
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
}
