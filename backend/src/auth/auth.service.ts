import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { TelegramAuthDataDto } from './dto/telegram-auth-data.dto';
import { TELEGRAM_BOT_TOKEN } from 'src/constants';
import { createHash, createHmac } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { LoginResponseDto } from './dto/login-response.dto';

const logger = new Logger('AuthService');

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  verifyAuthData({ hash, ...data }: TelegramAuthDataDto): boolean {
    if (!TELEGRAM_BOT_TOKEN) {
      throw new ServiceUnavailableException('token not configured');
    }

    if (!hash) {
      throw new BadRequestException('hash  is not set');
    }

    const secret = createHash('sha256').update(TELEGRAM_BOT_TOKEN).digest();
    const dataCheckString = Object.entries(data)
      .sort()
      .map(([name, value]) => `${name}=${value}`)
      .join('\n');
    const computedHash = createHmac('sha256', secret).update(dataCheckString).digest('hex');

    return hash === computedHash;
  }

  async login({ id, ...other }: TelegramAuthDataDto) {
    const payload = { sub: id, ...other };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async auth(data: TelegramAuthDataDto): Promise<LoginResponseDto> {
    if (!this.verifyAuthData(data)) {
      throw new ForbiddenException('hash check failed');
    }
    return this.login(data);
  }

  async verify(token: string): Promise<{ id: number } | null> {
    try {
      const { sub: id, ...other } = this.jwtService.verify(token, { ignoreExpiration: false });
      delete other.iat;
      delete other.exp;
      const user = { id, ...other };
      if (this.verifyAuthData(user)) {
        return user;
      }
      return null;
    } catch (e) {
      logger.error('Token verification error', e);
      return null;
    }
  }
}
