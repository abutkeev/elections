import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import { ApiOperation } from '@nestjs/swagger';
import { TelegramAuthDataDto } from './dto/telegram-auth-data.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({ description: 'Authorize user by telegram' })
  async login(@Body() data: TelegramAuthDataDto): Promise<LoginResponseDto> {
    return await this.authService.auth(data);
  }
}
