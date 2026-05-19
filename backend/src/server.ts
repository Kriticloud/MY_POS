import app from './app';
import { createServer } from 'http';
import { Server } from 'socket.io';

const PORT = process.env.PORT || 4001;

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

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
    console.log(`Client disconnected: ${socket.id}`);
  });
});

export { io };

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 WebSocket ready`);
});
