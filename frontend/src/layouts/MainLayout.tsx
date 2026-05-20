import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useSettingsStore, getBusinessConfig } from '../store/settingsStore';
import {
  LayoutDashboard,
  ShoppingCart,
  ClipboardList,
  UtensilsCrossed,
  Package,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ChefHat,
  Menu,
  X,
  UserCog,
  Warehouse,
  Search,
  Command,
  CalendarDays,
  Truck,
  DollarSign,
  Moon,
  Sun,
  Crown,
  Tag,
  Building2,
  ScrollText,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { NotificationCenter } from '../components/NotificationCenter';
import { CommandPalette } from '../components/CommandPalette';
import { useThemeStore } from '../store/themeStore';
import { useI18nStore } from '../store/i18nStore';

const allNavItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', i18nKey: 'dashboard', roles: [] },
  { to: '/pos', icon: ShoppingCart, label: 'POS', i18nKey: 'pos', roles: [] },
  { to: '/orders', icon: ClipboardList, label: 'Orders', i18nKey: 'orders', roles: [] },
  { to: '/tables', icon: UtensilsCrossed, label: 'Tables', i18nKey: 'tables', roles: [] },
  { to: '/kitchen', icon: ChefHat, label: 'Kitchen', i18nKey: 'kitchen', roles: [] },
  { to: '/products', icon: Package, label: 'Products', i18nKey: 'products', roles: [] },
  { to: '/customers', icon: Users, label: 'Customers', i18nKey: 'customers', roles: [] },
  { to: '/appointments', icon: CalendarDays, label: 'Appointments', i18nKey: 'appointments', roles: [] },
  { to: '/reports', icon: BarChart3, label: 'Reports', i18nKey: 'reports', roles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'ACCOUNTANT'] },
  { to: '/employees', icon: UserCog, label: 'Employees', i18nKey: 'employees', roles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER'] },
  { to: '/inventory', icon: Warehouse, label: 'Inventory', i18nKey: 'inventory', roles: [] },
  { to: '/suppliers', icon: Truck, label: 'Suppliers', i18nKey: 'suppliers', roles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER'] },
  { to: '/cash-drawer', icon: DollarSign, label: 'Cash Drawer', i18nKey: 'cashDrawer', roles: [] },
  { to: '/memberships', icon: Crown, label: 'Memberships', roles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER'] },
  { to: '/discounts', icon: Tag, label: 'Discounts', i18nKey: 'discount', roles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER'] },
  { to: '/branches', icon: Building2, label: 'Branches', roles: ['SUPER_ADMIN', 'ADMIN'] },
  { to: '/audit-log', icon: ScrollText, label: 'Audit Log', roles: ['SUPER_ADMIN', 'ADMIN'] },
  { to: '/settings', icon: Settings, label: 'Settings', i18nKey: 'settings', roles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER'] },
];

export function MainLayout() {
  const { user, logout } = useAuthStore();
  const businessType = useSettingsStore((s) => s.businessType);
  const businessName = useSettingsStore((s) => s.businessName);
  const currency = useSettingsStore((s) => s.currency);
  const { theme, setTheme } = useThemeStore();
  const t = useI18nStore((s) => s.t);
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = useMemo(() => {
    const config = getBusinessConfig(businessType);
    const userRole = user?.role || 'STAFF';
    return allNavItems
      .filter((item) => !config.hiddenRoutes.includes(item.to))
      .filter((item) => item.roles.length === 0 || item.roles.includes(userRole))
      .map((item) => ({
        ...item,
        label: config.renamedLabels[item.to] || (item.i18nKey ? t(item.i18nKey) : item.label),
      }));
  }, [businessType, user?.role, t]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-dark-950">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white dark:bg-dark-900 border-r border-gray-200 dark:border-dark-700 transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100 dark:border-dark-700">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-dark-900 dark:text-white truncate">
              {businessName || 'MyPOS'}
            </span>
            <button
              className="ml-auto lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Main navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary/10 text-primary dark:bg-primary/20'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-800'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-gray-100 dark:border-dark-700">
            <div className="flex items-center gap-3 px-3 py-2">
              <NavLink to="/profile" className="flex items-center gap-3 flex-1 min-w-0 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 p-1 -m-1 transition-colors">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={`${user.firstName} ${user.lastName}`} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm font-semibold text-primary">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user?.role}</p>
                </div>
              </NavLink>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800 text-gray-500"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center gap-4 px-4 py-3 bg-white dark:bg-dark-900 border-b border-gray-200 dark:border-dark-700">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-display font-bold text-lg lg:hidden">MyPOS</span>

          {/* Command palette trigger */}
          <button
            onClick={() => { const e = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }); window.dispatchEvent(e); }}
            className="hidden lg:flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl text-sm text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all flex-1 max-w-xs"
          >
            <Search className="w-4 h-4" />
            <span className="flex-1 text-left">Search or jump to...</span>
            <kbd className="flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
              <Command className="w-3 h-3" />K
            </kbd>
          </button>

          <div className="flex-1" />

          {/* Dark mode toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800 text-gray-500"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Notification Center */}
          <NotificationCenter />
        </header>

        {/* Page content with transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            className="flex-1 overflow-y-auto p-6"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            <Outlet key={`${businessType}-${currency}`} />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Command Palette */}
      <CommandPalette />
    </div>
  );
}
