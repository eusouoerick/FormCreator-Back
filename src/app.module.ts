import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { FormModule } from './form/form.module';
import { AnswerModule } from './answer/answer.module';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        // REDIS_HOST: Joi.string().required(),
        // REDIS_PORT: Joi.number().required(),
      }),
    }),
    AuthModule,
    PrismaModule,
    FormModule,
    UserModule,
    AnswerModule,
  ],
})
export class AppModule {}
