import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { resetPasswordTemplate } from './mail.template';

@Injectable()
export class MailerService {
  private transporter = nodemailer.createTransport({
    host:   'ssl0.ovh.net',
    port:   587,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  async sendResetLink(to: string, resetUrl: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from:    process.env.MAIL_FROM ?? `Brandbox <${process.env.MAIL_USER}>`,
        to,
        subject: 'Réinitialisation de votre mot de passe — Brandbox',
        html:    resetPasswordTemplate(to, resetUrl),
      });
      
    } catch (err) {
      console.error('Mailer error:', err);
      throw new InternalServerErrorException(
        "Erreur lors de l'envoi de l'e-mail. Veuillez réessayer."
      );
    }
  }
}