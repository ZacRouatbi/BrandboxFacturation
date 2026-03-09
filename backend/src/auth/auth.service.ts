import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '../mailer/mailer.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private prisma:        PrismaService,
    private jwtService:    JwtService,
    private mailerService: MailerService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  async login(username: string, password: string) {
    const user    = await this.validateUser(username, password);
    const payload = { sub: user.id, username: user.username };
    return this.jwtService.sign(payload);
  }

  async forgotPassword(username: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { username } });

    // Always return silently — never reveal if username exists
    if (!user) return;

    // Generate a secure random token
    const token  = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Save token to user
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken:       token,
        resetTokenExpiry: expiry,
      },
    });

    // Build reset URL and send email
    const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3001';
    const resetUrl    = `${frontendUrl}/reset-password?token=${token}`;

    await this.mailerService.sendResetLink(user.username, resetUrl);
  }

  async resetPassword(token: string): Promise<string> {
    // Find user by token
    const user = await this.prisma.user.findFirst({
      where: { resetToken: token },
    });

    if (!user) {
      throw new BadRequestException('Lien invalide ou expiré.');
    }

    // Check expiry
    if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      throw new BadRequestException('Ce lien a expiré. Veuillez en demander un nouveau.');
    }

    // Generate new password
    const chars       = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    const newPassword = Array.from(
      { length: 10 },
      () => chars[Math.floor(Math.random() * chars.length)]
    ).join('');

    const hashed = await bcrypt.hash(newPassword, 10);

    // Update password and clear token
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password:         hashed,
        resetToken:       null,
        resetTokenExpiry: null,
      },
    });

    return newPassword;
  }
}