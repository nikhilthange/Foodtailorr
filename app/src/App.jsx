import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Outlet, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './features/auth/AuthContext';
import ProtectedRoute from './features/auth/ProtectedRoute';
import { ErrorBoundary } from './components/ErrorBoundary';

// Layout & Global Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CulinaryBlueprintPreloader from './components/preloader/CulinaryBlueprintPreloader';

// Public Pages
import HomePage from './pages/HomePage';
import MenuBuilderPage from './pages/MenuBuilderPage';
import BrandsPage from './pages/BrandsPage';
import AboutPage from './pages/AboutPage';
import HowItWorksPage from './pages/HowItWorksPage';

// Auth Pages
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import ForgotPasswordPage from './features/auth/ForgotPasswordPage';
import ResetPasswordPage from './features/auth/ResetPasswordPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import NotFoundPage from './pages/NotFoundPage';

// Dashboards
import CustomerDashboard from './features/customer/DashboardPage';
import OrderDetailsPage from './features/customer/OrderDetailsPage';
import CustomerProfilePage from './features/customer/ProfilePage';

// Partner Architecture
import PartnerLayout from './features/partner/components/PartnerLayout';
import PartnerDashboardOverview from './features/partner/pages/PartnerDashboardOverview';
import PartnerOrdersManager from './features/partner/pages/PartnerOrdersManager';
import PartnerMenuManager from './features/partner/pages/PartnerMenuManager';
import PartnerProfile from './features/partner/pages/PartnerProfile';
import PartnerAnalytics from './features/partner/pages/PartnerAnalytics';

// Admin Architecture
import AdminLayout from './features/admin/components/AdminLayout';
import DashboardOverview from './features/admin/pages/DashboardOverview';
import OrdersManager from './features/admin/pages/OrdersManager';
import UsersManager from './features/admin/pages/UsersManager';
import PartnersManager from './features/admin/pages/PartnersManager';
import MenuManager from './features/admin/pages/MenuManager';
import AILogsManager from './features/admin/pages/AILogsManager';
import AnalyticsPage from './features/admin/pages/AnalyticsPage';

// Create a query client
const queryClient = new QueryClient();

const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Public Layout Wrapper
function MainLayout() {
  const location = useLocation();
  return (
    <>
      <Navbar />
      <main>
        <AnimatePresence mode="wait">
          <motion.div key={location.pathname} {...pageTransition}>
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          {loading && <CulinaryBlueprintPreloader onComplete={() => setLoading(false)} />}
          <ScrollToTop />
          <ErrorBoundary>
            <Routes>
            {/* Landing page — has its own nav & footer */}
            <Route path="/" element={<HomePage />} />

            {/* Main Application Layout (Navbar + Footer) */}
            <Route element={<MainLayout />}>
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/menu-builder" element={<MenuBuilderPage />} />
              <Route path="/brands" element={<BrandsPage />} />
              <Route path="/about" element={<AboutPage />} />
              
              {/* Customer Routes */}
              <Route element={<ProtectedRoute allowedRoles={['CUSTOMER']} />}>
                <Route path="/dashboard" element={<CustomerDashboard />} />
                <Route path="/dashboard/orders/:id" element={<OrderDetailsPage />} />
                <Route path="/dashboard/profile" element={<CustomerProfilePage />} />
              </Route>
            </Route>

            {/* Partner Standalone Layout (Has own sidebar/topbar) */}
            <Route path="/partner" element={<ProtectedRoute allowedRoles={['PARTNER']}><PartnerLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/partner/dashboard" replace />} />
              <Route path="dashboard" element={<PartnerDashboardOverview />} />
              <Route path="orders" element={<PartnerOrdersManager />} />
              <Route path="menu" element={<PartnerMenuManager />} />
              <Route path="profile" element={<PartnerProfile />} />
              <Route path="analytics" element={<PartnerAnalytics />} />
            </Route>

            {/* Admin Standalone Layout (Has own sidebar/topbar) */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardOverview />} />
              <Route path="orders" element={<OrdersManager />} />
              <Route path="users" element={<UsersManager />} />
              <Route path="partners" element={<PartnersManager />} />
              <Route path="menu" element={<MenuManager />} />
              <Route path="ai-logs" element={<AILogsManager />} />
              <Route path="analytics" element={<AnalyticsPage />} />
            </Route>

            {/* Auth Layouts (No standard Navbar/Footer) */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          </ErrorBoundary>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
