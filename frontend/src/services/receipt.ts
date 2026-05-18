import { formatCurrency, formatDate } from '../utils/helpers';

interface ReceiptData {
  orderNumber: string;
  date: Date;
  items: Array<{ name: string; quantity: number; unitPrice: number; totalPrice: number }>;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: string;
  cashierName: string;
  businessName: string;
  businessAddress?: string;
  businessPhone?: string;
  footer?: string;
}

export function generateReceiptHTML(data: ReceiptData): string {
  const itemRows = data.items
    .map(
      (item) => `
    <tr>
      <td style="text-align:left">${item.name}</td>
      <td style="text-align:center">${item.quantity}</td>
      <td style="text-align:right">${formatCurrency(item.totalPrice)}</td>
    </tr>
  `
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Courier New', monospace; font-size: 12px; width: 80mm; margin: 0 auto; padding: 10px; }
    .header { text-align: center; margin-bottom: 10px; }
    .header h2 { margin: 0; font-size: 16px; }
    .divider { border-top: 1px dashed #000; margin: 8px 0; }
    table { width: 100%; border-collapse: collapse; }
    td { padding: 2px 0; }
    .totals td { padding: 3px 0; }
    .total-row { font-weight: bold; font-size: 14px; }
    .footer { text-align: center; margin-top: 10px; font-size: 11px; }
  </style>
</head>
<body>
  <div class="header">
    <h2>${data.businessName}</h2>
    ${data.businessAddress ? `<p>${data.businessAddress}</p>` : ''}
    ${data.businessPhone ? `<p>Tel: ${data.businessPhone}</p>` : ''}
  </div>
  <div class="divider"></div>
  <p><strong>Order:</strong> ${data.orderNumber}</p>
  <p><strong>Date:</strong> ${formatDate(data.date)}</p>
  <p><strong>Cashier:</strong> ${data.cashierName}</p>
  <div class="divider"></div>
  <table>
    <tr>
      <th style="text-align:left">Item</th>
      <th style="text-align:center">Qty</th>
      <th style="text-align:right">Amount</th>
    </tr>
    ${itemRows}
  </table>
  <div class="divider"></div>
  <table class="totals">
    <tr><td>Subtotal:</td><td style="text-align:right">${formatCurrency(data.subtotal)}</td></tr>
    <tr><td>Tax:</td><td style="text-align:right">${formatCurrency(data.tax)}</td></tr>
    ${data.discount > 0 ? `<tr><td>Discount:</td><td style="text-align:right">-${formatCurrency(data.discount)}</td></tr>` : ''}
    <tr class="total-row"><td>TOTAL:</td><td style="text-align:right">${formatCurrency(data.total)}</td></tr>
  </table>
  <div class="divider"></div>
  <p><strong>Payment:</strong> ${data.paymentMethod}</p>
  <div class="footer">
    <p>${data.footer || 'Thank you for your visit!'}</p>
  </div>
</body>
</html>`;
}

export function printReceipt(data: ReceiptData) {
  const html = generateReceiptHTML(data);
  const printWindow = window.open('', '_blank', 'width=350,height=600');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  }
}
