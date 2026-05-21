import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Store, Printer, Globe, Palette, Bell, Shield, Save, Moon, Sun, Key, Receipt, Database, Download, Upload, Trash2, MessageSquare, Send, Phone, CheckCircle, XCircle, Mail, Tablet, Wifi, WifiOff, Monitor, RefreshCw, Usb, Zap } from 'lucide-react';
import { useSettings, useUpdateSetting, useChangePassword, useTaxes, useCreateTax, useUpdateTax, useDeleteTax, useBackups, useCreateBackup, useRestoreBackup, useDeleteBackup } from '../hooks/useApi';
import { api } from '../services/api';
import { useSettingsStore, type BusinessType } from '../store/settingsStore';
import { useThemeStore } from '../store/themeStore';
import { useI18nStore, localeNames, availableLocales } from '../store/i18nStore';
import toast from 'react-hot-toast';
import { Skeleton } from '../components/ui/Skeleton';

const sections = [
  { id: 'business', label: 'Business', icon: Store },
  { id: 'printing', label: 'Printing', icon: Printer },
  { id: 'localization', label: 'Localization', icon: Globe },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'taxes', label: 'Tax Rates', icon: Receipt },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'sms', label: 'SMS / Twilio', icon: MessageSquare },
  { id: 'devices', label: 'Devices', icon: Tablet },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'database', label: 'Database', icon: Database },
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
  const { theme, setTheme } = useThemeStore();
  const { locale, setLocale } = useI18nStore();
  const changePassword = useChangePassword();
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const { data: taxes } = useTaxes();
  const createTax = useCreateTax();
  const updateTax = useUpdateTax();
  const deleteTax = useDeleteTax();
  const [taxForm, setTaxForm] = useState({ name: '', rate: '' });

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
    <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-6rem)]">
      {/* Sidebar - horizontal scroll on mobile, vertical on desktop */}
      <div className="lg:w-56 lg:shrink-0">
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-4 lg:mb-6">Settings</h1>
        <nav className="flex lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0 lg:space-y-1">
          {sections.map(s => (
            <button key={s.id} onClick={() => setActiveSection(s.id)}
              className={`flex items-center gap-2 lg:gap-3 px-3 py-2 lg:py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap lg:w-full ${activeSection === s.id ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20' : 'text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
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
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Business Name</label>
                  <input value={getValue('businessName', 'MyPOS Restaurant')} onChange={e => setValue('businessName', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm dark:bg-gray-700 dark:border-gray-600" /></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Business Type</label>
                  <select value={getValue('businessType', 'RESTAURANT')} onChange={e => setValue('businessType', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm dark:bg-gray-700 dark:border-gray-600">
                    {['RESTAURANT', 'CAFE', 'RETAIL', 'GROCERY', 'SALON', 'PHARMACY', 'GENERAL'].map(t => <option key={t}>{t}</option>)}
                  </select></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Currency</label>
                  <select value={getValue('currency', 'USD')} onChange={e => setValue('currency', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm dark:bg-gray-700 dark:border-gray-600">
                    {[['USD', '$ USD — US Dollar'], ['EUR', '€ EUR — Euro'], ['GBP', '£ GBP — British Pound'], ['INR', '₹ INR — Indian Rupee'], ['AED', 'د.إ AED — UAE Dirham'], ['SAR', '﷼ SAR — Saudi Riyal'], ['JPY', '¥ JPY — Japanese Yen'], ['CAD', '$ CAD — Canadian Dollar'], ['AUD', '$ AUD — Australian Dollar'], ['BRL', 'R$ BRL — Brazilian Real'], ['MXN', '$ MXN — Mexican Peso'], ['CNY', '¥ CNY — Chinese Yuan']].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Default Tax Rate (%)</label>
                  <input type="number" step="0.1" value={getValue('taxRate', '8.5')} onChange={e => setValue('taxRate', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm dark:bg-gray-700 dark:border-gray-600" /></div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tax Included in Price</span>
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
                <h2 className="text-lg font-bold mb-4">Printing & Receipt Settings</h2>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Receipt Paper Size</label>
                  <select value={getValue('receiptPaperSize', '80mm')} onChange={e => setValue('receiptPaperSize', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm dark:bg-gray-700 dark:border-gray-600">
                    {['58mm', '80mm'].map(s => <option key={s}>{s}</option>)}
                  </select></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Printer Type</label>
                  <select value={getValue('printerType', 'thermal')} onChange={e => setValue('printerType', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm dark:bg-gray-700 dark:border-gray-600">
                    {['thermal', 'inkjet', 'laser'].map(t => <option key={t}>{t}</option>)}
                  </select></div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-3">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Receipt Customization</h3>
                  <div><label className="block text-xs text-gray-500 mb-1">Business Logo URL</label>
                    <input value={getValue('receiptLogo')} onChange={e => setValue('receiptLogo', e.target.value)} placeholder="https://example.com/logo.png"
                      className="w-full px-3 py-2 rounded-lg border text-sm dark:bg-gray-800 dark:border-gray-600" />
                    {getValue('receiptLogo') && <img src={getValue('receiptLogo')} alt="Logo preview" className="mt-2 h-12 object-contain" />}
                  </div>
                  <div><label className="block text-xs text-gray-500 mb-1">Receipt Header Text</label>
                    <textarea rows={2} value={getValue('receiptHeader')} onChange={e => setValue('receiptHeader', e.target.value)} placeholder="Your Business Name&#10;123 Main St, City"
                      className="w-full px-3 py-2 rounded-lg border text-sm dark:bg-gray-800 dark:border-gray-600" /></div>
                  <div><label className="block text-xs text-gray-500 mb-1">Receipt Footer Text</label>
                    <textarea rows={2} value={getValue('receiptFooter')} onChange={e => setValue('receiptFooter', e.target.value)} placeholder="Thank you for your visit!&#10;Visit us at www.example.com"
                      className="w-full px-3 py-2 rounded-lg border text-sm dark:bg-gray-800 dark:border-gray-600" /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="block text-xs text-gray-500 mb-1">Tax Label</label>
                      <input value={getValue('receiptTaxLabel', 'Tax')} onChange={e => setValue('receiptTaxLabel', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border text-sm dark:bg-gray-800 dark:border-gray-600" /></div>
                    <div><label className="block text-xs text-gray-500 mb-1">Currency Symbol Position</label>
                      <select value={getValue('currencyPosition', 'before')} onChange={e => setValue('currencyPosition', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border text-sm dark:bg-gray-800 dark:border-gray-600">
                        <option value="before">Before ($10)</option>
                        <option value="after">After (10$)</option>
                      </select></div>
                  </div>
                  <div className="flex items-center gap-3">
                    {['showLogo', 'showBarcode', 'showLoyaltyPoints'].map(key => (
                      <label key={key} className="flex items-center gap-1.5 text-xs">
                        <input type="checkbox" checked={getValue(key, 'true') === 'true'} onChange={e => setValue(key, e.target.checked ? 'true' : 'false')}
                          className="rounded border-gray-300" />
                        {key.replace('show', '').replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Thermal Printer / ESC/POS Configuration */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-3">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2"><Zap className="w-4 h-4 text-amber-500" /> Thermal Printer (ESC/POS)</h3>
                  <p className="text-xs text-gray-500">Connect a thermal receipt printer via USB (WebUSB) or network for direct ESC/POS printing.</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="block text-xs text-gray-500 mb-1">Connection Type</label>
                      <select value={getValue('thermalConnectionType', 'usb')} onChange={e => setValue('thermalConnectionType', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border text-sm dark:bg-gray-800 dark:border-gray-600">
                        <option value="usb">USB (WebUSB)</option>
                        <option value="network">Network (IP)</option>
                      </select></div>
                    <div><label className="block text-xs text-gray-500 mb-1">Paper Width</label>
                      <select value={getValue('thermalPaperWidth', '80')} onChange={e => setValue('thermalPaperWidth', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border text-sm dark:bg-gray-800 dark:border-gray-600">
                        <option value="58">58mm (2¼")</option>
                        <option value="80">80mm (3⅛")</option>
                      </select></div>
                  </div>
                  {getValue('thermalConnectionType', 'usb') === 'network' && (
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className="block text-xs text-gray-500 mb-1">Printer IP Address</label>
                        <input value={getValue('thermalNetworkHost')} onChange={e => setValue('thermalNetworkHost', e.target.value)} placeholder="192.168.1.100"
                          className="w-full px-3 py-2 rounded-lg border text-sm dark:bg-gray-800 dark:border-gray-600" /></div>
                      <div><label className="block text-xs text-gray-500 mb-1">Port</label>
                        <input value={getValue('thermalNetworkPort', '9100')} onChange={e => setValue('thermalNetworkPort', e.target.value)} placeholder="9100"
                          className="w-full px-3 py-2 rounded-lg border text-sm dark:bg-gray-800 dark:border-gray-600" /></div>
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-1.5 text-xs">
                      <input type="checkbox" checked={getValue('thermalAutoCut', 'true') === 'true'} onChange={e => setValue('thermalAutoCut', e.target.checked ? 'true' : 'false')} className="rounded border-gray-300" /> Auto-cut paper
                    </label>
                    <label className="flex items-center gap-1.5 text-xs">
                      <input type="checkbox" checked={getValue('thermalOpenDrawer', 'false') === 'true'} onChange={e => setValue('thermalOpenDrawer', e.target.checked ? 'true' : 'false')} className="rounded border-gray-300" /> Open cash drawer on print
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={async () => {
                      try {
                        const { connectUSBPrinter, buildTestPage, printViaUSB, printViaNetwork } = await import('../services/thermalPrinter');
                        const config = { type: getValue('thermalConnectionType', 'usb') as 'usb' | 'network', paperWidth: parseInt(getValue('thermalPaperWidth', '80')) as 58 | 80, autoCut: getValue('thermalAutoCut', 'true') === 'true', networkHost: getValue('thermalNetworkHost'), networkPort: parseInt(getValue('thermalNetworkPort', '9100')) };
                        const testData = buildTestPage(config);
                        if (config.type === 'usb') { await connectUSBPrinter(); await printViaUSB(testData); }
                        else { await printViaNetwork(testData, config.networkHost!, config.networkPort); }
                        toast.success('Test page sent to printer!');
                      } catch (err: any) { toast.error(err.message || 'Printer test failed'); }
                    }} className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700">
                      <Printer className="w-3 h-3" /> Test Print
                    </button>
                    {getValue('thermalConnectionType', 'usb') === 'usb' && (
                      <button onClick={async () => {
                        try {
                          const { connectUSBPrinter } = await import('../services/thermalPrinter');
                          await connectUSBPrinter();
                          toast.success('USB printer connected!');
                        } catch (err: any) { toast.error(err.message || 'USB connection failed'); }
                      }} className="flex items-center gap-2 px-3 py-2 bg-gray-200 dark:bg-gray-600 rounded-lg text-xs font-medium hover:bg-gray-300">
                        <Usb className="w-3 h-3" /> Connect USB Printer
                      </button>
                    )}
                  </div>
                </div>

                <button onClick={() => saveSection(['receiptPaperSize', 'printerType', 'receiptHeader', 'receiptFooter', 'receiptLogo', 'receiptTaxLabel', 'currencyPosition', 'showLogo', 'showBarcode', 'showLoyaltyPoints', 'thermalConnectionType', 'thermalPaperWidth', 'thermalNetworkHost', 'thermalNetworkPort', 'thermalAutoCut', 'thermalOpenDrawer'], 'printing')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700"><Save className="w-4 h-4" /> Save Changes</button>
              </div>
            )}

            {activeSection === 'localization' && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold mb-4">Localization</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Language</label>
                  <div className="grid grid-cols-2 gap-2">
                    {availableLocales.map(loc => (
                      <button key={loc} onClick={() => setLocale(loc)}
                        className={`px-4 py-3 rounded-xl text-sm font-medium text-left transition-all ${
                          locale === loc ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}>
                        {localeNames[loc]}
                      </button>
                    ))}
                  </div>
                </div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Timezone</label>
                  <select value={getValue('timezone', 'America/New_York')} onChange={e => setValue('timezone', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm">
                    {['America/New_York', 'America/Chicago', 'America/Los_Angeles', 'Europe/London', 'Asia/Dubai', 'Asia/Kolkata'].map(t => <option key={t}>{t}</option>)}
                  </select></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date Format</label>
                  <select value={getValue('dateFormat', 'MM/DD/YYYY')} onChange={e => setValue('dateFormat', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm dark:bg-gray-700 dark:border-gray-600">
                    {['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'].map(f => <option key={f}>{f}</option>)}
                  </select></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Secondary Currency (optional)</label>
                  <select value={getValue('secondaryCurrency', '')} onChange={e => setValue('secondaryCurrency', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm dark:bg-gray-700 dark:border-gray-600">
                    <option value="">None</option>
                    {[['USD', '$ USD'], ['EUR', '€ EUR'], ['GBP', '£ GBP'], ['INR', '₹ INR'], ['AED', 'د.إ AED'], ['SAR', '﷼ SAR'], ['JPY', '¥ JPY'], ['CAD', '$ CAD'], ['AUD', '$ AUD'], ['BRL', 'R$ BRL'], ['MXN', '$ MXN'], ['CNY', '¥ CNY']].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                  <p className="text-xs text-gray-400 mt-1">Show approximate equivalent in a secondary currency on prices</p>
                </div>
                <button onClick={() => saveSection(['language', 'timezone', 'dateFormat', 'secondaryCurrency'], 'localization')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700"><Save className="w-4 h-4" /> Save Changes</button>
              </div>
            )}

            {activeSection === 'appearance' && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold mb-4">Appearance</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Theme</label>
                  <div className="flex gap-3">
                    {[
                      { key: 'light' as const, label: 'Light', icon: Sun },
                      { key: 'dark' as const, label: 'Dark', icon: Moon },
                      { key: 'system' as const, label: 'System', icon: Palette },
                    ].map(t => (
                      <button key={t.key} onClick={() => setTheme(t.key)}
                        className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                          theme === t.key ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}>
                        <t.icon className={`w-6 h-6 ${theme === t.key ? 'text-blue-600' : 'text-gray-400'}`} />
                        <span className={`text-sm font-medium ${theme === t.key ? 'text-blue-600' : 'text-gray-600 dark:text-gray-400'}`}>{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Primary Color</label>
                  <input type="color" value={getValue('primaryColor', '#2563EB')} onChange={e => setValue('primaryColor', e.target.value)} className="w-full h-10 rounded-lg border cursor-pointer" /></div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Compact Mode</span>
                  <button onClick={() => setValue('compactMode', getValue('compactMode') === 'true' ? 'false' : 'true')}
                    className={`w-11 h-6 rounded-full transition-all ${getValue('compactMode') === 'true' ? 'bg-blue-600' : 'bg-gray-300'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-all ${getValue('compactMode') === 'true' ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>
                <button onClick={() => saveSection(['primaryColor', 'compactMode'], 'appearance')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700"><Save className="w-4 h-4" /> Save Changes</button>
              </div>
            )}

            {activeSection === 'taxes' && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold mb-4">Tax Rates</h2>
                <div className="flex gap-2 mb-4">
                  <input placeholder="Tax name (e.g. GST)" value={taxForm.name} onChange={e => setTaxForm({ ...taxForm, name: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-lg border text-sm dark:bg-gray-700 dark:border-gray-600" />
                  <input type="number" step="0.01" placeholder="Rate %" value={taxForm.rate} onChange={e => setTaxForm({ ...taxForm, rate: e.target.value })}
                    className="w-24 px-3 py-2 rounded-lg border text-sm dark:bg-gray-700 dark:border-gray-600" />
                  <button onClick={async () => {
                    if (!taxForm.name || !taxForm.rate) return;
                    try { await createTax.mutateAsync({ name: taxForm.name, rate: parseFloat(taxForm.rate) }); setTaxForm({ name: '', rate: '' }); toast.success('Tax created'); }
                    catch { toast.error('Failed'); }
                  }} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Add</button>
                </div>
                <div className="space-y-2">
                  {(taxes || []).map((tax: any) => (
                    <div key={tax.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 rounded-lg px-4 py-3">
                      <div>
                        <span className="text-sm font-medium">{tax.name}</span>
                        <span className="text-sm text-gray-500 ml-2">{tax.rate}%</span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={async () => { await updateTax.mutateAsync({ id: tax.id, isActive: !tax.isActive }); }}
                          className={`text-xs px-2 py-1 rounded ${tax.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                          {tax.isActive ? 'Active' : 'Inactive'}
                        </button>
                        <button onClick={async () => { await deleteTax.mutateAsync(tax.id); toast.success('Deleted'); }}
                          className="text-xs text-red-500 hover:text-red-700">Delete</button>
                      </div>
                    </div>
                  ))}
                  {(taxes || []).length === 0 && <p className="text-sm text-gray-400 text-center py-4">No tax rates configured</p>}
                </div>
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

            {activeSection === 'sms' && <SmsSection getValue={getValue} setValue={setValue} saveSection={saveSection} />}

            {activeSection === 'security' && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold mb-4">Security</h2>

                {/* Password Change */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><Key className="w-4 h-4" /> Change Password</h3>
                  <div className="space-y-2">
                    <input type="password" placeholder="Current Password" value={passwordForm.currentPassword}
                      onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border text-sm dark:bg-gray-800 dark:border-gray-600" />
                    <input type="password" placeholder="New Password (min 6 chars)" value={passwordForm.newPassword}
                      onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border text-sm dark:bg-gray-800 dark:border-gray-600" />
                    <input type="password" placeholder="Confirm New Password" value={passwordForm.confirmPassword}
                      onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border text-sm dark:bg-gray-800 dark:border-gray-600" />
                    <button onClick={async () => {
                      if (passwordForm.newPassword !== passwordForm.confirmPassword) return toast.error('Passwords do not match');
                      if (passwordForm.newPassword.length < 6) return toast.error('Password must be at least 6 characters');
                      try {
                        await changePassword.mutateAsync({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword });
                        toast.success('Password changed successfully');
                        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                      } catch { toast.error('Failed to change password'); }
                    }} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                      Change Password
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div><p className="text-sm font-medium text-gray-700 dark:text-gray-300">Two-Factor Authentication</p><p className="text-xs text-gray-500">Add an extra layer of security</p></div>
                  <button onClick={() => setValue('twoFactorEnabled', getValue('twoFactorEnabled') === 'true' ? 'false' : 'true')}
                    className={`w-11 h-6 rounded-full transition-all ${getValue('twoFactorEnabled') === 'true' ? 'bg-blue-600' : 'bg-gray-300'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-all ${getValue('twoFactorEnabled') === 'true' ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Session Timeout (minutes)</label>
                  <input type="number" value={getValue('sessionTimeout', '60')} onChange={e => setValue('sessionTimeout', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm dark:bg-gray-700 dark:border-gray-600" /></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Max Login Attempts</label>
                  <input type="number" value={getValue('maxLoginAttempts', '5')} onChange={e => setValue('maxLoginAttempts', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm dark:bg-gray-700 dark:border-gray-600" /></div>
                <button onClick={() => saveSection(['twoFactorEnabled', 'sessionTimeout', 'maxLoginAttempts'], 'security')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700"><Save className="w-4 h-4" /> Save Changes</button>
              </div>
            )}

            {activeSection === 'database' && <DatabaseSection />}
            {activeSection === 'devices' && <DevicesSection />}
          </motion.div>
        )}
      </div>
    </div>
  );
}

function DevicesSection() {
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [masterIp, setMasterIp] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [connecting, setConnecting] = useState(false);

  const fetchDeviceInfo = async () => {
    try {
      const res = await fetch('/api/devices/info');
      const data = await res.json();
      if (data.success) setDeviceInfo(data.data);
    } catch { /* public endpoint, ignore */ }
  };

  const fetchDevices = async () => {
    try {
      const { data } = await api.get('/devices');
      if (data.success) setDevices(data.data);
    } catch { /* ignore polling errors */ }
    setLoading(false);
  };

  useEffect(() => {
    fetchDeviceInfo();
    fetchDevices();
    const interval = setInterval(fetchDevices, 15000);
    return () => clearInterval(interval);
  }, []);

  const registerDevice = async () => {
    if (!deviceName.trim()) { toast.error('Enter a device name'); return; }
    setConnecting(true);
    try {
      const { data } = await api.post('/devices/register', { deviceName: deviceName.trim(), deviceType: 'tablet' });
      if (data.success) {
        toast.success(`Device "${deviceName}" registered!`);
        setDeviceName('');
        fetchDevices();
      } else {
        toast.error(data.error || 'Failed to register');
      }
    } catch { toast.error('Connection failed — check network'); }
    setConnecting(false);
  };

  const removeDevice = async (id: string) => {
    try {
      await api.delete(`/devices/${id}`);
      fetchDevices();
      toast.success('Device removed');
    } catch { toast.error('Failed to remove device'); }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold">Device Management</h2>
        <p className="text-xs text-gray-500 mt-1">Connect tablets and mobile devices to sync orders in real-time (Restaurant mode)</p>
      </div>

      {/* Master Device Info */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-5 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <Monitor className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-blue-900 dark:text-blue-100">This Device (Master)</p>
            <p className="text-xs text-blue-600 dark:text-blue-400">{deviceInfo?.hostname || 'Loading...'}</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <Wifi className="w-4 h-4 text-green-500" />
            <span className="text-xs font-medium text-green-600">Online</span>
          </div>
        </div>
        <div className="bg-white/70 dark:bg-gray-800/70 rounded-lg p-3 space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Master IP Address</span>
            <span className="font-mono font-bold text-blue-700 dark:text-blue-300">{deviceInfo?.ips?.join(', ') || '...'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Port</span>
            <span className="font-mono font-bold text-blue-700 dark:text-blue-300">{deviceInfo?.port || '4000'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Connected Devices</span>
            <span className="font-bold text-blue-700 dark:text-blue-300">{devices.filter(d => d.status === 'online').length}</span>
          </div>
        </div>
        <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-3">
          Share this IP address with tablet devices. They should open <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">http://{deviceInfo?.ips?.[0] || '...'}:{deviceInfo?.port || '4000'}</code> in their browser.
        </p>
      </div>

      {/* Register New Device */}
      <div className="border dark:border-gray-700 rounded-xl p-4 space-y-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Tablet className="w-4 h-4 text-purple-500" />
          Add New Device
        </h3>
        <p className="text-xs text-gray-500">Register a tablet or mobile device to allow order-taking by staff</p>
        <div className="flex gap-2">
          <input type="text" value={deviceName} onChange={e => setDeviceName(e.target.value)}
            placeholder="Device name (e.g. Tablet-1, Waiter-iPad)"
            className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm outline-none focus:ring-2 focus:ring-purple-500/20" />
          <button onClick={registerDevice} disabled={connecting || !deviceName.trim()}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl text-sm font-medium whitespace-nowrap flex items-center gap-2">
            {connecting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Tablet className="w-4 h-4" />}
            Register
          </button>
        </div>
      </div>

      {/* Client Connection Instructions */}
      <div className="border dark:border-gray-700 rounded-xl p-4 space-y-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Wifi className="w-4 h-4 text-green-500" />
          Connect Client Device
        </h3>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-2">
          <p className="text-xs text-gray-600 dark:text-gray-400"><strong>Step 1:</strong> Connect the tablet to the same Wi-Fi network as this POS</p>
          <p className="text-xs text-gray-600 dark:text-gray-400"><strong>Step 2:</strong> On the tablet, open browser and go to:</p>
          <div className="bg-white dark:bg-gray-900 rounded-lg px-3 py-2 font-mono text-sm text-center text-blue-600 dark:text-blue-400 border dark:border-gray-700">
            http://{deviceInfo?.ips?.[0] || '192.168.x.x'}:{deviceInfo?.port || '4000'}
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400"><strong>Step 3:</strong> Log in with staff credentials and start taking orders</p>
          <p className="text-xs text-gray-600 dark:text-gray-400"><strong>Step 4:</strong> Orders will sync automatically to this master device</p>
        </div>
        <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
          <Bell className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-700 dark:text-amber-300">All devices must be on the <strong>same local network</strong>. Orders, tables, and kitchen updates sync in real-time via WebSocket.</p>
        </div>
      </div>

      {/* Connected Devices List */}
      <div className="border dark:border-gray-700 rounded-xl overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Connected Devices ({devices.length})</h3>
          <button onClick={fetchDevices} className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
            <RefreshCw className="w-3 h-3" /> Refresh
          </button>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Loading devices...</div>
        ) : devices.length === 0 ? (
          <div className="p-8 text-center">
            <Tablet className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No devices connected yet</p>
            <p className="text-xs text-gray-400 mt-1">Register a device or connect a tablet using the IP above</p>
          </div>
        ) : (
          <div className="divide-y dark:divide-gray-700">
            {devices.map((device: any) => (
              <div key={device.id} className="px-4 py-3 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${device.status === 'online' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
                  <Tablet className={`w-4 h-4 ${device.status === 'online' ? 'text-green-600' : 'text-gray-400'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{device.name}</p>
                  <p className="text-xs text-gray-500">{device.ipAddress} • {device.deviceType || 'tablet'}{device.user ? ` • ${device.user}` : ''}</p>
                </div>
                <div className="flex items-center gap-2">
                  {device.status === 'online' ? (
                    <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                      <Wifi className="w-3 h-3" /> Online
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                      <WifiOff className="w-3 h-3" /> Offline
                    </span>
                  )}
                  <button onClick={() => removeDevice(device.id)}
                    className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Remove device">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DatabaseSection() {
  const { data: backups, isLoading } = useBackups();
  const createBackup = useCreateBackup();
  const restoreBackup = useRestoreBackup();
  const deleteBackup = useDeleteBackup();

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold mb-4">Database Management</h2>
      <div className="flex gap-2">
        <button onClick={() => createBackup.mutateAsync().then(() => toast.success('Backup created')).catch(() => toast.error('Backup failed'))}
          disabled={createBackup.isPending}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl text-sm hover:bg-green-700 disabled:opacity-50">
          <Download className="w-4 h-4" /> {createBackup.isPending ? 'Creating...' : 'Create Backup'}
        </button>
        <a href={`${(window as any).__API_URL || 'http://localhost:4000/api'}/backups/export`} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700">
          <Upload className="w-4 h-4" /> Export Database
        </a>
      </div>

      {isLoading ? (
        <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-16 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse" />)}</div>
      ) : (backups as any[])?.length === 0 ? (
        <p className="text-sm text-gray-500 py-8 text-center">No backups yet. Create your first backup above.</p>
      ) : (
        <div className="space-y-2">
          {(backups as any[])?.map((b: any) => (
            <div key={b.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div>
                <p className="text-sm font-medium">{b.name}</p>
                <p className="text-xs text-gray-500">{formatSize(b.size)} · {new Date(b.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { if (confirm('Restore this backup? Current data will be backed up automatically.')) restoreBackup.mutateAsync(b.name).then(() => toast.success('Restored! Restart server to apply.')).catch(() => toast.error('Restore failed')); }}
                  className="px-3 py-1.5 text-xs bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200">
                  Restore
                </button>
                <button onClick={() => { if (confirm('Delete this backup?')) deleteBackup.mutateAsync(b.name); }}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SmsSection({ getValue, setValue, saveSection }: {
  getValue: (key: string, fallback?: string) => string;
  setValue: (key: string, value: string) => void;
  saveSection: (keys: string[], group: string) => Promise<void>;
}) {
  const [testPhone, setTestPhone] = useState('');
  const [testEmail, setTestEmail] = useState('');
  const [smsTestStatus, setSmsTestStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [emailTestStatus, setEmailTestStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [smsTestError, setSmsTestError] = useState('');
  const [emailTestError, setEmailTestError] = useState('');
  const smsEnabled = getValue('smsEnabled') === 'true';
  const emailEnabled = getValue('emailEnabled') === 'true';

  const getAuthHeader = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('auth-storage') || '{}')?.state?.accessToken || ''}`,
  });

  const sendTestSms = async () => {
    if (!testPhone) { toast.error('Enter a phone number'); return; }
    setSmsTestStatus('sending');
    setSmsTestError('');
    try {
      const response = await fetch('/api/sms/test', { method: 'POST', headers: getAuthHeader(), body: JSON.stringify({ to: testPhone }) });
      const data = await response.json();
      if (data.success) { setSmsTestStatus('success'); toast.success('Test SMS sent!'); }
      else { setSmsTestStatus('error'); setSmsTestError(data.error || 'Failed'); toast.error(data.error || 'Failed'); }
    } catch { setSmsTestStatus('error'); setSmsTestError('Network error'); toast.error('Failed to send test SMS'); }
  };

  const sendTestEmail = async () => {
    if (!testEmail) { toast.error('Enter an email address'); return; }
    setEmailTestStatus('sending');
    setEmailTestError('');
    try {
      const response = await fetch('/api/receipt/test-email', { method: 'POST', headers: getAuthHeader(), body: JSON.stringify({ to: testEmail }) });
      const data = await response.json();
      if (data.success) { setEmailTestStatus('success'); toast.success('Test email sent!'); }
      else { setEmailTestStatus('error'); setEmailTestError(data.error || 'Failed'); toast.error(data.error || 'Failed'); }
    } catch { setEmailTestStatus('error'); setEmailTestError('Network error'); toast.error('Failed to send test email'); }
  };

  const smsTemplates = [
    { id: '1', preview: 'Hi {customerName}, your order #{orderNumber} at {businessName} is confirmed! Total: {total}. Thank you for choosing us!' },
    { id: '2', preview: '{businessName} — Order #{orderNumber} placed successfully. Amount: {total}. We appreciate your business, {customerName}!' },
    { id: '3', preview: 'Thank you {customerName}! 🎉 Your {businessName} order #{orderNumber} ({total}) has been received. See you again soon!' },
    { id: '4', preview: '{businessName} Receipt: Order #{orderNumber} | Total: {total} | Customer: {customerName}. Thank you for your purchase!' },
  ];

  return (
    <div className="space-y-5">
      {/* ── SMS / Twilio Toggle ── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">SMS & Email Notifications</h2>
          <p className="text-xs text-gray-500 mt-1">Configure SMS via Twilio and email notifications</p>
        </div>
      </div>

      {/* SMS Enable */}
      <div className="flex items-center justify-between py-2 bg-gray-50 dark:bg-gray-700/50 rounded-xl px-4">
        <div className="flex items-center gap-3">
          <Phone className="w-5 h-5 text-green-500" />
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">SMS Service (Twilio)</p>
            <p className="text-xs text-gray-500">Send SMS notifications on checkout</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium ${smsEnabled ? 'text-green-600' : 'text-gray-400'}`}>{smsEnabled ? 'On' : 'Off'}</span>
          <button onClick={() => setValue('smsEnabled', smsEnabled ? 'false' : 'true')}
            className={`w-11 h-6 rounded-full transition-all ${smsEnabled ? 'bg-green-500' : 'bg-gray-300'}`}>
            <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-all ${smsEnabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
        </div>
      </div>

      {/* Email Enable */}
      <div className="flex items-center justify-between py-2 bg-gray-50 dark:bg-gray-700/50 rounded-xl px-4">
        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-blue-500" />
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Service</p>
            <p className="text-xs text-gray-500">Send receipt emails on checkout</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium ${emailEnabled ? 'text-blue-600' : 'text-gray-400'}`}>{emailEnabled ? 'On' : 'Off'}</span>
          <button onClick={() => setValue('emailEnabled', emailEnabled ? 'false' : 'true')}
            className={`w-11 h-6 rounded-full transition-all ${emailEnabled ? 'bg-blue-500' : 'bg-gray-300'}`}>
            <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-all ${emailEnabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
        </div>
      </div>

      {/* ── Twilio Credentials ── */}
      <div className={`space-y-3 ${!smsEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Twilio Configuration</p>
              <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-1">
                Enter your Twilio credentials. Find them in your{' '}
                <a href="https://console.twilio.com" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">Twilio Console</a>.
              </p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Account SID</label>
          <input type="text" value={getValue('twilioAccountSid')} onChange={e => setValue('twilioAccountSid', e.target.value)}
            placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" className="w-full px-3 py-2 rounded-lg border text-sm dark:bg-gray-700 dark:border-gray-600 font-mono" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Auth Token</label>
          <input type="password" value={getValue('twilioAuthToken')} onChange={e => setValue('twilioAuthToken', e.target.value)}
            placeholder="••••••••••••••••••••••••••••••••" className="w-full px-3 py-2 rounded-lg border text-sm dark:bg-gray-700 dark:border-gray-600 font-mono" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Twilio Phone Number</label>
          <input type="text" value={getValue('twilioPhoneNumber')} onChange={e => setValue('twilioPhoneNumber', e.target.value)}
            placeholder="+1234567890" className="w-full px-3 py-2 rounded-lg border text-sm dark:bg-gray-700 dark:border-gray-600 font-mono" />
        </div>
      </div>

      {/* ── Email Provider Configuration ── */}
      <div className={`space-y-3 ${!emailEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-purple-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Email Configuration</p>
              <p className="text-xs text-purple-600/70 dark:text-purple-400/70 mt-1">
                Use <strong>Resend</strong> (easiest — 100 emails/day free, no domain verification needed),{' '}
                <strong>SendGrid</strong>, or your own SMTP server.
              </p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Provider</label>
          <select value={getValue('emailProvider', 'resend')} onChange={e => setValue('emailProvider', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border text-sm dark:bg-gray-700 dark:border-gray-600">
            <option value="resend">Resend (Recommended — easiest setup)</option>
            <option value="sendgrid">SendGrid</option>
            <option value="gmail">Gmail (easiest — no domain needed)</option>
            <option value="smtp">Custom SMTP</option>
          </select>
        </div>

        {getValue('emailProvider', 'resend') === 'resend' ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Resend API Key</label>
            <input type="password" value={getValue('resendApiKey')} onChange={e => setValue('resendApiKey', e.target.value)}
              placeholder="re_xxxxxxxxxxxxxxxxxxxx" className="w-full px-3 py-2 rounded-lg border text-sm dark:bg-gray-700 dark:border-gray-600 font-mono" />
            <p className="text-xs text-gray-400 mt-1">
              Sign up free at <a href="https://resend.com/signup" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">resend.com</a> → API Keys → Create.
            </p>
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 mt-2">
              <p className="text-xs text-amber-700 dark:text-amber-300">
                <strong>Note:</strong> Without a verified domain, Resend only sends to your own email. Use <strong>Gmail</strong> provider to send to any address.
              </p>
            </div>
          </div>
        ) : getValue('emailProvider', 'resend') === 'sendgrid' ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">SendGrid API Key</label>
            <input type="password" value={getValue('sendgridApiKey')} onChange={e => setValue('sendgridApiKey', e.target.value)}
              placeholder="SG.xxxxxxxxxxxxxxxxxxxx" className="w-full px-3 py-2 rounded-lg border text-sm dark:bg-gray-700 dark:border-gray-600 font-mono" />
            <p className="text-xs text-gray-400 mt-1">Go to <a href="https://app.sendgrid.com/settings/api_keys" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">SendGrid → API Keys</a> → Create API Key → Full Access</p>
          </div>
        ) : getValue('emailProvider', 'resend') === 'gmail' ? (
          <div className="space-y-3">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                <strong>Setup:</strong> Go to{' '}
                <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer" className="underline">Google App Passwords</a>
                {' '}→ Create one for "MyPOS" → paste below. Requires 2-Step Verification enabled.
              </p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Gmail Address</label>
              <input type="email" value={getValue('smtpUser')} onChange={e => { setValue('smtpUser', e.target.value); setValue('senderEmail', e.target.value); setValue('smtpHost', 'smtp.gmail.com'); setValue('smtpPort', '587'); }}
                placeholder="your@gmail.com" className="w-full px-3 py-2 rounded-lg border text-sm dark:bg-gray-700 dark:border-gray-600" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">App Password</label>
              <input type="password" value={getValue('smtpPass')} onChange={e => setValue('smtpPass', e.target.value)}
                placeholder="xxxx xxxx xxxx xxxx" className="w-full px-3 py-2 rounded-lg border text-sm dark:bg-gray-700 dark:border-gray-600 font-mono" />
              <p className="text-xs text-gray-400 mt-1">16-character app password from Google (not your regular Gmail password)</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">SMTP Host</label>
                <input type="text" value={getValue('smtpHost')} onChange={e => setValue('smtpHost', e.target.value)}
                  placeholder="smtp.gmail.com" className="w-full px-3 py-2 rounded-lg border text-sm dark:bg-gray-700 dark:border-gray-600" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">SMTP Port</label>
                <input type="number" value={getValue('smtpPort', '587')} onChange={e => setValue('smtpPort', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border text-sm dark:bg-gray-700 dark:border-gray-600" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">SMTP Username</label>
                <input type="text" value={getValue('smtpUser')} onChange={e => setValue('smtpUser', e.target.value)}
                  placeholder="your@email.com" className="w-full px-3 py-2 rounded-lg border text-sm dark:bg-gray-700 dark:border-gray-600" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">SMTP Password</label>
                <input type="password" value={getValue('smtpPass')} onChange={e => setValue('smtpPass', e.target.value)}
                  placeholder="••••••••" className="w-full px-3 py-2 rounded-lg border text-sm dark:bg-gray-700 dark:border-gray-600" />
              </div>
            </div>
          </>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sender Name</label>
            <input type="text" value={getValue('senderName', 'MyPOS')} onChange={e => setValue('senderName', e.target.value)}
              placeholder="MyPOS" className="w-full px-3 py-2 rounded-lg border text-sm dark:bg-gray-700 dark:border-gray-600" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sender Email</label>
            <input type="email" value={getValue('senderEmail')} onChange={e => setValue('senderEmail', e.target.value)}
              placeholder="noreply@yourdomain.com" className="w-full px-3 py-2 rounded-lg border text-sm dark:bg-gray-700 dark:border-gray-600" />
          </div>
        </div>
      </div>

      {/* ── SMS Receipt Templates ── */}
      <div className={`border-t pt-4 dark:border-gray-700 ${!smsEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">SMS Receipt Template</h3>
        <p className="text-xs text-gray-500 mb-3">Choose which SMS template to send with order receipts. Variables: {'{orderNumber}'} (mandatory), {'{customerName}'}, {'{total}'}, {'{businessName}'}</p>
        <div className="space-y-2">
          {smsTemplates.map(t => (
            <label key={t.id} className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
              getValue('smsReceiptTemplate', '1') === t.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-500'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}>
              <input type="radio" name="smsTemplate" value={t.id}
                checked={getValue('smsReceiptTemplate', '1') === t.id}
                onChange={() => setValue('smsReceiptTemplate', t.id)}
                className="mt-1 accent-blue-600" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Template {t.id}</p>
                <p className="text-sm text-gray-800 dark:text-gray-200 break-words">{t.preview}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* ── Test SMS & Email ── */}
      <div className="border-t pt-4 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Test Notifications</h3>

        {/* Test SMS */}
        <div className={`mb-4 ${!smsEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Test SMS</label>
          <div className="flex gap-2">
            <input type="tel" value={testPhone} onChange={e => setTestPhone(e.target.value)} placeholder="+1234567890"
              className="flex-1 px-3 py-2 rounded-lg border text-sm dark:bg-gray-700 dark:border-gray-600 font-mono" />
            <button onClick={sendTestSms} disabled={smsTestStatus === 'sending'}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:opacity-50 whitespace-nowrap">
              {smsTestStatus === 'sending' ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</> : <><Send className="w-4 h-4" /> Send SMS</>}
            </button>
          </div>
          {smsTestStatus === 'success' && <div className="flex items-center gap-2 mt-1.5 text-green-600 text-xs"><CheckCircle className="w-3.5 h-3.5" /> Test SMS sent!</div>}
          {smsTestStatus === 'error' && <div className="flex items-center gap-2 mt-1.5 text-red-500 text-xs"><XCircle className="w-3.5 h-3.5" /> {smsTestError}</div>}
        </div>

        {/* Test Email */}
        <div className={`${!emailEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Test Email</label>
          <div className="flex gap-2">
            <input type="email" value={testEmail} onChange={e => setTestEmail(e.target.value)} placeholder="test@example.com"
              className="flex-1 px-3 py-2 rounded-lg border text-sm dark:bg-gray-700 dark:border-gray-600" />
            <button onClick={sendTestEmail} disabled={emailTestStatus === 'sending'}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 whitespace-nowrap">
              {emailTestStatus === 'sending' ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</> : <><Mail className="w-4 h-4" /> Send Email</>}
            </button>
          </div>
          {emailTestStatus === 'success' && <div className="flex items-center gap-2 mt-1.5 text-green-600 text-xs"><CheckCircle className="w-3.5 h-3.5" /> Test email sent!</div>}
          {emailTestStatus === 'error' && <div className="flex items-center gap-2 mt-1.5 text-red-500 text-xs"><XCircle className="w-3.5 h-3.5" /> {emailTestError}</div>}
        </div>
      </div>

      <button
        onClick={() => saveSection([
          'smsEnabled', 'emailEnabled',
          'twilioAccountSid', 'twilioAuthToken', 'twilioPhoneNumber',
          'emailProvider', 'resendApiKey', 'sendgridApiKey', 'senderEmail', 'senderName',
          'smtpHost', 'smtpPort', 'smtpUser', 'smtpPass',
          'smsReceiptTemplate',
        ], 'sms')}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700"
      >
        <Save className="w-4 h-4" /> Save Settings
      </button>
    </div>
  );
}
