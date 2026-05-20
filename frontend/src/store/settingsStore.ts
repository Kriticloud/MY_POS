import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../services/api';

export type BusinessType = 'RESTAURANT' | 'CAFE' | 'RETAIL' | 'GROCERY' | 'SALON' | 'PHARMACY' | 'GENERAL';

interface SettingsState {
  currency: string;
  businessType: BusinessType;
  businessName: string;
  taxRate: number;
  taxInclusive: boolean;
  loaded: boolean;
  fetchSettings: () => Promise<void>;
  updateSettings: (updates: Partial<Pick<SettingsState, 'currency' | 'businessType' | 'businessName' | 'taxRate' | 'taxInclusive'>>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      currency: 'USD',
      businessType: 'RESTAURANT',
      businessName: 'MyPOS Restaurant',
      taxRate: 8.5,
      taxInclusive: false,
      loaded: false,

      fetchSettings: async () => {
        try {
          const { data } = await api.get('/settings');
          const settings = data.data as Array<{ key: string; value: string }>;
          const map: Record<string, string> = {};
          settings.forEach((s) => { map[s.key] = s.value; });
          set({
            currency: map.currency || 'USD',
            businessType: (map.businessType as BusinessType) || 'RESTAURANT',
            businessName: map.businessName || 'MyPOS Restaurant',
            taxRate: parseFloat(map.taxRate) || 8.5,
            taxInclusive: map.taxInclusive === 'true',
            loaded: true,
          });
        } catch {
          // Use defaults if settings can't be fetched
          set({ loaded: true });
        }
      },

      updateSettings: (updates) => set(updates),
    }),
    {
      name: 'mypos-settings',
      partialize: (state) => ({
        currency: state.currency,
        businessType: state.businessType,
        businessName: state.businessName,
        taxRate: state.taxRate,
        taxInclusive: state.taxInclusive,
      }),
    }
  )
);

// ─── Currency formatter bound to the store ─────────────────────────────
const localeMap: Record<string, string> = {
  USD: 'en-US', EUR: 'de-DE', GBP: 'en-GB', INR: 'en-IN',
  AED: 'ar-AE', SAR: 'ar-SA', JPY: 'ja-JP', CNY: 'zh-CN',
  AUD: 'en-AU', CAD: 'en-CA', BRL: 'pt-BR', MXN: 'es-MX',
};

// Exchange rates relative to USD (base currency in DB)
// Starts with fallback rates, updated from live API on load
let exchangeRates: Record<string, number> = {
  USD: 1, EUR: 0.92, GBP: 0.79, INR: 83.5, AED: 3.67, SAR: 3.75,
  JPY: 154.5, CNY: 7.24, AUD: 1.53, CAD: 1.36, BRL: 4.97, MXN: 17.2,
};
let ratesFetched = false;

// Fetch live rates from backend (which caches for 1 hour)
export async function fetchLiveRates() {
  if (ratesFetched) return;
  try {
    const res = await fetch('http://localhost:4000/api/exchange-rates');
    const data = await res.json();
    if (data.rates) {
      exchangeRates = data.rates;
      ratesFetched = true;
    }
  } catch {
    // Keep fallback rates
  }
}

// Kick off fetch immediately on module load
fetchLiveRates();

// All amounts in DB are stored in USD. This converts + formats to the selected currency.
export function formatCurrency(amount: number, currencyOverride?: string): string {
  const currency = currencyOverride || useSettingsStore.getState().currency;
  const locale = localeMap[currency] || 'en-US';
  const rate = exchangeRates[currency] || 1;
  const converted = amount * rate;
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(converted);
}

export function formatMultiCurrency(amount: number, secondaryCurrency?: string): string {
  const primary = formatCurrency(amount);
  if (!secondaryCurrency) return primary;
  const primaryCurrency = useSettingsStore.getState().currency;
  if (secondaryCurrency === primaryCurrency) return primary;
  const secondary = formatCurrency(amount, secondaryCurrency);
  return `${primary} (${secondary})`;
}

// ─── Business-type config ───────────────────────────────────────────────
export interface BusinessConfig {
  label: string;
  icon: string;
  hiddenRoutes: string[];        // routes to hide from nav
  renamedLabels: Record<string, string>; // route path → custom label
  orderTypes: string[];          // available order types
  features: {
    tables: boolean;
    kitchen: boolean;
    appointments: boolean;
    prescriptions: boolean;
  };
}

