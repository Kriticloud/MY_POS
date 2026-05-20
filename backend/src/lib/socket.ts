import { Server } from 'socket.io';

// Shared socket instance - set by server.ts on startup
let io: Server | null = null;

export function setIO(instance: Server) {
  io = instance;
}

export function getIO(): Server | null {
  return io;
}
