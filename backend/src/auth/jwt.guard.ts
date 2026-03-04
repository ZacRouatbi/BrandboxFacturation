import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private jwtService: JwtService) {
    super();
  }

  handleRequest(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
  ) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    const response = context.switchToHttp().getResponse();

    const payload = {
      sub: user.userId,
      username: user.username,
    };

    const newToken = this.jwtService.sign(payload);

   response.cookie('access_token', newToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 15 * 60 * 1000,
});

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return user;
  }
}