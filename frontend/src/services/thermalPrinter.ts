/**
 * ESC/POS Thermal Printer Service
 * Supports USB (WebUSB API) and Network (via backend proxy) printing
 */

import { formatCurrency } from '../utils/helpers';

// ESC/POS Command Constants
const ESC = 0x1B;
const GS = 0x1D;
const LF = 0x0A;

const CMD = {
  INIT: [ESC, 0x40],                          // Initialize printer
  CUT: [GS, 0x56, 0x00],                      // Full cut
  PARTIAL_CUT: [GS, 0x56, 0x01],              // Partial cut
  ALIGN_LEFT: [ESC, 0x61, 0x00],
  ALIGN_CENTER: [ESC, 0x61, 0x01],
  ALIGN_RIGHT: [ESC, 0x61, 0x02],
  BOLD_ON: [ESC, 0x45, 0x01],
  BOLD_OFF: [ESC, 0x45, 0x00],
  DOUBLE_WIDTH: [GS, 0x21, 0x10],             // Double width
  DOUBLE_HEIGHT: [GS, 0x21, 0x01],            // Double height
  DOUBLE_SIZE: [GS, 0x21, 0x11],              // Double width + height
  NORMAL_SIZE: [GS, 0x21, 0x00],              // Normal size
  UNDERLINE_ON: [ESC, 0x2D, 0x01],
  UNDERLINE_OFF: [ESC, 0x2D, 0x00],
  FEED_LINES: (n: number) => [ESC, 0x64, n],  // Feed n lines
  LINE_SPACING: (n: number) => [ESC, 0x33, n],
  OPEN_DRAWER: [ESC, 0x70, 0x00, 0x19, 0xFA], // Open cash drawer (pin 2)
};

export interface ThermalPrinterConfig {
  type: 'usb' | 'network';
  paperWidth: 58 | 80;         // mm
  networkHost?: string;
  networkPort?: number;
  vendorId?: number;            // USB vendor ID
  productId?: number;           // USB product ID
  autoCut?: boolean;
  openDrawer?: boolean;
}

export interface ReceiptData {
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

const DEFAULT_CONFIG: ThermalPrinterConfig = {
  type: 'usb',
  paperWidth: 80,
  autoCut: true,
  openDrawer: false,
};

// Character widths per paper size (for monospace formatting)
const CHARS_PER_LINE: Record<number, number> = { 58: 32, 80: 48 };

class ESCPOSBuilder {
  private buffer: number[] = [];
  private charsPerLine: number;

  constructor(paperWidth: number) {
    this.charsPerLine = CHARS_PER_LINE[paperWidth] || 48;
    this.buffer.push(...CMD.INIT);
  }

  raw(bytes: number[]): this { this.buffer.push(...bytes); return this; }

  text(str: string): this {
    const encoder = new TextEncoder();
    this.buffer.push(...encoder.encode(str));
    return this;
  }

  newline(): this { this.buffer.push(LF); return this; }
  feed(lines = 1): this { this.buffer.push(...CMD.FEED_LINES(lines)); return this; }
  alignLeft(): this { this.buffer.push(...CMD.ALIGN_LEFT); return this; }
  alignCenter(): this { this.buffer.push(...CMD.ALIGN_CENTER); return this; }
  alignRight(): this { this.buffer.push(...CMD.ALIGN_RIGHT); return this; }
  boldOn(): this { this.buffer.push(...CMD.BOLD_ON); return this; }
  boldOff(): this { this.buffer.push(...CMD.BOLD_OFF); return this; }
  doubleSize(): this { this.buffer.push(...CMD.DOUBLE_SIZE); return this; }
  normalSize(): this { this.buffer.push(...CMD.NORMAL_SIZE); return this; }
  cut(): this { this.buffer.push(...CMD.PARTIAL_CUT); return this; }
  openDrawer(): this { this.buffer.push(...CMD.OPEN_DRAWER); return this; }

  divider(char = '-'): this {
    return this.text(char.repeat(this.charsPerLine)).newline();
  }

  twoColumn(left: string, right: string): this {
    const space = this.charsPerLine - left.length - right.length;
    if (space > 0) {
      return this.text(left + ' '.repeat(space) + right).newline();
    }
    return this.text(left.slice(0, this.charsPerLine - right.length - 1) + ' ' + right).newline();
  }

  threeColumn(left: string, center: string, right: string): this {
    const leftWidth = Math.floor(this.charsPerLine * 0.5);
    const centerWidth = Math.floor(this.charsPerLine * 0.15);
    const rightWidth = this.charsPerLine - leftWidth - centerWidth;

    const l = left.length > leftWidth ? left.slice(0, leftWidth) : left.padEnd(leftWidth);
    const c = center.length > centerWidth ? center.slice(0, centerWidth) : center.padStart(centerWidth);
    const r = right.length > rightWidth ? right.slice(0, rightWidth) : right.padStart(rightWidth);

    return this.text(l + c + r).newline();
  }

