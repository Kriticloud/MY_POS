import { useCartStore } from '../store/cartStore';
import { formatCurrency } from '../utils/helpers';
import { useSettingsStore } from '../store/settingsStore';
import { useEffect, useRef } from 'react';

/**
 * Opens a customer-facing display in a new window.
 * Shows real-time cart items and total.
 */
export function openCustomerDisplay() {
  const width = 480;
  const height = 600;
  const left = window.screen.width - width - 50;
  const displayWindow = window.open('', 'CustomerDisplay', `width=${width},height=${height},left=${left},top=50,toolbar=no,menubar=no`);
  if (!displayWindow) return;

  displayWindow.document.title = 'Customer Display';
  displayWindow.document.body.innerHTML = '<div id="cd-root"></div>';
  displayWindow.document.head.innerHTML = `
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: 'Inter', -apple-system, sans-serif; background: linear-gradient(135deg, #1e3a5f, #0f172a); color: white; min-height: 100vh; }
      .header { padding: 24px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1); }
      .header h1 { font-size: 20px; font-weight: 600; }
      .header p { font-size: 12px; opacity: 0.6; margin-top: 4px; }
      .items { padding: 16px; flex: 1; overflow-y: auto; }
      .item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
      .item-name { font-size: 14px; }
      .item-qty { font-size: 12px; opacity: 0.6; }
      .item-price { font-size: 14px; font-weight: 600; }
      .total-section { padding: 20px; background: rgba(255,255,255,0.05); border-top: 2px solid rgba(59,130,246,0.5); }
      .total-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; }
      .total-row.grand { font-size: 28px; font-weight: 700; padding: 12px 0; color: #60a5fa; }
      .empty { text-align: center; padding: 60px 20px; opacity: 0.4; font-size: 16px; }
      .welcome { text-align: center; padding: 40px; font-size: 14px; opacity: 0.5; }
    </style>
  `;

  // Update function
  const update = () => {
    if (displayWindow.closed) return;
    const cart = useCartStore.getState();
    const businessName = useSettingsStore.getState().businessName;
    const items = cart.items || [];
    const subtotal = items.reduce((s: number, i: any) => s + i.price * i.quantity, 0);
    const tax = subtotal * 0.085;
    const total = subtotal + tax;

    const root = displayWindow.document.getElementById('cd-root');
    if (!root) return;

    if (items.length === 0) {
      root.innerHTML = `
        <div class="header"><h1>${businessName}</h1><p>Welcome!</p></div>
        <div class="empty">Scan items to begin</div>
        <div class="welcome">Thank you for shopping with us</div>
      `;
    } else {
      root.innerHTML = `
        <div class="header"><h1>${businessName}</h1><p>${items.length} item(s)</p></div>
        <div class="items">
          ${items.map((i: any) => `
            <div class="item">
              <div><div class="item-name">${i.name}</div><div class="item-qty">Qty: ${i.quantity}</div></div>
              <div class="item-price">${formatCurrency(i.price * i.quantity)}</div>
            </div>
          `).join('')}
        </div>
        <div class="total-section">
          <div class="total-row"><span>Subtotal</span><span>${formatCurrency(subtotal)}</span></div>
          <div class="total-row"><span>Tax</span><span>${formatCurrency(tax)}</span></div>
          <div class="total-row grand"><span>Total</span><span>${formatCurrency(total)}</span></div>
        </div>
      `;
    }
  };

  // Initial render + interval
  update();
  const interval = setInterval(update, 500);
  displayWindow.addEventListener('beforeunload', () => clearInterval(interval));
}
