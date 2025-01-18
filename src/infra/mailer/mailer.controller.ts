import { Controller, Get } from '@nestjs/common';

import { MailerService } from './mailer.service';

@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Get()
  async handle() {
    return await this.mailerService.sendMail({
      html: '<h1>Hello World</h1>',
      recipients: [{ address: 'test@email.com', name: 'Test' }],
      subject: 'Email Test',
    });
  }
}
