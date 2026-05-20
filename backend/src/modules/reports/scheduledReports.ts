import { prisma } from '../../lib/prisma';

interface ScheduledReport {
  id: string;
  name: string;
  type: 'DAILY_SALES' | 'WEEKLY_SUMMARY' | 'MONTHLY_REPORT' | 'LOW_STOCK_ALERT';
  schedule: string; // cron expression
  recipients: string[];
  enabled: boolean;
  lastRun?: Date;
}

// In-memory store for scheduled reports (in production, use a database table)
const scheduledReports: ScheduledReport[] = [];
const reportHistory: { id: string; reportId: string; sentAt: Date; recipients: string[]; status: string; summary: string }[] = [];

export async function generateDailySalesReport() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: today } },
    include: { items: true, payments: true },
  });
  const totalRevenue = orders.reduce((s, o) => s + o.totalAmount, 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return {
    date: today.toISOString().split('T')[0],
    totalRevenue,
    totalOrders,
    avgOrderValue,
    topPaymentMethod: orders.flatMap(o => o.payments).reduce((acc: Record<string, number>, p) => {
      acc[p.method] = (acc[p.method] || 0) + p.amount;
      return acc;
    }, {}),
  };
}

export async function generateLowStockReport() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { inventory: true },
  });
  const lowStock = products
    .filter(p => p.inventory && p.inventory.quantity <= p.inventory.reorderPoint)
    .map(p => ({
      name: p.name,
      sku: p.sku,
      currentStock: p.inventory?.quantity || 0,
      reorderPoint: p.inventory?.reorderPoint || 0,
    }));
  return { lowStockItems: lowStock, count: lowStock.length };
}

export function getScheduledReports() { return scheduledReports; }
export function getReportHistory() { return reportHistory; }

export function createScheduledReport(report: Omit<ScheduledReport, 'id'>) {
  const newReport = { ...report, id: crypto.randomUUID() };
  scheduledReports.push(newReport);
  return newReport;
}

export function updateScheduledReport(id: string, updates: Partial<ScheduledReport>) {
  const idx = scheduledReports.findIndex(r => r.id === id);
  if (idx === -1) throw new Error('Report not found');
  Object.assign(scheduledReports[idx], updates);
  return scheduledReports[idx];
}

export function deleteScheduledReport(id: string) {
  const idx = scheduledReports.findIndex(r => r.id === id);
  if (idx === -1) throw new Error('Report not found');
  scheduledReports.splice(idx, 1);
}

export async function runScheduledReport(id: string) {
  const report = scheduledReports.find(r => r.id === id);
  if (!report) throw new Error('Report not found');

  let summary = '';
  if (report.type === 'DAILY_SALES') {
    const data = await generateDailySalesReport();
    summary = `Revenue: $${data.totalRevenue.toFixed(2)}, Orders: ${data.totalOrders}`;
  } else if (report.type === 'LOW_STOCK_ALERT') {
    const data = await generateLowStockReport();
    summary = `${data.count} items below reorder point`;
  } else {
    summary = 'Report generated successfully';
  }

  // In production, send actual email here
  console.log(`[Scheduled Report] "${report.name}" sent to ${report.recipients.join(', ')}: ${summary}`);

  const historyEntry = {
    id: crypto.randomUUID(),
    reportId: id,
    sentAt: new Date(),
    recipients: report.recipients,
    status: 'SENT',
    summary,
  };
  reportHistory.push(historyEntry);
  report.lastRun = new Date();

  return historyEntry;
}
