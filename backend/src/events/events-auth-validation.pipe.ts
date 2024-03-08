import { PipeTransform, Injectable, Logger } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

export type SocketWithUser = Socket & { user?: { id: number }; instanceId?: string };

const logger = new Logger('AuthValidationPipe');

@Injectable()
export class EventsAuthValidationPipe implements PipeTransform {
  async transform(value: any) {
    try {
      if (value instanceof Socket) {
        if (!('user' in value) || !('instanceId' in value)) {
          throw new WsException('No user or instance id for socket');
        }

        if (typeof value.instanceId !== 'string') {
          throw new WsException('Instance id is not string');
        }

        if (typeof value.user !== 'object' || !('id' in value.user) || typeof value.user.id !== 'number') {
          throw new WsException('User validation failed');
        }
        return value as SocketWithUser;
      }
      return value;
    } catch (e) {
      if (e instanceof Error) {
        logger.error(e.message);
      }
      throw e;
    }
  }
}
