import { useState } from 'react';
import { motion } from 'framer-motion';
import { Store, Printer, Globe, Palette, Bell, Shield, Database } from 'lucide-react';

const settingSections = [
  { id: 'business', icon: Store, label: 'Business' },
  { id: 'printing', icon: Printer, label: 'Printing' },
  { id: 'localization', icon: Globe, label: 'Localization' },
  { id: 'appearance', icon: Palette, label: 'Appearance' },
  { id: 'notifications', icon: Bell, label: 'Notifications' },
  { id: 'security', icon: Shield, label: 'Security' },
  { id: 'backup', icon: Database, label: 'Backup' },
];

export function SettingsPage() {
  const [activeSection, setActiveSection] = useState('business');

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-dark-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 mt-1">Configure your POS system</p>
      </div>

      <div className="flex gap-6">
        {/* Settings Nav */}
        <div className="w-56 shrink-0">
          <nav className="space-y-1">
            {settingSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeSection === section.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-800'
                }`}
              >
                <section.icon className="w-5 h-5" />
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 bg-white dark:bg-dark-800 rounded-2xl shadow-card p-6"
        >
          {activeSection === 'business' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-dark-900 dark:text-white">Business Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Business Name
                  </label>
                  <input
                    type="text"
                    defaultValue="MyPOS Restaurant"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Business Type
                  </label>
                  <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 text-sm">
                    <option>Restaurant</option>
                    <option>Retail Store</option>
                    <option>Grocery / Supermarket</option>
                    <option>Salon / Spa</option>
                    <option>Cafe / Bakery</option>
                    <option>Pharmacy</option>
                    <option>General Billing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Currency
                  </label>
                  <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 text-sm">
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                    <option>GBP (£)</option>
                    <option>INR (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Default Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    defaultValue="8.5"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-xl">
                <div>
                  <p className="font-medium text-dark-900 dark:text-white text-sm">Tax Included in Price</p>
                  <p className="text-xs text-gray-500 mt-0.5">Product prices already include tax</p>
                </div>
                <button className="w-11 h-6 bg-gray-200 dark:bg-dark-600 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 shadow-sm" />
                </button>
              </div>
              <button className="px-6 py-2.5 bg-primary text-white rounded-xl font-medium text-sm shadow-lg shadow-primary/25">
                Save Changes
              </button>
            </div>
          )}

          {activeSection === 'printing' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-dark-900 dark:text-white">Printing Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Receipt Paper Size
                  </label>
                  <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 text-sm">
                    <option>80mm</option>
                    <option>58mm</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Printer Type
                  </label>
                  <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 text-sm">
                    <option>USB Thermal Printer</option>
                    <option>Bluetooth Printer</option>
                    <option>Network Printer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Receipt Header
                  </label>
                  <input
                    type="text"
                    defaultValue="MyPOS Restaurant"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Receipt Footer
                  </label>
                  <input
                    type="text"
                    defaultValue="Thank you for your visit!"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                </div>
              </div>
              <button className="px-6 py-2.5 bg-primary text-white rounded-xl font-medium text-sm shadow-lg shadow-primary/25">
                Save Changes
              </button>
            </div>
          )}

          {activeSection !== 'business' && activeSection !== 'printing' && (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <p className="text-lg font-medium">Coming Soon</p>
              <p className="text-sm mt-1">This section is under development</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
