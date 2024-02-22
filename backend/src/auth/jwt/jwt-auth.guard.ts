import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../public.decorator';

const logger = new Logger('JwtAuthGuard');

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    try {
      const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
      if (isPublic) {
        return true;
      }

      if (context.getType<string>() === 'telegraf') {
        return true;
      }

      const canActivate = await super.canActivate(context);

      if (typeof canActivate === 'boolean') return canActivate;

      logger.error('canActivate returned unsupported value');
      return false;
    } catch (e) {
      logger.error('got exception in jwt auth guard', e, context.getType());
      return false;
    }
  }
}