const businessConfigs: Record<BusinessType, BusinessConfig> = {
  RESTAURANT: {
    label: 'Restaurant', icon: '🍽️',
    hiddenRoutes: [],
    renamedLabels: {},
    orderTypes: ['DINE_IN', 'TAKEAWAY', 'DELIVERY', 'ONLINE'],
    features: { tables: true, kitchen: true, appointments: false, prescriptions: false },
  },
  CAFE: {
    label: 'Café', icon: '☕',
    hiddenRoutes: [],
    renamedLabels: { '/tables': 'Seating' },
    orderTypes: ['DINE_IN', 'TAKEAWAY', 'DELIVERY'],
    features: { tables: true, kitchen: true, appointments: false, prescriptions: false },
  },
  RETAIL: {
    label: 'Retail Store', icon: '🏪',
    hiddenRoutes: ['/tables', '/kitchen'],
    renamedLabels: { '/products': 'Merchandise', '/customers': 'Clients' },
    orderTypes: ['IN_STORE', 'ONLINE', 'PICKUP'],
    features: { tables: false, kitchen: false, appointments: false, prescriptions: false },
  },
  GROCERY: {
    label: 'Grocery', icon: '🛒',
    hiddenRoutes: ['/tables', '/kitchen'],
    renamedLabels: { '/products': 'Items', '/orders': 'Transactions' },
    orderTypes: ['IN_STORE', 'DELIVERY', 'PICKUP'],
    features: { tables: false, kitchen: false, appointments: false, prescriptions: false },
  },
  SALON: {
    label: 'Salon & Spa', icon: '💇',
    hiddenRoutes: ['/kitchen'],
    renamedLabels: { '/tables': 'Stations', '/products': 'Services', '/orders': 'Appointments' },
    orderTypes: ['WALK_IN', 'APPOINTMENT', 'ONLINE'],
    features: { tables: true, kitchen: false, appointments: true, prescriptions: false },
  },
  PHARMACY: {
    label: 'Pharmacy', icon: '💊',
    hiddenRoutes: ['/tables', '/kitchen'],
    renamedLabels: { '/products': 'Medications', '/customers': 'Patients' },
    orderTypes: ['IN_STORE', 'DELIVERY', 'PICKUP'],
    features: { tables: false, kitchen: false, appointments: false, prescriptions: true },
  },
  GENERAL: {
    label: 'General', icon: '🏢',
    hiddenRoutes: ['/tables', '/kitchen'],
    renamedLabels: {},
    orderTypes: ['IN_STORE', 'ONLINE', 'DELIVERY', 'PICKUP'],
    features: { tables: false, kitchen: false, appointments: false, prescriptions: false },
  },
};

export function getBusinessConfig(type?: BusinessType): BusinessConfig {
  return businessConfigs[type || useSettingsStore.getState().businessType] || businessConfigs.GENERAL;
}

/** Get the display label for a route path based on current business type */
export function getPageLabel(routePath: string, type?: BusinessType): string {
  const config = getBusinessConfig(type);
  return config.renamedLabels[routePath] || '';
}

/** Common label maps for pages to use */
const pageDefaults: Record<string, { title: string; subtitle: string }> = {
  '/products': { title: 'Products', subtitle: 'Manage your product catalog' },
  '/orders': { title: 'Orders', subtitle: 'Manage and track all orders' },
  '/tables': { title: 'Tables', subtitle: 'Manage table assignments and status' },
  '/customers': { title: 'Customers', subtitle: 'Manage customers & loyalty programs' },
};

export function getPageTitle(routePath: string, type?: BusinessType): { title: string; subtitle: string } {
  const config = getBusinessConfig(type);
  const defaults = pageDefaults[routePath] || { title: '', subtitle: '' };
  const label = config.renamedLabels[routePath];
  if (!label) return defaults;
  const subtitleMap: Record<string, string> = {
    'Services': 'Manage your services and pricing',
    'Appointments': 'Manage and track all appointments',
    'Stations': 'Manage station assignments and status',
    'Medications': 'Manage your medication inventory',
    'Items': 'Manage your item catalog',
    'Merchandise': 'Manage your merchandise catalog',
    'Transactions': 'Manage and track all transactions',
    'Seating': 'Manage seating assignments and status',
    'Clients': 'Manage clients & loyalty programs',
    'Patients': 'Manage patients & prescriptions',
  };
  return { title: label, subtitle: subtitleMap[label] || defaults.subtitle };
}

/** Singular/plural entity labels derived from business config */
const singularMap: Record<string, string> = {
  Services: 'Service', Appointments: 'Appointment', Stations: 'Station',
  Medications: 'Medication', Items: 'Item', Merchandise: 'Merchandise',
  Transactions: 'Transaction', Seating: 'Seating', Clients: 'Client',
  Patients: 'Patient', Products: 'Product', Orders: 'Order',
  Tables: 'Table', Customers: 'Customer',
};

export function getEntityLabels(type?: BusinessType) {
  const config = getBusinessConfig(type);
  const products = config.renamedLabels['/products'] || 'Products';
  const orders = config.renamedLabels['/orders'] || 'Orders';
  const tables = config.renamedLabels['/tables'] || 'Tables';
  const customers = config.renamedLabels['/customers'] || 'Customers';
  return {
    product: singularMap[products] || 'Product', products,
    order: singularMap[orders] || 'Order', orders,
    table: singularMap[tables] || 'Table', tables,
    customer: singularMap[customers] || 'Customer', customers,
  };
}
