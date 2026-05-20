import { Router, Request, Response } from 'express';
import { authenticate, authorize } from '../../middleware/auth';
import fs from 'fs';
import path from 'path';
import logger from '../../lib/logger';

const router = Router();
router.use(authenticate);
router.use(authorize('SUPER_ADMIN', 'ADMIN'));

const DB_PATH = path.resolve(__dirname, '../../../prisma/dev.db');
const BACKUP_DIR = path.resolve(__dirname, '../../../backups');
const MAX_AUTO_BACKUPS = 7; // Keep last 7 auto-backups

// Auto-backup scheduler (every 6 hours)
function performAutoBackup() {
  try {
    if (!fs.existsSync(DB_PATH)) return;
    if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupName = `auto-backup-${timestamp}.db`;
    fs.copyFileSync(DB_PATH, path.join(BACKUP_DIR, backupName));
    logger.info(`Auto-backup created: ${backupName}`);
    // Clean old auto-backups
    const autoBackups = fs.readdirSync(BACKUP_DIR)
      .filter(f => f.startsWith('auto-backup-'))
      .sort()
      .reverse();
    for (const old of autoBackups.slice(MAX_AUTO_BACKUPS)) {
      fs.unlinkSync(path.join(BACKUP_DIR, old));
      logger.info(`Cleaned old backup: ${old}`);
    }
  } catch (e: any) {
    logger.error(`Auto-backup failed: ${e.message}`);
  }
}

// Schedule auto-backup every 6 hours
setInterval(performAutoBackup, 6 * 60 * 60 * 1000);
// Run first backup 1 minute after startup
setTimeout(performAutoBackup, 60 * 1000);

// GET list backups
router.get('/', (_req: Request, res: Response) => {
  if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });
  const files = fs.readdirSync(BACKUP_DIR)
    .filter(f => f.endsWith('.db'))
    .map(f => {
      const stats = fs.statSync(path.join(BACKUP_DIR, f));
      return { name: f, size: stats.size, createdAt: stats.mtime.toISOString() };
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json(files);
});

// POST create backup
router.post('/', (_req: Request, res: Response) => {
  if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupName = `backup-${timestamp}.db`;
  const dest = path.join(BACKUP_DIR, backupName);
  fs.copyFileSync(DB_PATH, dest);
  const stats = fs.statSync(dest);
  res.status(201).json({ name: backupName, size: stats.size, createdAt: stats.mtime.toISOString() });
});

// POST restore from backup
router.post('/restore/:name', (req: Request, res: Response) => {
  const backupPath = path.join(BACKUP_DIR, req.params.name);
  if (!fs.existsSync(backupPath)) { res.status(404).json({ error: 'Backup not found' }); return; }
  // Safety: create auto-backup before restore
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  fs.copyFileSync(DB_PATH, path.join(BACKUP_DIR, `pre-restore-${timestamp}.db`));
  fs.copyFileSync(backupPath, DB_PATH);
  res.json({ success: true, message: 'Database restored. Restart the server to apply changes.' });
});

// DELETE backup
router.delete('/:name', (req: Request, res: Response) => {
  const backupPath = path.join(BACKUP_DIR, req.params.name);
  if (fs.existsSync(backupPath)) fs.unlinkSync(backupPath);
  res.json({ success: true });
});

// GET export (download DB)
router.get('/export', (_req: Request, res: Response) => {
  if (!fs.existsSync(DB_PATH)) { res.status(404).json({ error: 'Database not found' }); return; }
  res.download(DB_PATH, 'mypos-database.db');
});

export { router as backupRouter };
