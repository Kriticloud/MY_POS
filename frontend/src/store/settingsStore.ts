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

export function formatCurrency(amount: number, currencyOverride?: string): string {
  const currency = currencyOverride || useSettingsStore.getState().currency;
  const locale = localeMap[currency] || 'en-US';
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
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
  };
  return { title: label, subtitle: subtitleMap[label] || defaults.subtitle };
}
