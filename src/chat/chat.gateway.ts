import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Body, Logger, Req, UseGuards } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { AuthenticationGuard } from '../auth/jwt-auth.guard';
import { MessageService } from './message.service';

@WebSocketGateway({
  cors: '*',
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private messageService: MessageService) {}
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChatGateway');

  @SubscribeMessage('msgToServer')
  @UseGuards(AuthenticationGuard)
  async handleMessage(
    client: Socket,
    payload: any,
    @Req() request: any,
    @Body() { message, chatId }: { message: string; chatId: string },
  ) {
    const { id } = request.user;

    console.log('Incomming payload', payload);
    console.log('Incomming message', message);
    console.log('Incomming chatId', chatId);

    const savedMessage = await this.messageService.createMessage(
      message,
      id,
      chatId,
    );

    this.server.emit('msgToClient', savedMessage);
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log('---new user connected----');
    this.logger.log(`--------Client connected: ${client.id}`);
    this.server.emit('users', []);
    return [];
  }
}
