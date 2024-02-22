import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JWT_SECRET } from 'src/constants';
import { AuthService } from '../auth.service';
import { TelegramAuthDataDto } from '../dto/telegram-auth-data.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET,
    });
  }

  async validate({ sub, ...other }: any): Promise<TelegramAuthDataDto> {
    const user = { id: sub, ...other };
    this.authService.verifyAuthData(user);
    return user;
  }
}
