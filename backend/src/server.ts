import app from './app';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { setIO } from './lib/socket';
import logger from './lib/logger';
import { validateEnv } from './lib/validateEnv';
import { setupDeviceSocket } from './modules/devices/device.routes';

validateEnv();

const PORT = process.env.PORT || 4001;

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

setIO(io);

// Device sync socket events
setupDeviceSocket(io);

io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);

  socket.on('join-branch', (branchId: string) => {
    socket.join(`branch:${branchId}`);
  });

  socket.on('order-update', (data) => {
    io.to(`branch:${data.branchId}`).emit('order-updated', data);
  });

  socket.on('kitchen-update', (data) => {
    io.to(`branch:${data.branchId}`).emit('kitchen-updated', data);
  });

  socket.on('table-update', (data) => {
    io.to(`branch:${data.branchId}`).emit('table-updated', data);
  });

  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

httpServer.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`📡 WebSocket ready`);
});
