import { formatCurrency, formatDate } from '../utils/helpers';
import { useI18nStore } from '../store/i18nStore';

// Receipt label translations
const receiptLabels: Record<string, Record<string, string>> = {
  en: { order: 'Order', date: 'Date', cashier: 'Cashier', item: 'Item', qty: 'Qty', amount: 'Amount', subtotal: 'Subtotal', tax: 'Tax', discount: 'Discount', total: 'TOTAL', payment: 'Payment', thanks: 'Thank you for your visit!' },
  es: { order: 'Pedido', date: 'Fecha', cashier: 'Cajero', item: 'Artículo', qty: 'Cant', amount: 'Monto', subtotal: 'Subtotal', tax: 'Impuesto', discount: 'Descuento', total: 'TOTAL', payment: 'Pago', thanks: '¡Gracias por su visita!' },
  fr: { order: 'Commande', date: 'Date', cashier: 'Caissier', item: 'Article', qty: 'Qté', amount: 'Montant', subtotal: 'Sous-total', tax: 'Taxe', discount: 'Remise', total: 'TOTAL', payment: 'Paiement', thanks: 'Merci de votre visite!' },
  de: { order: 'Bestellung', date: 'Datum', cashier: 'Kassierer', item: 'Artikel', qty: 'Mge', amount: 'Betrag', subtotal: 'Zwischensumme', tax: 'Steuer', discount: 'Rabatt', total: 'GESAMT', payment: 'Zahlung', thanks: 'Vielen Dank für Ihren Besuch!' },
  hi: { order: 'ऑर्डर', date: 'तारीख', cashier: 'कैशियर', item: 'वस्तु', qty: 'मात्रा', amount: 'राशि', subtotal: 'उप-कुल', tax: 'कर', discount: 'छूट', total: 'कुल', payment: 'भुगतान', thanks: 'आपकी यात्रा के लिए धन्यवाद!' },
  ar: { order: 'طلب', date: 'التاريخ', cashier: 'أمين الصندوق', item: 'صنف', qty: 'الكمية', amount: 'المبلغ', subtotal: 'المجموع الفرعي', tax: 'الضريبة', discount: 'الخصم', total: 'الإجمالي', payment: 'الدفع', thanks: 'شكراً لزيارتكم!' },
};

function getReceiptLabels() {
  const lang = useI18nStore.getState().language;
  return receiptLabels[lang] || receiptLabels.en;
}

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
  const l = getReceiptLabels();
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
  <p><strong>${l.order}:</strong> ${data.orderNumber}</p>
  <p><strong>${l.date}:</strong> ${formatDate(data.date)}</p>
  <p><strong>${l.cashier}:</strong> ${data.cashierName}</p>
  <div class="divider"></div>
  <table>
    <tr>
      <th style="text-align:left">${l.item}</th>
      <th style="text-align:center">${l.qty}</th>
      <th style="text-align:right">${l.amount}</th>
    </tr>
    ${itemRows}
  </table>
  <div class="divider"></div>
  <table class="totals">
    <tr><td>${l.subtotal}:</td><td style="text-align:right">${formatCurrency(data.subtotal)}</td></tr>
    <tr><td>${l.tax}:</td><td style="text-align:right">${formatCurrency(data.tax)}</td></tr>
    ${data.discount > 0 ? `<tr><td>${l.discount}:</td><td style="text-align:right">-${formatCurrency(data.discount)}</td></tr>` : ''}
    <tr class="total-row"><td>${l.total}:</td><td style="text-align:right">${formatCurrency(data.total)}</td></tr>
  </table>
  <div class="divider"></div>
  <p><strong>${l.payment}:</strong> ${data.paymentMethod}</p>
  <div class="footer">
    <p>${data.footer || l.thanks}</p>
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

export function downloadReceipt(data: ReceiptData) {
  const html = generateReceiptHTML(data);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `receipt-${data.orderNumber}.html`;
  a.click();
  URL.revokeObjectURL(url);
}

export function sendDigitalReceipt(data: ReceiptData, email: string) {
  // In production this would call the backend API
  console.log(`Sending receipt ${data.orderNumber} to ${email}`);
  return Promise.resolve({ success: true });
}
