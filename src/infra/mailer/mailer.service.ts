import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import Mail, { Address } from 'nodemailer/lib/mailer';

type mailOptions = {
  from?: Address;
  recipients: Address[];
  subject: string;
  html: string;
  text?: string;
  placeholders?: Record<string, string>;
};

@Injectable()
export class MailerService {
  async sendMail(mailOptions: mailOptions) {
    const { from, recipients, subject, html, text } = mailOptions;

    const options: Mail.Options = {
      from: from ?? {
        name: process.env.MAIL_FROM_NAME,
        address: process.env.MAIL_FROM_ADDRESS,
      },
      to: recipients,
      subject,
      html,
      text,
    };

    try {
      return this.mailTransport().sendMail(options);
    } catch (error) {
      console.error('Error while sending email', error);
    }
  }

  private mailTransport() {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT),
      secure: false, // true for port 465, false for other ports
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    return transporter;
  }
}
