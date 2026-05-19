import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Store, Printer, Globe, Palette, Bell, Shield, Save } from 'lucide-react';
import { useSettings, useUpdateSetting } from '../hooks/useApi';
import { useSettingsStore, type BusinessType } from '../store/settingsStore';
import toast from 'react-hot-toast';
import { Skeleton } from '../components/ui/Skeleton';

const sections = [
  { id: 'business', label: 'Business', icon: Store },
  { id: 'printing', label: 'Printing', icon: Printer },
  { id: 'localization', label: 'Localization', icon: Globe },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
];

export function SettingsPage() {
  const [activeSection, setActiveSection] = useState('business');
  const { data: settings, isLoading } = useSettings();
  const updateSetting = useUpdateSetting();
  const [form, setForm] = useState<Record<string, string>>({});

  useEffect(() => {
    if (settings) {
      const map: Record<string, string> = {};
      (settings as any[]).forEach((s: any) => { map[s.key] = s.value; });
      setForm(map);
    }
  }, [settings]);

  const getValue = (key: string, fallback = '') => form[key] ?? fallback;
  const setValue = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));
  const updateGlobalSettings = useSettingsStore((s) => s.updateSettings);

  const saveSection = async (keys: string[], group: string) => {
    try {
      // Capture current form values before any async operations
      // to avoid race condition where invalidateQueries refetches and resets the form mid-save
      const snapshot = { ...form };
      for (const key of keys) {
        if (snapshot[key] !== undefined) await updateSetting.mutateAsync({ key, value: snapshot[key], group });
      }
      // Sync business settings to global store immediately
      if (group === 'business') {
        updateGlobalSettings({
          currency: snapshot.currency || 'USD',
          businessType: (snapshot.businessType as BusinessType) || 'RESTAURANT',
          businessName: snapshot.businessName || 'MyPOS',
          taxRate: parseFloat(snapshot.taxRate) || 8.5,
          taxInclusive: snapshot.taxInclusive === 'true',
        });
      }
      toast.success('Settings saved — changes applied across the app');
    } catch { toast.error('Failed to save settings'); }
  };

  return (
    <div className="flex gap-6 min-h-[calc(100vh-6rem)]">
      {/* Sidebar */}
      <div className="w-56 shrink-0">
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6">Settings</h1>
        <nav className="space-y-1">
          {sections.map(s => (
            <button key={s.id} onClick={() => setActiveSection(s.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeSection === s.id ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20' : 'text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
              <s.icon className="w-4 h-4" /> {s.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1">
        {isLoading ? <Skeleton className="h-60 w-full" /> : (
          <motion.div key={activeSection} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6 max-w-2xl">

            {activeSection === 'business' && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold mb-4">Business Settings</h2>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                  <input value={getValue('businessName', 'MyPOS Restaurant')} onChange={e => setValue('businessName', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
                  <select value={getValue('businessType', 'RESTAURANT')} onChange={e => setValue('businessType', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm">
                    {['RESTAURANT', 'CAFE', 'RETAIL', 'GROCERY', 'SALON', 'PHARMACY', 'GENERAL'].map(t => <option key={t}>{t}</option>)}
                  </select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                  <select value={getValue('currency', 'USD')} onChange={e => setValue('currency', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm">
                    {[['USD', '$ USD — US Dollar'], ['EUR', '€ EUR — Euro'], ['GBP', '£ GBP — British Pound'], ['INR', '₹ INR — Indian Rupee'], ['AED', 'د.إ AED — UAE Dirham'], ['SAR', '﷼ SAR — Saudi Riyal'], ['JPY', '¥ JPY — Japanese Yen'], ['CAD', '$ CAD — Canadian Dollar'], ['AUD', '$ AUD — Australian Dollar'], ['BRL', 'R$ BRL — Brazilian Real'], ['MXN', '$ MXN — Mexican Peso'], ['CNY', '¥ CNY — Chinese Yuan']].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Default Tax Rate (%)</label>
                  <input type="number" step="0.1" value={getValue('taxRate', '8.5')} onChange={e => setValue('taxRate', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Tax Included in Price</span>
                  <button onClick={() => setValue('taxInclusive', getValue('taxInclusive') === 'true' ? 'false' : 'true')}
                    className={`w-11 h-6 rounded-full transition-all ${getValue('taxInclusive') === 'true' ? 'bg-blue-600' : 'bg-gray-300'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-all ${getValue('taxInclusive') === 'true' ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>
                <button onClick={() => saveSection(['businessName', 'businessType', 'currency', 'taxRate', 'taxInclusive'], 'business')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700"><Save className="w-4 h-4" /> Save Changes</button>
              </div>
            )}

            {activeSection === 'printing' && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold mb-4">Printing Settings</h2>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Receipt Paper Size</label>
                  <select value={getValue('receiptPaperSize', '80mm')} onChange={e => setValue('receiptPaperSize', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm">
                    {['58mm', '80mm'].map(s => <option key={s}>{s}</option>)}
                  </select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Printer Type</label>
                  <select value={getValue('printerType', 'thermal')} onChange={e => setValue('printerType', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm">
                    {['thermal', 'inkjet', 'laser'].map(t => <option key={t}>{t}</option>)}
                  </select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Receipt Header</label>
                  <input value={getValue('receiptHeader')} onChange={e => setValue('receiptHeader', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Receipt Footer</label>
                  <input value={getValue('receiptFooter')} onChange={e => setValue('receiptFooter', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
                <button onClick={() => saveSection(['receiptPaperSize', 'printerType', 'receiptHeader', 'receiptFooter'], 'printing')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700"><Save className="w-4 h-4" /> Save Changes</button>
              </div>
            )}

            {activeSection === 'localization' && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold mb-4">Localization</h2>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                  <select value={getValue('language', 'en')} onChange={e => setValue('language', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm">
                    {[['en', 'English'], ['es', 'Spanish'], ['fr', 'French'], ['ar', 'Arabic'], ['hi', 'Hindi']].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                  <select value={getValue('timezone', 'America/New_York')} onChange={e => setValue('timezone', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm">
                    {['America/New_York', 'America/Chicago', 'America/Los_Angeles', 'Europe/London', 'Asia/Dubai', 'Asia/Kolkata'].map(t => <option key={t}>{t}</option>)}
                  </select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Date Format</label>
                  <select value={getValue('dateFormat', 'MM/DD/YYYY')} onChange={e => setValue('dateFormat', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm">
                    {['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'].map(f => <option key={f}>{f}</option>)}
                  </select></div>
                <button onClick={() => saveSection(['language', 'timezone', 'dateFormat'], 'localization')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700"><Save className="w-4 h-4" /> Save Changes</button>
              </div>
            )}

            {activeSection === 'appearance' && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold mb-4">Appearance</h2>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
                  <select value={getValue('theme', 'light')} onChange={e => setValue('theme', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm">
                    {['light', 'dark', 'system'].map(t => <option key={t}>{t}</option>)}
                  </select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
                  <input type="color" value={getValue('primaryColor', '#2563EB')} onChange={e => setValue('primaryColor', e.target.value)} className="w-full h-10 rounded-lg border cursor-pointer" /></div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Compact Mode</span>
                  <button onClick={() => setValue('compactMode', getValue('compactMode') === 'true' ? 'false' : 'true')}
                    className={`w-11 h-6 rounded-full transition-all ${getValue('compactMode') === 'true' ? 'bg-blue-600' : 'bg-gray-300'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-all ${getValue('compactMode') === 'true' ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>
                <button onClick={() => saveSection(['theme', 'primaryColor', 'compactMode'], 'appearance')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700"><Save className="w-4 h-4" /> Save Changes</button>
              </div>
            )}

            {activeSection === 'notifications' && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold mb-4">Notifications</h2>
                {[['orderAlerts', 'New Order Alerts'], ['kitchenAlerts', 'Kitchen Ready Alerts'], ['lowStockAlerts', 'Low Stock Alerts'], ['soundEnabled', 'Sound Notifications']].map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between py-2">
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                    <button onClick={() => setValue(key, getValue(key, 'true') === 'true' ? 'false' : 'true')}
                      className={`w-11 h-6 rounded-full transition-all ${getValue(key, 'true') === 'true' ? 'bg-blue-600' : 'bg-gray-300'}`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-all ${getValue(key, 'true') === 'true' ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                ))}
                <button onClick={() => saveSection(['orderAlerts', 'kitchenAlerts', 'lowStockAlerts', 'soundEnabled'], 'notifications')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700"><Save className="w-4 h-4" /> Save Changes</button>
              </div>
            )}

            {activeSection === 'security' && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold mb-4">Security</h2>
                <div className="flex items-center justify-between py-2">
                  <div><p className="text-sm font-medium text-gray-700">Two-Factor Authentication</p><p className="text-xs text-gray-500">Add an extra layer of security</p></div>
                  <button onClick={() => setValue('twoFactorEnabled', getValue('twoFactorEnabled') === 'true' ? 'false' : 'true')}
                    className={`w-11 h-6 rounded-full transition-all ${getValue('twoFactorEnabled') === 'true' ? 'bg-blue-600' : 'bg-gray-300'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-all ${getValue('twoFactorEnabled') === 'true' ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Session Timeout (minutes)</label>
                  <input type="number" value={getValue('sessionTimeout', '60')} onChange={e => setValue('sessionTimeout', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Max Login Attempts</label>
                  <input type="number" value={getValue('maxLoginAttempts', '5')} onChange={e => setValue('maxLoginAttempts', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
                <button onClick={() => saveSection(['twoFactorEnabled', 'sessionTimeout', 'maxLoginAttempts'], 'security')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700"><Save className="w-4 h-4" /> Save Changes</button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
