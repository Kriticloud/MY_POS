import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, User, Mail, Phone, Star } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

const customerList = [
  { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@email.com', phone: '+1234567890', loyaltyPoints: 450, totalSpent: 1234.50, orders: 23 },
  { id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@email.com', phone: '+1234567891', loyaltyPoints: 890, totalSpent: 2456.00, orders: 45 },
  { id: '3', firstName: 'Mike', lastName: 'Johnson', email: 'mike@email.com', phone: '+1234567892', loyaltyPoints: 120, totalSpent: 567.80, orders: 8 },
  { id: '4', firstName: 'Sarah', lastName: 'Williams', email: 'sarah@email.com', phone: '+1234567893', loyaltyPoints: 670, totalSpent: 1890.25, orders: 34 },
  { id: '5', firstName: 'David', lastName: 'Brown', email: 'david@email.com', phone: '+1234567894', loyaltyPoints: 230, totalSpent: 789.90, orders: 12 },
];

export function CustomersPage() {
  const [search, setSearch] = useState('');

  const filtered = customerList.filter(
    (c) =>
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-dark-900 dark:text-white">Customers</h1>
          <p className="text-gray-500 mt-1">Manage customer relationships</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-700 text-white rounded-xl font-medium text-sm shadow-lg shadow-primary/25">
          <Plus className="w-4 h-4" />
          Add Customer
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((customer, index) => (
          <motion.div
            key={customer.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white dark:bg-dark-800 rounded-2xl shadow-card p-5 hover:shadow-soft transition-shadow cursor-pointer"
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-dark-900 dark:text-white">
                  {customer.firstName} {customer.lastName}
                </h3>
                <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                  <Mail className="w-3 h-3" />
                  {customer.email}
                </div>
                <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-500">
                  <Phone className="w-3 h-3" />
                  {customer.phone}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-dark-700 grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-lg font-bold text-dark-900 dark:text-white">{customer.orders}</p>
                <p className="text-xs text-gray-500">Orders</p>
              </div>
              <div>
                <p className="text-lg font-bold text-dark-900 dark:text-white">
                  {formatCurrency(customer.totalSpent)}
                </p>
                <p className="text-xs text-gray-500">Spent</p>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <p className="text-lg font-bold text-dark-900 dark:text-white">{customer.loyaltyPoints}</p>
                </div>
                <p className="text-xs text-gray-500">Points</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
