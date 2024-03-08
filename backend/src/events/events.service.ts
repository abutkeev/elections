import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';

const logger = new Logger('EventsService');

@Injectable()
export class EventsService {
  private static sockets: Record<number, { instanceId: string; socket: Socket }[]> = {};

  registerSocket(userId: number, instanceId: string, socket: Socket) {
    if (!EventsService.sockets[userId]) {
      EventsService.sockets[userId] = [];
    }
    EventsService.sockets[userId].push({ socket, instanceId });
  }

  unregisterSocket(userId: number, socket: Socket) {
    if (!EventsService.sockets[userId]) return;

    EventsService.sockets[userId] = EventsService.sockets[userId].filter(({ socket: { id } }) => socket.id !== id);
  }

  getConnected() {
    return Object.keys(EventsService.sockets).map(key => +key);
  }

  sendToUser({
    userId,
    skipInstance,
    message,
    args,
  }: {
    userId: number;
    skipInstance?: string;
    message: 'invalidate_tag';
    args?: unknown;
  }) {
    const userSockets = EventsService.sockets[userId];
    if (!userSockets) return;
    for (const { instanceId, socket } of userSockets) {
      if (instanceId === skipInstance) continue;
      logger.log(`Sending message ${message}(${JSON.stringify(args)}) to ${userId}(${instanceId})`);
      socket.emit(message, args);
    }
  }
}
