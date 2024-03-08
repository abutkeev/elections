import { Logger, UsePipes } from '@nestjs/common';
import { WebSocketGateway } from '@nestjs/websockets';
import { AuthService } from 'src/auth/auth.service';
import { EventsService } from './events.service';
import { EventsAuthValidationPipe, SocketWithUser } from './events-auth-validation.pipe';

const logger = new Logger('EventsGateway');

@UsePipes(new EventsAuthValidationPipe())
@WebSocketGateway({ namespace: 'api/events' })
export class EventsGateway {
  constructor(
    private authService: AuthService,
    private eventsService: EventsService
  ) {}

  handleDisconnect(client: SocketWithUser) {
    if (client.user) {
      logger.log(`Client disconnected: id ${client.id}, user ${client.user.id}`);
      this.eventsService.unregisterSocket(client.user.id, client);
      return;
    }
    logger.log(`Client disconnected: ${client.id}`);
  }

  async handleConnection(client: SocketWithUser) {
    const { token, instanceId } = client.handshake.auth;
    if (!token || !instanceId) {
      logger.error(`No token or instanceId for ${client.id}`);
      client.disconnect();
      return;
    }

    const user = await this.authService.verify(token);
    if (!user) {
      logger.error(`Token validation failed for ${client.id}`);
      client.disconnect();
      return;
    }
    logger.log(`Client connected: id ${client.id}, user ${user.id}, instance ${instanceId}`);
    client.user = user;
    client.instanceId = instanceId;
    this.eventsService.registerSocket(user.id, instanceId, client);
  }
}
