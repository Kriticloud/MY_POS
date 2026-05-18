import { motion } from 'framer-motion';
import { Users, Clock, AlertCircle, CheckCircle } from 'lucide-react';

type TableStatus = 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'CLEANING';

const tables = [
  { id: '1', name: 'Table 1', capacity: 2, status: 'AVAILABLE' as TableStatus, floor: 'Ground Floor' },
  { id: '2', name: 'Table 2', capacity: 2, status: 'OCCUPIED' as TableStatus, floor: 'Ground Floor', order: 'ORD-001' },
  { id: '3', name: 'Table 3', capacity: 4, status: 'OCCUPIED' as TableStatus, floor: 'Ground Floor', order: 'ORD-002' },
  { id: '4', name: 'Table 4', capacity: 4, status: 'RESERVED' as TableStatus, floor: 'Ground Floor' },
  { id: '5', name: 'Table 5', capacity: 4, status: 'AVAILABLE' as TableStatus, floor: 'Ground Floor' },
  { id: '6', name: 'Table 6', capacity: 6, status: 'CLEANING' as TableStatus, floor: 'Ground Floor' },
  { id: '7', name: 'Table 7', capacity: 4, status: 'AVAILABLE' as TableStatus, floor: 'First Floor' },
  { id: '8', name: 'Table 8', capacity: 4, status: 'OCCUPIED' as TableStatus, floor: 'First Floor', order: 'ORD-003' },
  { id: '9', name: 'Table 9', capacity: 6, status: 'AVAILABLE' as TableStatus, floor: 'First Floor' },
  { id: '10', name: 'Table 10', capacity: 6, status: 'RESERVED' as TableStatus, floor: 'First Floor' },
  { id: '11', name: 'Table 11', capacity: 6, status: 'AVAILABLE' as TableStatus, floor: 'First Floor' },
  { id: '12', name: 'Table 12', capacity: 6, status: 'OCCUPIED' as TableStatus, floor: 'First Floor', order: 'ORD-004' },
];

const statusConfig: Record<TableStatus, { color: string; bg: string; icon: typeof Users; label: string }> = {
  AVAILABLE: { color: 'text-green-600', bg: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800', icon: CheckCircle, label: 'Available' },
  OCCUPIED: { color: 'text-red-600', bg: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800', icon: Users, label: 'Occupied' },
  RESERVED: { color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800', icon: Clock, label: 'Reserved' },
  CLEANING: { color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800', icon: AlertCircle, label: 'Cleaning' },
};

export function TablesPage() {
  const floors = [...new Set(tables.map((t) => t.floor))];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-dark-900 dark:text-white">Tables</h1>
          <p className="text-gray-500 mt-1">Manage restaurant table layout</p>
        </div>
        <div className="flex gap-4">
          {Object.entries(statusConfig).map(([key, config]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded-full ${config.color.replace('text-', 'bg-')}`} />
              <span className="text-xs text-gray-600 dark:text-gray-400">{config.label}</span>
            </div>
          ))}
        </div>
      </div>

      {floors.map((floor) => (
        <div key={floor}>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            {floor}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {tables
              .filter((t) => t.floor === floor)
              .map((table, index) => {
                const config = statusConfig[table.status];
                const Icon = config.icon;
                return (
                  <motion.div
                    key={table.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all hover:scale-105 ${config.bg}`}
                  >
                    <div className="text-center">
                      <Icon className={`w-6 h-6 mx-auto mb-2 ${config.color}`} />
                      <p className="font-semibold text-dark-900 dark:text-white text-sm">
                        {table.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {table.capacity} seats
                      </p>
                      {table.status === 'OCCUPIED' && (
                        <p className="text-xs font-medium text-red-600 mt-1">{(table as any).order}</p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}
