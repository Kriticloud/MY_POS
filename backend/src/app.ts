import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';

import { errorHandler } from './middleware/errorHandler';
import { devFallback, devRouter } from './middleware/devFallback';
import { sanitizeInput } from './middleware/sanitize';
import { authRouter } from './modules/auth/auth.routes';
import { twoFactorRouter } from './modules/auth/twoFactor.routes';
import { productRouter } from './modules/products/product.routes';
import { categoryRouter } from './modules/categories/category.routes';
import { orderRouter } from './modules/orders/order.routes';
import { customerRouter } from './modules/customers/customer.routes';
import { tableRouter } from './modules/tables/table.routes';
import { inventoryRouter } from './modules/inventory/inventory.routes';
import { reportRouter } from './modules/reports/report.routes';
import { settingRouter } from './modules/settings/setting.routes';
import { employeeRouter } from './modules/employees/employee.routes';
import { auditLogRouter } from './modules/audit/audit.routes';
import { discountRouter } from './modules/discounts/discount.routes';
import { cashDrawerRouter } from './modules/cash-drawer/cashDrawer.routes';
import { supplierRouter } from './modules/suppliers/supplier.routes';
import { appointmentRouter } from './modules/appointments/appointment.routes';
import { membershipRouter } from './modules/memberships/membership.routes';
import { taxRouter } from './modules/taxes/tax.routes';
import { branchRouter } from './modules/branches/branch.routes';
import { backupRouter } from './modules/backup/backup.routes';
import { exchangeRateRouter } from './modules/exchange/exchange.routes';
import { giftCardRouter } from './modules/giftcards/giftcard.routes';
import uploadRouter from './modules/upload/upload.routes';
import { paymentRouter } from './modules/payments/payment.routes';
import { webhookRouter } from './modules/webhooks/webhook.routes';
import { smsRouter } from './modules/sms/sms.routes';
import { receiptRouter } from './modules/receipt/receipt.routes';
import { deviceRouter } from './modules/devices/device.routes';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './lib/swagger';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();

// Security
app.use(helmet());
app.use(compression());
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

// Input sanitization (XSS prevention)
app.use(sanitizeInput);

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check
app.get('/api/health', (_, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Serve uploaded files
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

// Dev mode: proactive routing when DB is unavailable
app.use(devRouter);

// Routes
app.use('/api/auth', authRouter);
app.use('/api/2fa', twoFactorRouter);
app.use('/api/products', productRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/orders', orderRouter);
app.use('/api/customers', customerRouter);
app.use('/api/tables', tableRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/reports', reportRouter);
app.use('/api/employees', employeeRouter);
app.use('/api/audit-log', auditLogRouter);
app.use('/api/discounts', discountRouter);
app.use('/api/cash-drawer', cashDrawerRouter);
app.use('/api/suppliers', supplierRouter);
app.use('/api/appointments', appointmentRouter);
app.use('/api/memberships', membershipRouter);
app.use('/api/taxes', taxRouter);
app.use('/api/branches', branchRouter);
app.use('/api/backups', backupRouter);
app.use('/api/exchange-rates', exchangeRateRouter);
app.use('/api/gift-cards', giftCardRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/payments', paymentRouter);
app.use('/api/webhooks', webhookRouter);
app.use('/api/sms', smsRouter);
app.use('/api/receipt', receiptRouter);
app.use('/api/devices', deviceRouter);
app.use('/api/settings', settingRouter);

// API versioning: /api/v1/* mirrors /api/* for forward compatibility
app.use('/api/v1', (_req, _res, next) => next('route'));
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/customers', customerRouter);
app.use('/api/v1/reports', reportRouter);
app.use('/api/v1/settings', settingRouter);

// Error handling
app.use(devFallback);
app.use(errorHandler);

export default app;
