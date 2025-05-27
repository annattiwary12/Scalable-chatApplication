import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { PrismaClient } from '@prisma/client';
import { produceMessage } from './kafka';
import 'dotenv/config';

class SocketService {
  private _io: Server;
  private prisma = new PrismaClient();

  constructor(httpServer: import('http').Server | import('https').Server) {
    this._io = new Server(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
      throw new Error('REDIS_URL not defined in environment variables');
    }

    const pubClient = createClient({ url: redisUrl });
    const subClient = pubClient.duplicate();

    Promise.all([pubClient.connect(), subClient.connect()])
      .then(() => {
        this._io.adapter(createAdapter(pubClient, subClient)as any); //  Fixed
        console.log(' Socket.IO is using Redis adapter');
      })
      .catch((err) => {
        console.error('Redis connection failed:', err);
      });
  }

  public initListeners() {
    this._io.on('connection', (socket) => {
      console.log('⚡ New socket connected:', socket.id);

      socket.on('event:message', async ({ message }: { message: string }) => {
        console.log(' New message received:', message);

        try {
          await this.prisma.message.create({
            data: {
              text: message,
            },
          });
          console.log(' Message saved to DB');
        } catch (err) {
          console.error(' Failed to save message to DB:', err);
        }

        this._io.emit('event:message', {
          message,
          from: socket.id,
        });

        try {
          await produceMessage(message);
          console.log(' Message sent to Kafka');
        } catch (err) {
          console.error(' Failed to send message to Kafka:', err);
        }
      });
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
