import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../lib/prisma';
import { AppError } from '../../middleware/errorHandler';

export class AuthService {
  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role?: string;
    branchId?: string;
  }) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      throw new AppError('Email already registered', 409);
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: (data.role as any) || 'STAFF',
        branchId: data.branchId,
      },
      select: { id: true, email: true, firstName: true, lastName: true, role: true },
    });

    const tokens = this.generateTokens(user.id, user.email, user.role);
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refreshToken },
    });

    return { user, ...tokens };
  }

  async login(email: string, password: string) {
    // Dev mode fallback when database is unavailable
    if (process.env.NODE_ENV === 'development') {
      const devUsers: Record<string, { password: string; id: string; firstName: string; lastName: string; role: string }> = {
        'admin@mypos.com': { password: 'admin123', id: 'dev-admin-001', firstName: 'Admin', lastName: 'User', role: 'ADMIN' },
        'cashier@mypos.com': { password: 'cashier123', id: 'dev-cashier-001', firstName: 'Cashier', lastName: 'User', role: 'STAFF' },
      };

      try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (user) {
          const isValidPassword = await bcrypt.compare(password, user.password);
          if (!isValidPassword || !user.isActive) {
            throw new AppError('Invalid credentials', 401);
          }
          const tokens = this.generateTokens(user.id, user.email, user.role);
          try {
            await prisma.user.update({ where: { id: user.id }, data: { refreshToken: tokens.refreshToken } });
          } catch {}
          return {
            user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role, branchId: user.branchId, avatar: user.avatar },
            ...tokens,
          };
        }
      } catch (e: any) {
        // Database unavailable — fall through to dev credentials
        if (e instanceof AppError) throw e;
      }

      const devUser = devUsers[email];
      if (devUser && password === devUser.password) {
        const tokens = this.generateTokens(devUser.id, email, devUser.role);
        return {
          user: { id: devUser.id, email, firstName: devUser.firstName, lastName: devUser.lastName, role: devUser.role, branchId: null },
          ...tokens,
        };
      }

      throw new AppError('Invalid credentials', 401);
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) {
      throw new AppError('Invalid credentials', 401);
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new AppError('Invalid credentials', 401);
    }

    const tokens = this.generateTokens(user.id, user.email, user.role);
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refreshToken },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        branchId: user.branchId,
        avatar: user.avatar,
      },
      ...tokens,
    };
  }

  async refreshToken(token: string) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as { userId: string; email?: string; role?: string };

      // Dev-mode fallback: skip DB lookup for dev users
      if (process.env.NODE_ENV === 'development' && decoded.userId.startsWith('dev-')) {
        const email = decoded.email || 'admin@mypos.com';
        const role = decoded.role || 'ADMIN';
        const tokens = this.generateTokens(decoded.userId, email, role);
        return tokens;
      }

      const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

      if (!user || user.refreshToken !== token) {
        throw new AppError('Invalid refresh token', 401);
      }

      const tokens = this.generateTokens(user.id, user.email, user.role);
      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: tokens.refreshToken },
      });

      return tokens;
    } catch {
      throw new AppError('Invalid refresh token', 401);
    }
  }

  async logout(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  async getProfile(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        role: true,
        branchId: true,
        branch: { select: { id: true, name: true, businessType: true } },
      },
    });
  }

  private generateTokens(userId: string, email: string, role: string) {
    const accessToken = jwt.sign(
      { userId, email, role },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { userId, email, role },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
  }
}
