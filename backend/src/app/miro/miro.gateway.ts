import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';
import * as Y from 'yjs';
import { setPersistence, setupWSConnection } from 'y-websocket/bin/utils';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MiroGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    // You can set up persistence here if needed
    // For example, using y-leveldb
    // setPersistence({
    //   bindState: (docName, ydoc) => { ... },
    //   writeState: (docName, ydoc) => { ... },
    // });

    console.log('Miro WebSocket Gateway Initialized');
  }

  handleConnection(client: WebSocket, ...args: any[]) {
    // The room name will be the boardId, passed as a query parameter
    const url = new URL(args[0].url, 'http://localhost');
    const docName = url.searchParams.get('boardId');

    if (!docName) {
      client.close(1008, 'Board ID is required');
      return;
    }

    setupWSConnection(client, args[0], {
      docName,
    });
  }

  handleDisconnect(client: WebSocket) {
    console.log('Client disconnected');
  }
}
