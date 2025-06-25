import { Server } from 'socket.io';

let io: Server;

export const setIOInstance = (ioInstance: Server) => {
  io = ioInstance;
};

export const getIO = () => {
  if (!io) throw new Error('Socket.IO not initialized');
  return io;
};
