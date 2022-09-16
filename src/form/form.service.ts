import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { FormDto } from './dto';

@Injectable()
export class FormService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async create(userId: number, dto: FormDto) {
    try {
      const form = await this.prisma.form.create({
        data: {
          createdBy: userId,
          title: dto.title,
          date: dto.date || null,
        },
      });

      const addFormId = dto.questions.map((question) => {
        return { formId: form.id, ...question };
      });

      await this.prisma.question.createMany({
        data: addFormId,
      });

      const token = await this.jwt.signAsync(
        { id: form.id, createdBy: userId },
        { secret: this.config.get('JWT_SECRET') },
      );

      const value = dto.questions.reduce((pv, cv) => cv.value + pv, 0);

      await this.prisma.form.update({
        where: {
          id: form.id,
        },
        data: {
          token,
          value,
          questions_length: dto.questions.length,
        },
        include: {
          questions: true,
        },
      });

      return { formId: form.id, token };
      //
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
