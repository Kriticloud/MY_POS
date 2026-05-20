import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';

import { errorHandler } from './middleware/errorHandler';
import { devFallback, devRouter } from './middleware/devFallback';
import { authRouter } from './modules/auth/auth.routes';
import { productRouter } from './modules/products/product.routes';
import { categoryRouter } from './modules/categories/category.routes';
import { orderRouter } from './modules/orders/order.routes';
import { customerRouter } from './modules/customers/customer.routes';
import { tableRouter } from './modules/tables/table.routes';
import { inventoryRouter } from './modules/inventory/inventory.routes';
import { reportRouter } from './modules/reports/report.routes';
import { settingRouter } from './modules/settings/setting.routes';
import { employeeRouter } from './modules/employees/employee.routes';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();

// Security
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/auth', limiter);

// Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check
app.get('/api/health', (_, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Dev mode: proactive routing when DB is unavailable
app.use(devRouter);

// Routes
app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/orders', orderRouter);
app.use('/api/customers', customerRouter);
app.use('/api/tables', tableRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/reports', reportRouter);
app.use('/api/employees', employeeRouter);
app.use('/api/settings', settingRouter);

// Error handling
app.use(devFallback);
app.use(errorHandler);

export default app;
