import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search, LayoutDashboard, ShoppingCart, ClipboardList, UtensilsCrossed,
  Package, Users, BarChart3, Settings, ChefHat, UserCog, Warehouse,
  Command, ArrowRight, Keyboard,
} from 'lucide-react';

interface CommandItem {
  id: string;
  label: string;
  category: string;
  icon: React.ElementType;
  action: () => void;
  shortcut?: string;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  const commands: CommandItem[] = useMemo(() => [
    { id: 'nav-dashboard', label: 'Go to Dashboard', category: 'Navigation', icon: LayoutDashboard, action: () => navigate('/dashboard'), shortcut: 'D' },
    { id: 'nav-pos', label: 'Go to POS', category: 'Navigation', icon: ShoppingCart, action: () => navigate('/pos'), shortcut: 'P' },
    { id: 'nav-orders', label: 'Go to Orders', category: 'Navigation', icon: ClipboardList, action: () => navigate('/orders'), shortcut: 'O' },
    { id: 'nav-tables', label: 'Go to Tables', category: 'Navigation', icon: UtensilsCrossed, action: () => navigate('/tables') },
    { id: 'nav-kitchen', label: 'Go to Kitchen', category: 'Navigation', icon: ChefHat, action: () => navigate('/kitchen') },
    { id: 'nav-products', label: 'Go to Products', category: 'Navigation', icon: Package, action: () => navigate('/products') },
    { id: 'nav-customers', label: 'Go to Customers', category: 'Navigation', icon: Users, action: () => navigate('/customers') },
    { id: 'nav-reports', label: 'Go to Reports', category: 'Navigation', icon: BarChart3, action: () => navigate('/reports') },
    { id: 'nav-employees', label: 'Go to Employees', category: 'Navigation', icon: UserCog, action: () => navigate('/employees') },
    { id: 'nav-inventory', label: 'Go to Inventory', category: 'Navigation', icon: Warehouse, action: () => navigate('/inventory') },
    { id: 'nav-settings', label: 'Go to Settings', category: 'Navigation', icon: Settings, action: () => navigate('/settings') },
    { id: 'action-new-order', label: 'New Order', category: 'Actions', icon: ShoppingCart, action: () => navigate('/pos'), shortcut: 'N' },
    { id: 'action-view-reports', label: 'View Reports', category: 'Actions', icon: BarChart3, action: () => navigate('/reports') },
  ], [navigate]);

  const filtered = useMemo(() => {
    if (!query) return commands;
    const q = query.toLowerCase();
    return commands.filter(c => c.label.toLowerCase().includes(q) || c.category.toLowerCase().includes(q));
  }, [query, commands]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const execute = useCallback((cmd: CommandItem) => {
    cmd.action();
    setOpen(false);
    setQuery('');
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setOpen(false);
        setQuery('');
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(i => Math.max(i - 1, 0));
      } else if (e.key === 'Enter' && filtered[selectedIndex]) {
        e.preventDefault();
        execute(filtered[selectedIndex]);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, filtered, selectedIndex, execute]);

  const grouped = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    filtered.forEach(cmd => {
      if (!groups[cmd.category]) groups[cmd.category] = [];
      groups[cmd.category].push(cmd);
    });
    return groups;
  }, [filtered]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]"
          onClick={() => { setOpen(false); setQuery(''); }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 400 }}
            className="relative w-full max-w-lg mx-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
            onClick={e => e.stopPropagation()}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100 dark:border-gray-700">
              <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Type a command or search..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm text-gray-900 dark:text-white placeholder:text-gray-400"
                autoFocus
              />
              <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-md">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <div className="py-8 text-center text-gray-400 text-sm">No commands found</div>
              ) : (
                Object.entries(grouped).map(([category, items]) => (
                  <div key={category} className="mb-2">
                    <p className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">{category}</p>
                    {items.map((cmd) => {
                      const globalIdx = filtered.indexOf(cmd);
                      return (
                        <button
                          key={cmd.id}
                          onClick={() => execute(cmd)}
                          onMouseEnter={() => setSelectedIndex(globalIdx)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                            selectedIndex === globalIdx
                              ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                          }`}
                        >
                          <cmd.icon className="w-4 h-4 flex-shrink-0" />
                          <span className="flex-1 text-sm font-medium">{cmd.label}</span>
                          {cmd.shortcut && (
                            <kbd className="px-1.5 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 rounded text-gray-400">
                              {cmd.shortcut}
                            </kbd>
                          )}
                          <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100" />
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span className="flex items-center gap-1"><Keyboard className="w-3 h-3" /> Navigate</span>
                <span>↑↓</span>
                <span>Enter to select</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Command className="w-3 h-3" />
                <span>+K</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
