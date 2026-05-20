import { Router, Request, Response } from 'express';
import { authenticate, authorize } from '../../middleware/auth';
import fs from 'fs';
import path from 'path';

const router = Router();
router.use(authenticate);
router.use(authorize('SUPER_ADMIN', 'ADMIN'));

const DB_PATH = path.resolve(__dirname, '../../../prisma/dev.db');
const BACKUP_DIR = path.resolve(__dirname, '../../../backups');

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
