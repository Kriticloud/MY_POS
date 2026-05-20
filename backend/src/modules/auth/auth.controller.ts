import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { AuthRequest } from '../../middleware/auth';
import { z } from 'zod';
import { AppError } from '../../middleware/errorHandler';
import bcrypt from 'bcryptjs';
import { prisma } from '../../lib/prisma';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  role: z.string().optional(),
  branchId: z.string().optional(),
});

export class AuthController {
  private service = new AuthService();

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = registerSchema.parse(req.body);
      const result = await this.service.register(data);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(new AppError(error.errors[0].message, 400));
      }
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = loginSchema.parse(req.body);
      const result = await this.service.login(data.email, data.password);
      res.json({ success: true, data: result });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(new AppError(error.errors[0].message, 400));
      }
      next(error);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        throw new AppError('Refresh token required', 400);
      }
      const result = await this.service.refreshToken(refreshToken);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await this.service.logout(req.user!.id);
      res.json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  };

  getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = await this.service.getProfile(req.user!.id);
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  };

  changePassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword || newPassword.length < 6) {
        throw new AppError('New password must be at least 6 characters', 400);
      }
      const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
      if (!user) throw new AppError('User not found', 404);
      const valid = await bcrypt.compare(currentPassword, user.password);
      if (!valid) throw new AppError('Current password is incorrect', 400);
      const hashed = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({ where: { id: req.user!.id }, data: { password: hashed } });
      res.json({ success: true, message: 'Password changed successfully' });
    } catch (error) { next(error); }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      if (!email) throw new AppError('Email is required', 400);
      const user = await prisma.user.findUnique({ where: { email } });
      // Always return success to prevent email enumeration
      if (!user) return res.json({ success: true, message: 'If the email exists, a reset link has been sent' });
      // Generate temporary password
      const tempPass = Math.random().toString(36).slice(-8);
      const hashed = await bcrypt.hash(tempPass, 10);
      await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });
      // In production, send email. For now, log it.
      console.log(`Password reset for ${email}: temporary password = ${tempPass}`);
      res.json({ success: true, message: 'If the email exists, a reset link has been sent', tempPassword: process.env.NODE_ENV === 'development' ? tempPass : undefined });
    } catch (error) { next(error); }
  };
}
