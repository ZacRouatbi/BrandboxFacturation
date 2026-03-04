import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body() dto: { username: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.login(
      dto.username,
      dto.password,
    );

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: 'lax',
    });

    return { message: 'Login successful' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req: Request) {
    return req.user;
  }
}