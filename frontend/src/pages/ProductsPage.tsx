import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Package } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

const productList = [
  { id: '1', name: 'Americano', sku: 'BEV-001', barcode: '1000001', price: 3.99, category: 'Beverages', stock: 999, isActive: true },
  { id: '2', name: 'Cappuccino', sku: 'BEV-002', barcode: '1000002', price: 4.99, category: 'Beverages', stock: 999, isActive: true },
  { id: '3', name: 'Classic Burger', sku: 'FD-001', barcode: '2000001', price: 9.99, category: 'Food', stock: 45, isActive: true },
  { id: '4', name: 'Margherita Pizza', sku: 'FD-004', barcode: '2000004', price: 12.99, category: 'Food', stock: 30, isActive: true },
  { id: '5', name: 'Chocolate Cake', sku: 'DST-001', barcode: '3000001', price: 6.99, category: 'Desserts', stock: 12, isActive: true },
  { id: '6', name: 'French Fries', sku: 'SNK-001', barcode: '4000001', price: 3.99, category: 'Snacks', stock: 78, isActive: true },
  { id: '7', name: 'Burger Combo', sku: 'CMB-001', barcode: '5000001', price: 14.99, category: 'Combo Meals', stock: 50, isActive: true },
  { id: '8', name: 'Grilled Salmon', sku: 'FD-005', barcode: '2000005', price: 16.99, category: 'Food', stock: 8, isActive: true },
];

export function ProductsPage() {
  const [search, setSearch] = useState('');

  const filtered = productList.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.barcode.includes(search)
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-dark-900 dark:text-white">Products</h1>
          <p className="text-gray-500 mt-1">Manage your product catalog</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-700 text-white rounded-xl font-medium text-sm transition-colors shadow-lg shadow-primary/25">
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, SKU, or barcode..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
        />
      </div>

      {/* Product Table */}
      <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-gray-500 uppercase bg-gray-50 dark:bg-dark-700">
              <th className="px-6 py-4 font-medium">Product</th>
              <th className="px-6 py-4 font-medium">SKU</th>
              <th className="px-6 py-4 font-medium">Barcode</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Price</th>
              <th className="px-6 py-4 font-medium">Stock</th>
              <th className="px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-dark-700">
            {filtered.map((product, index) => (
              <motion.tr
                key={product.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.03 }}
                className="hover:bg-gray-50 dark:hover:bg-dark-700/50"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Package className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-dark-900 dark:text-white">{product.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 font-mono">{product.sku}</td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 font-mono">{product.barcode}</td>
                <td className="px-6 py-4">
                  <span className="text-xs font-medium bg-gray-100 dark:bg-dark-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-lg">
                    {product.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-dark-900 dark:text-white">
                  {formatCurrency(product.price)}
                </td>
                <td className="px-6 py-4">
                  <span className={`text-sm font-medium ${product.stock < 15 ? 'text-red-500' : 'text-green-600'}`}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-600 text-gray-500">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
