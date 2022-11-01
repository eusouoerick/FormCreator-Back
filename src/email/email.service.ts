import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { TypesNewAnswer } from './dto';
import type { Queue } from 'bull';

@Injectable()
export class EmailService {
  constructor(@InjectQueue('email') private emailQueue: Queue) {}

  async welcome(emailDto: { name: string; email: string }) {
    return await this.emailQueue.add('welcome', emailDto);
  }

  async newAnswer(emailDto: TypesNewAnswer) {
    return await this.emailQueue.add('new-answer', emailDto);
  }

  async forgotPassword(emailDto: {
    name: string;
    email: string;
    token: string;
  }) {
    return await this.emailQueue.add('forgot-password', emailDto);
  }
}
