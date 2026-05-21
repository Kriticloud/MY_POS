import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import { useAuthStore } from './store/authStore';
import { useSettingsStore } from './store/settingsStore';
import { MainLayout } from './layouts/MainLayout';
import { LoginPage } from './pages/LoginPage';
import { KeyboardShortcuts } from './components/KeyboardShortcuts';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useWebSocket } from './hooks/useWebSocket';

// Lazy-loaded pages for code splitting
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const POSPage = lazy(() => import('./pages/POSPage').then(m => ({ default: m.POSPage })));
const OrdersPage = lazy(() => import('./pages/OrdersPage').then(m => ({ default: m.OrdersPage })));
const TablesPage = lazy(() => import('./pages/TablesPage').then(m => ({ default: m.TablesPage })));
const ProductsPage = lazy(() => import('./pages/ProductsPage').then(m => ({ default: m.ProductsPage })));
const CustomersPage = lazy(() => import('./pages/CustomersPage').then(m => ({ default: m.CustomersPage })));
const ReportsPage = lazy(() => import('./pages/ReportsPage').then(m => ({ default: m.ReportsPage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const KitchenPage = lazy(() => import('./pages/KitchenPage').then(m => ({ default: m.KitchenPage })));
const EmployeesPage = lazy(() => import('./pages/EmployeesPage').then(m => ({ default: m.EmployeesPage })));
const InventoryPage = lazy(() => import('./pages/InventoryPage').then(m => ({ default: m.InventoryPage })));
const AppointmentsPage = lazy(() => import('./pages/AppointmentsPage').then(m => ({ default: m.AppointmentsPage })));
const SuppliersPage = lazy(() => import('./pages/SuppliersPage').then(m => ({ default: m.SuppliersPage })));
const CashDrawerPage = lazy(() => import('./pages/CashDrawerPage').then(m => ({ default: m.CashDrawerPage })));
const MembershipsPage = lazy(() => import('./pages/MembershipsPage').then(m => ({ default: m.MembershipsPage })));
const DiscountsPage = lazy(() => import('./pages/DiscountsPage').then(m => ({ default: m.DiscountsPage })));
const BranchesPage = lazy(() => import('./pages/BranchesPage').then(m => ({ default: m.BranchesPage })));
const AuditLogPage = lazy(() => import('./pages/AuditLogPage').then(m => ({ default: m.AuditLogPage })));
const ProfilePage = lazy(() => import('./pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const GiftCardsPage = lazy(() => import('./pages/GiftCardsPage').then(m => ({ default: m.GiftCardsPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full" />
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  useWebSocket(); // Multi-terminal real-time sync
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function RoleGuard({ roles, children }: { roles: string[]; children: React.ReactNode }) {
  const userRole = useAuthStore((s) => s.user?.role);
  if (!userRole || !roles.includes(userRole)) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v.01M12 9v2m0 8a9 9 0 100-18 9 9 0 000 18z" /></svg>
        </div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Access Denied</h2>
        <p className="text-sm text-gray-500">You don't have permission to access this page. Contact your administrator.</p>
      </div>
    );
  }
  return <>{children}</>;
}

const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN', 'MANAGER'];
const REPORT_ROLES = ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'ACCOUNTANT'];

export default function App() {
  const fetchSettings = useSettingsStore((s) => s.fetchSettings);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <KeyboardShortcuts />
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<ErrorBoundary><DashboardPage /></ErrorBoundary>} />
            <Route path="pos" element={<ErrorBoundary><POSPage /></ErrorBoundary>} />
            <Route path="orders" element={<ErrorBoundary><OrdersPage /></ErrorBoundary>} />
            <Route path="tables" element={<ErrorBoundary><TablesPage /></ErrorBoundary>} />
            <Route path="kitchen" element={<ErrorBoundary><KitchenPage /></ErrorBoundary>} />
            <Route path="products" element={<ErrorBoundary><ProductsPage /></ErrorBoundary>} />
            <Route path="customers" element={<ErrorBoundary><CustomersPage /></ErrorBoundary>} />
            <Route path="reports" element={<ErrorBoundary><RoleGuard roles={REPORT_ROLES}><ReportsPage /></RoleGuard></ErrorBoundary>} />
            <Route path="settings" element={<ErrorBoundary><RoleGuard roles={ADMIN_ROLES}><SettingsPage /></RoleGuard></ErrorBoundary>} />
            <Route path="employees" element={<ErrorBoundary><RoleGuard roles={ADMIN_ROLES}><EmployeesPage /></RoleGuard></ErrorBoundary>} />
            <Route path="inventory" element={<ErrorBoundary><InventoryPage /></ErrorBoundary>} />
            <Route path="appointments" element={<ErrorBoundary><AppointmentsPage /></ErrorBoundary>} />
            <Route path="suppliers" element={<ErrorBoundary><SuppliersPage /></ErrorBoundary>} />
            <Route path="cash-drawer" element={<ErrorBoundary><CashDrawerPage /></ErrorBoundary>} />
            <Route path="memberships" element={<ErrorBoundary><MembershipsPage /></ErrorBoundary>} />
            <Route path="discounts" element={<ErrorBoundary><DiscountsPage /></ErrorBoundary>} />
            <Route path="branches" element={<ErrorBoundary><RoleGuard roles={['SUPER_ADMIN', 'ADMIN']}><BranchesPage /></RoleGuard></ErrorBoundary>} />
            <Route path="audit-log" element={<ErrorBoundary><RoleGuard roles={ADMIN_ROLES}><AuditLogPage /></RoleGuard></ErrorBoundary>} />
            <Route path="profile" element={<ErrorBoundary><ProfilePage /></ErrorBoundary>} />
            <Route path="gift-cards" element={<ErrorBoundary><GiftCardsPage /></ErrorBoundary>} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
