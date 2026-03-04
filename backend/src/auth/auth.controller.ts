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
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
 @Throttle({
  default: {
    limit: 5,
    ttl: 60000,
  },
})
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
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    return { message: 'Login successful' };
  }
  @Post('logout')
logout(@Res({ passthrough: true }) res: Response) {
  res.clearCookie('access_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000, // 15 minutes
    path: '/', // MUST match login
  });

  return { message: 'Logout successful' };
}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req: Request) {
    return req.user;
  }
}