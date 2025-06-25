import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import cookie from 'cookie';
import { validateToken } from '../services/authService';
import { setIOInstance } from './ioInstance';
setIOInstance(io);

export const initSocketServer = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:3000', // frontend origin
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const cookies = socket.handshake.headers.cookie;
      if (!cookies) return next(new Error('Unauthorized'));

      const parsed = cookie.parse(cookies);
      const token = parsed.token;

      if (!token) return next(new Error('Unauthorized'));

      const decoded = validateToken(token);
      socket.data.user = decoded;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    const user = socket.data.user;
    console.log(`🔌 User connected: ${user.email}`);

    // Join a room
    socket.on('joinRoom', (roomId: string) => {
      socket.join(roomId);
      console.log(`User ${user.email} joined room: ${roomId}`);
    });

    // Handle message send
    socket.on('sendMessage', ({ roomId, message }) => {
      io.to(roomId).emit('newMessage', {
        user: user.email,
        message,
      });
    });

    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${user.email}`);
    });
  });

  return io;
};
function io(io: any) {
    throw new Error('Function not implemented.');
}

