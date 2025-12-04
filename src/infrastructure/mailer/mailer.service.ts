import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Address } from 'nodemailer/lib/mailer';
import * as hbs from 'nodemailer-express-handlebars';

type mailOptions = {
  from?: Address;
  recipients: Address[];
  subject: string;
  template: string;
  context?: Record<string, string>;
};

@Injectable()
export class MailerService {
  async sendMail(mailOptions: mailOptions) {
    const { from, recipients, subject, template, context } = mailOptions;

    const options = {
      from: from ?? {
        name: process.env.MAIL_FROM_NAME,
        address: process.env.MAIL_FROM_ADDRESS,
      },
      to: recipients,
      subject,
      template,
      context,
    };

    try {
      return this.mailTransport().sendMail(options);
    } catch (error) {
      Logger.error('Error while sending email', error, MailerService.name);
      throw error;
    }
  }

  private mailTransport() {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT),
      secure: process.env.MAIL_SECURE.toLowerCase() === 'true',
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    transporter.use(
      'compile',
      hbs({
        viewEngine: { defaultLayout: '' },
        viewPath: 'src/infrastructure/mailer/templates',
        extName: '.hbs',
      }),
    );

    return transporter;
  }
}
