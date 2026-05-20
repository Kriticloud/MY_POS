import { z } from 'zod';
import logger from './logger';

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().min(8, 'JWT_SECRET must be at least 8 characters'),
  PORT: z.string().default('4000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  // Optional
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  EMAIL_FROM: z.string().optional(),
});

export function validateEnv() {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    const errors = result.error.issues.map(i => `  - ${i.path.join('.')}: ${i.message}`).join('\n');
    logger.error(`Environment validation failed:\n${errors}`);
    // In development, use defaults; in production, crash
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    } else {
      logger.warn('Running with incomplete environment (dev mode). Using defaults.');
      // Set safe defaults for dev
      if (!process.env.JWT_SECRET) process.env.JWT_SECRET = 'dev-secret-change-in-production';
      if (!process.env.DATABASE_URL) process.env.DATABASE_URL = 'file:./dev.db';
    }
  }
}
