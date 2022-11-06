import { MailerService } from '@nestjs-modules/mailer';
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { TypesNewAnswer } from './dto';
import { EmailWelcome, EmailNewAnswer, EmailForgotPassword } from './views';

@Processor('email')
export class EmailProcessor {
  constructor(private mailService: MailerService) {}

  @Process('welcome')
  async welcomeQueue({ data }: Job<{ name: string; email: string }>) {
    try {
      await this.mailService.sendMail({
        to: data.email,
        from: 'Form Creator <erick.formcreator@gmail.com>',
        subject: `🎉 Welcome to Form Creator`,
        text: 'Welcome to Form Creator! Create your forms in a simple and easy way',
        html: EmailWelcome(data.name),
      });
    } catch (error) {
      console.log('Failed to send email to:', data.email);
    }
    return {};
  }

  @Process('new-answer')
  async newAnswer({ data }: Job<TypesNewAnswer>) {
    try {
      await this.mailService.sendMail({
        to: data.to.email,
        from: 'Form Creator <erick.formcreator@gmail.com>',
        subject: `Your form has a new answer`,
        text: `${data.from} replied to your form`,
        html: EmailNewAnswer(data),
      });
    } catch (error) {
      console.log('Failed to send email to:', data.to.email);
    }
    return {};
  }

  @Process('forgot-password')
  async forgotPassword({
    data,
  }: Job<{
    name: string;
    email: string;
    token: string;
  }>) {
    try {
      await this.mailService.sendMail({
        to: data.email,
        from: 'Form Creator <erick.formcreator@gmail.com>',
        subject: `Password reset request`,
        text: `We received a request to reset your account password`,
        html: EmailForgotPassword(data.name, data.token),
      });
    } catch (error) {
      console.error(error);
      console.log('Failed to send email to:', data.email);
    }
    return {};
  }
}
