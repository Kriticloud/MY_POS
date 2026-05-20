import { formatCurrency } from '../utils/helpers';

// ESC/POS command constants
const ESC = '\x1B';
const GS = '\x1D';
const LF = '\x0A';

interface ESCPOSReceiptData {
  businessName: string;
  orderNumber: string;
  date: Date;
  cashier: string;
  items: { name: string; qty: number; price: number }[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: string;
  amountPaid?: number;
  change?: number;
  footer?: string;
}

// Generate ESC/POS receipt commands
export function generateESCPOS(data: ESCPOSReceiptData): string {
  let receipt = '';

  // Initialize
  receipt += ESC + '@'; // reset
  receipt += ESC + 'a' + '\x01'; // center

  // Header
  receipt += ESC + '!' + '\x38'; // double height + width
  receipt += data.businessName + LF;
  receipt += ESC + '!' + '\x00'; // normal
  receipt += LF;

  // Order info
  receipt += ESC + 'a' + '\x00'; // left align
  receipt += '--------------------------------' + LF;
  receipt += `Order: ${data.orderNumber}` + LF;
  receipt += `Date: ${data.date.toLocaleString()}` + LF;
  receipt += `Cashier: ${data.cashier}` + LF;
  receipt += '--------------------------------' + LF;

  // Items
  for (const item of data.items) {
    const name = item.name.substring(0, 20).padEnd(20);
    const qty = String(item.qty).padStart(3);
    const price = formatCurrency(item.price).padStart(9);
    receipt += `${name}${qty}${price}` + LF;
  }

  receipt += '--------------------------------' + LF;

  // Totals
  receipt += `${'Subtotal:'.padEnd(22)}${formatCurrency(data.subtotal).padStart(10)}` + LF;
  receipt += `${'Tax:'.padEnd(22)}${formatCurrency(data.tax).padStart(10)}` + LF;
  if (data.discount > 0) {
    receipt += `${'Discount:'.padEnd(22)}${('-' + formatCurrency(data.discount)).padStart(10)}` + LF;
  }
  receipt += '--------------------------------' + LF;
  receipt += ESC + '!' + '\x10'; // double width
  receipt += `${'TOTAL:'.padEnd(16)}${formatCurrency(data.total).padStart(16)}` + LF;
  receipt += ESC + '!' + '\x00'; // normal

  if (data.amountPaid) {
    receipt += `${'Paid:'.padEnd(22)}${formatCurrency(data.amountPaid).padStart(10)}` + LF;
  }
  if (data.change && data.change > 0) {
    receipt += `${'Change:'.padEnd(22)}${formatCurrency(data.change).padStart(10)}` + LF;
  }

  receipt += '--------------------------------' + LF;
  receipt += `Payment: ${data.paymentMethod}` + LF;

  // Footer
  receipt += LF;
  receipt += ESC + 'a' + '\x01'; // center
  receipt += (data.footer || 'Thank you for your visit!') + LF;
  receipt += LF;

  // Cut paper
  receipt += GS + 'V' + '\x42' + '\x00'; // partial cut

  return receipt;
}

// Generate barcode label for product
export function generateBarcodeLabel(product: { name: string; barcode?: string; sku?: string; price: number }): string {
  const html = `<!DOCTYPE html>
<html><head><style>
  body { margin: 0; padding: 10px; font-family: Arial, sans-serif; }
  .label { width: 50mm; padding: 5mm; border: 1px solid #ccc; }
  .name { font-size: 10px; font-weight: bold; margin-bottom: 3px; }
  .barcode { font-family: 'Libre Barcode 39', monospace; font-size: 40px; text-align: center; margin: 5px 0; letter-spacing: 2px; }
  .code { font-size: 8px; text-align: center; margin-bottom: 3px; }
  .price { font-size: 14px; font-weight: bold; text-align: right; }
  @media print { .label { border: none; } }
</style>
<link href="https://fonts.googleapis.com/css2?family=Libre+Barcode+39&display=swap" rel="stylesheet">
</head><body>
  <div class="label">
    <div class="name">${product.name}</div>
    ${product.barcode ? `
      <div class="barcode">*${product.barcode}*</div>
      <div class="code">${product.barcode}</div>
    ` : product.sku ? `
      <div class="barcode">*${product.sku}*</div>
      <div class="code">${product.sku}</div>
    ` : ''}
    <div class="price">${formatCurrency(product.price)}</div>
  </div>
  <script>window.onload=()=>window.print();</script>
</body></html>`;

  return html;
}

export function printBarcodeLabel(product: { name: string; barcode?: string; sku?: string; price: number }) {
  const html = generateBarcodeLabel(product);
  const w = window.open('', '_blank', 'width=300,height=200');
  if (w) {
    w.document.write(html);
    w.document.close();
  }
}

// Print multiple labels
export function printBarcodeLabels(products: { name: string; barcode?: string; sku?: string; price: number }[], copies = 1) {
  const labels = products.flatMap(p => Array(copies).fill(generateBarcodeLabel(p)));

  const html = `<!DOCTYPE html>
<html><head><style>
  body { margin: 0; padding: 10px; font-family: Arial, sans-serif; }
  .label { display: inline-block; width: 50mm; padding: 5mm; border: 1px solid #ccc; margin: 2mm; vertical-align: top; page-break-inside: avoid; }
  .name { font-size: 10px; font-weight: bold; margin-bottom: 3px; }
  .barcode { font-family: 'Libre Barcode 39', monospace; font-size: 40px; text-align: center; margin: 5px 0; }
  .code { font-size: 8px; text-align: center; }
  .price { font-size: 14px; font-weight: bold; text-align: right; }
  @media print { .label { border: none; } }
</style>
<link href="https://fonts.googleapis.com/css2?family=Libre+Barcode+39&display=swap" rel="stylesheet">
</head><body>
  ${products.map(p => `
    <div class="label">
      <div class="name">${p.name}</div>
      ${p.barcode ? `<div class="barcode">*${p.barcode}*</div><div class="code">${p.barcode}</div>` : p.sku ? `<div class="barcode">*${p.sku}*</div><div class="code">${p.sku}</div>` : ''}
      <div class="price">${formatCurrency(p.price)}</div>
    </div>
  `).join('')}
  <script>window.onload=()=>window.print();</script>
</body></html>`;

  const w = window.open('', '_blank', 'width=800,height=600');
  if (w) {
    w.document.write(html);
    w.document.close();
  }
}