  build(): Uint8Array {
    return new Uint8Array(this.buffer);
  }
}

export function buildReceiptESCPOS(data: ReceiptData, config: ThermalPrinterConfig = DEFAULT_CONFIG): Uint8Array {
  const b = new ESCPOSBuilder(config.paperWidth);

  // Header
  b.alignCenter()
    .doubleSize().text(data.businessName).newline().normalSize()
    .feed(1);

  if (data.businessAddress) b.text(data.businessAddress).newline();
  if (data.businessPhone) b.text(`Tel: ${data.businessPhone}`).newline();

  b.divider('=');

  // Order info
  b.alignLeft()
    .boldOn().text(`Order: ${data.orderNumber}`).boldOff().newline()
    .text(`Date: ${data.date.toLocaleString()}`).newline()
    .text(`Cashier: ${data.cashierName}`).newline()
    .divider();

  // Items header
  b.boldOn().threeColumn('Item', 'Qty', 'Amount').boldOff()
    .divider();

  // Items
  for (const item of data.items) {
    b.threeColumn(
      item.name,
      `x${item.quantity}`,
      formatCurrency(item.totalPrice)
    );
  }

  b.divider();

  // Totals
  b.twoColumn('Subtotal:', formatCurrency(data.subtotal));
  b.twoColumn('Tax:', formatCurrency(data.tax));
  if (data.discount > 0) b.twoColumn('Discount:', `-${formatCurrency(data.discount)}`);
  b.divider()
    .boldOn().doubleSize()
    .twoColumn('TOTAL:', formatCurrency(data.total))
    .normalSize().boldOff()
    .divider();

  // Payment
  b.twoColumn('Payment:', data.paymentMethod).newline();

  // Footer
  b.alignCenter()
    .text(data.footer || 'Thank you for your visit!')
    .feed(3);

  // Cut & drawer
  if (config.autoCut) b.cut();
  if (config.openDrawer) b.openDrawer();

  return b.build();
}

// --- USB Printing via WebUSB API ---
let usbDevice: USBDevice | null = null;

export async function connectUSBPrinter(vendorId?: number, productId?: number): Promise<boolean> {
  if (!('usb' in navigator)) {
    throw new Error('WebUSB not supported in this browser. Use Chrome or Edge.');
  }

  try {
    const filters: USBDeviceFilter[] = vendorId && productId
      ? [{ vendorId, productId }]
      : [];

    usbDevice = await (navigator as any).usb.requestDevice({ filters });
    await usbDevice!.open();

    if (usbDevice!.configuration === null) {
      await usbDevice!.selectConfiguration(1);
    }
    await usbDevice!.claimInterface(0);
    return true;
  } catch (err: any) {
    console.error('USB printer connection failed:', err);
    throw new Error(`Failed to connect USB printer: ${err.message}`);
  }
}

export async function printViaUSB(data: Uint8Array): Promise<void> {
  if (!usbDevice) throw new Error('No USB printer connected. Call connectUSBPrinter() first.');

  const iface = usbDevice.configuration?.interfaces[0];
  const endpoint = iface?.alternate?.endpoints.find(e => e.direction === 'out');

  if (!endpoint) throw new Error('No output endpoint found on printer');

  await usbDevice.transferOut(endpoint.endpointNumber, data);
}

export function disconnectUSBPrinter(): void {
  if (usbDevice) {
    usbDevice.close().catch(() => {});
    usbDevice = null;
  }
}

// --- Network Printing via backend proxy ---
export async function printViaNetwork(data: Uint8Array, host: string, port: number): Promise<void> {
  const response = await fetch('/api/print/raw', {
    method: 'POST',
    headers: { 'Content-Type': 'application/octet-stream', 'X-Printer-Host': host, 'X-Printer-Port': String(port) },
    body: data,
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Network print failed: ${err}`);
  }
}

// --- High-level print function ---
export async function printThermalReceipt(data: ReceiptData, config: ThermalPrinterConfig): Promise<void> {
  const escposData = buildReceiptESCPOS(data, config);

  if (config.type === 'usb') {
    if (!usbDevice) await connectUSBPrinter(config.vendorId, config.productId);
    await printViaUSB(escposData);
  } else if (config.type === 'network') {
    if (!config.networkHost || !config.networkPort) throw new Error('Network printer host and port required');
    await printViaNetwork(escposData, config.networkHost, config.networkPort);
  }
}

// --- Cash Drawer ---
export async function openCashDrawer(config: ThermalPrinterConfig): Promise<void> {
  const b = new ESCPOSBuilder(config.paperWidth);
  b.openDrawer();
  const data = b.build();

  if (config.type === 'usb') {
    if (!usbDevice) await connectUSBPrinter(config.vendorId, config.productId);
    await printViaUSB(data);
  } else if (config.type === 'network') {
    if (!config.networkHost || !config.networkPort) throw new Error('Network printer host and port required');
    await printViaNetwork(data, config.networkHost, config.networkPort);
  }
}

// --- Test Print ---
export function buildTestPage(config: ThermalPrinterConfig): Uint8Array {
  const b = new ESCPOSBuilder(config.paperWidth);
  b.alignCenter()
    .doubleSize().text('PRINTER TEST').newline().normalSize()
    .feed(1)
    .text(`Paper: ${config.paperWidth}mm`).newline()
    .text(`Type: ${config.type.toUpperCase()}`).newline()
    .text(`Time: ${new Date().toLocaleString()}`).newline()
    .divider()
    .text('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdef').newline()
    .text('1234567890!@#$%^&*()').newline()
    .divider()
    .boldOn().text('Bold Text').boldOff().newline()
    .doubleSize().text('Large Text').normalSize().newline()
    .divider()
    .text('Printer is working correctly!').newline()
    .feed(3);
  if (config.autoCut) b.cut();
  return b.build();
}

// Check WebUSB support
export function isWebUSBSupported(): boolean {
  return 'usb' in navigator;
}

// Get saved printer config from localStorage
export function getSavedPrinterConfig(): ThermalPrinterConfig | null {
  try {
    const saved = localStorage.getItem('thermalPrinterConfig');
    return saved ? JSON.parse(saved) : null;
  } catch { return null; }
}

export function savePrinterConfig(config: ThermalPrinterConfig): void {
  localStorage.setItem('thermalPrinterConfig', JSON.stringify(config));
}
