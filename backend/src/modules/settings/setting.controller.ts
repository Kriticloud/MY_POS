import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { prisma } from '../../lib/prisma';
import { AppError } from '../../middleware/errorHandler';

export class SettingController {
  getAll = async (_req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const settings = await prisma.setting.findMany();
      res.json({ success: true, data: settings });
    } catch (error) {
      next(error);
    }
  };

  getByKey = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const setting = await prisma.setting.findUnique({ where: { key: req.params.key } });
      if (!setting) throw new AppError('Setting not found', 404);
      res.json({ success: true, data: setting });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const setting = await prisma.setting.upsert({
        where: { key: req.params.key },
        update: { value: req.body.value },
        create: { key: req.params.key, value: req.body.value, group: req.body.group },
      });
      res.json({ success: true, data: setting });
    } catch (error) {
      next(error);
    }
  };
}
