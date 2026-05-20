import { Router, Response, NextFunction } from 'express';
import { authenticate, AuthRequest } from '../../middleware/auth';
import { getIO } from '../../lib/socket';
import logger from '../../lib/logger';
import os from 'os';

const router = Router();

// ─── In-memory connected devices store ───

interface ConnectedDevice {
  id: string;
  name: string;
  ipAddress: string;
  role: 'master' | 'client';
  status: 'online' | 'offline';
  lastSeen: Date;
  socketId: string;
  user?: string;
  deviceType?: string;
}

const connectedDevices = new Map<string, ConnectedDevice>();

// ─── Helpers ───

function getLocalIPs(): string[] {
  const interfaces = os.networkInterfaces();
  const ips: string[] = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        ips.push(iface.address);
      }
    }
  }
  return ips;
}

function getDevicesList() {
  return Array.from(connectedDevices.values()).map(d => ({
    id: d.id,
    name: d.name,
    ipAddress: d.ipAddress,
    role: d.role,
    status: d.status,
    lastSeen: d.lastSeen,
    user: d.user,
    deviceType: d.deviceType,
  }));
}

// ─── Public Routes ───

// GET /api/devices/info — Get this device's network info (master IP)
router.get('/info', (_req, res: Response) => {
  const ips = getLocalIPs();
  res.json({
    success: true,
    data: {
      hostname: os.hostname(),
      ips,
      masterIp: ips[0] || 'localhost',
      port: process.env.PORT || 4000,
      connectedCount: connectedDevices.size,
    },
  });
});

// Protected routes
router.use(authenticate);

// GET /api/devices — List all connected devices (master view)
router.get('/', (req: AuthRequest, res: Response) => {
  res.json({ success: true, data: getDevicesList() });
});

// POST /api/devices/register — Register a new device (called by client tablets)
router.post('/register', (req: AuthRequest, res: Response) => {
  const { deviceName, deviceType, socketId } = req.body;
  const ip = req.ip || req.socket.remoteAddress || 'unknown';

  const deviceId = `dev_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const device: ConnectedDevice = {
    id: deviceId,
    name: deviceName || `Device-${connectedDevices.size + 1}`,
    ipAddress: ip.replace('::ffff:', ''),
    role: 'client',
    status: 'online',
    lastSeen: new Date(),
    socketId: socketId || '',
    user: req.user ? `${req.user.firstName} ${req.user.lastName}` : undefined,
    deviceType: deviceType || 'tablet',
  };

  connectedDevices.set(deviceId, device);
  logger.info(`Device registered: ${device.name} (${device.ipAddress})`);

  // Notify master of new device
  const io = getIO();
  if (io) {
    io.emit('device-connected', device);
  }

  res.json({ success: true, data: { deviceId, masterIp: getLocalIPs()[0], message: 'Device registered successfully' } });
});

// POST /api/devices/heartbeat — Keep device alive
router.post('/heartbeat', (req: AuthRequest, res: Response) => {
  const { deviceId } = req.body;
  const device = connectedDevices.get(deviceId);
  if (device) {
    device.lastSeen = new Date();
    device.status = 'online';
    connectedDevices.set(deviceId, device);
  }
  res.json({ success: true });
});

// DELETE /api/devices/:id — Remove a device (master action)
router.delete('/:id', (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const device = connectedDevices.get(id);
  if (device) {
    connectedDevices.delete(id);
    logger.info(`Device removed: ${device.name}`);
    const io = getIO();
    if (io) {
      io.emit('device-disconnected', { id, name: device.name });
    }
  }
  res.json({ success: true, data: { message: 'Device removed' } });
});

// POST /api/devices/disconnect — Device self-disconnects
router.post('/disconnect', (req: AuthRequest, res: Response) => {
  const { deviceId } = req.body;
  const device = connectedDevices.get(deviceId);
  if (device) {
    device.status = 'offline';
    connectedDevices.set(deviceId, device);
    const io = getIO();
    if (io) {
      io.emit('device-disconnected', { id: deviceId, name: device.name });
    }
  }
  res.json({ success: true });
});

// ─── Socket.io device management (called from server.ts) ───

export function setupDeviceSocket(io: any) {
  io.on('connection', (socket: any) => {
    // Device joins with its ID
    socket.on('device-join', (data: { deviceId: string; deviceName: string; deviceType: string }) => {
      const ip = socket.handshake.address?.replace('::ffff:', '') || 'unknown';
      const existing = connectedDevices.get(data.deviceId);
      if (existing) {
        existing.socketId = socket.id;
        existing.status = 'online';
        existing.lastSeen = new Date();
        connectedDevices.set(data.deviceId, existing);
      } else {
        const device: ConnectedDevice = {
          id: data.deviceId || `dev_${Date.now()}`,
          name: data.deviceName || 'Unknown Device',
          ipAddress: ip,
          role: 'client',
          status: 'online',
          lastSeen: new Date(),
          socketId: socket.id,
          deviceType: data.deviceType || 'tablet',
        };
        connectedDevices.set(device.id, device);
      }
      io.emit('devices-updated', getDevicesList());
    });

    // Sync order to all devices
    socket.on('sync-order', (orderData: any) => {
      socket.broadcast.emit('order-synced', orderData);
    });

    // Sync table status to all devices
    socket.on('sync-table', (tableData: any) => {
      socket.broadcast.emit('table-synced', tableData);
    });

    // Handle device disconnect
    socket.on('disconnect', () => {
      for (const [id, device] of connectedDevices.entries()) {
        if (device.socketId === socket.id) {
          device.status = 'offline';
          connectedDevices.set(id, device);
          io.emit('devices-updated', getDevicesList());
          break;
        }
      }
    });
  });

  // Heartbeat check — mark devices offline if no heartbeat in 30s
  setInterval(() => {
    const now = Date.now();
    for (const [id, device] of connectedDevices.entries()) {
      if (device.status === 'online' && now - device.lastSeen.getTime() > 30000) {
        device.status = 'offline';
        connectedDevices.set(id, device);
      }
    }
  }, 15000);
}

export { router as deviceRouter };
