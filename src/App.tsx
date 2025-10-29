import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SidebarProvider } from './contexts/SidebarContext';
import { CartProvider } from './contexts/CartContext';
import LoginForm from './components/auth/LoginForm';
import Register from './pages/Register';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import ProductFormPageWrapper from './pages/ProductFormPageWrapper';
import Categories from './pages/Categories';
import Inventory from './pages/Inventory';
import ProductSetup from './pages/ProductSetup';
import Orders from './pages/Orders';
import Customers from './pages/Customers';
import Brands from './pages/Brands';
import BrandFormPage from './pages/BrandFormPage';
import CategoryFormPage from './pages/CategoryFormPage';
import ColorFormPage from './pages/ColorFormPage';
import MaterialsPage from './pages/MaterialsPage';
import MaterialFormPage from './pages/MaterialFormPage';
import OccasionsPage from './pages/OccasionsPage';
import OccasionFormPage from './pages/OccasionFormPage';
import SeasonsPage from './pages/SeasonsPage';
import SeasonFormPage from './pages/SeasonFormPage';
import SizeFormPage from './pages/SizeFormPage';
import MasterDataPage from './pages/MasterDataPage';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Shop from './pages/Shop';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Temporarily bypass authentication for testing
  // if (!isAuthenticated) {
  //   return <Navigate to="/login" replace />;
  // }

  return <>{children}</>;
};

// Main App Component
const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginForm />
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />
          }
        />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="products/new" element={<ProductFormPageWrapper />} />
          <Route path="products/:id/edit" element={<ProductFormPageWrapper />} />
          <Route path="categories" element={<Categories />} />
          <Route path="categories/new" element={<CategoryFormPage />} />
          <Route path="categories/:id/edit" element={<CategoryFormPage />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="product-setup" element={<ProductSetup />} />
          <Route path="orders" element={<Orders />} />
          <Route path="customers" element={<Customers />} />
          <Route path="brands" element={<Brands />} />
          <Route path="brands/new" element={<BrandFormPage />} />
          <Route path="brands/:id/edit" element={<BrandFormPage />} />
          
          {/* Master Data Routes */}
          <Route path="colors" element={<ColorFormPage />} />
          <Route path="materials" element={<MaterialsPage />} />
          <Route path="materials/new" element={<MaterialFormPage />} />
          <Route path="materials/:id/edit" element={<MaterialFormPage />} />
          <Route path="occasions" element={<OccasionsPage />} />
          <Route path="occasions/new" element={<OccasionFormPage />} />
          <Route path="occasions/:id/edit" element={<OccasionFormPage />} />
          <Route path="seasons" element={<SeasonsPage />} />
          <Route path="seasons/new" element={<SeasonFormPage />} />
          <Route path="seasons/:id/edit" element={<SeasonFormPage />} />
          <Route path="sizes" element={<SizeFormPage />} />
          <Route path="master-data" element={<MasterDataPage />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Shop route */}
        <Route
          path="/shop"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Shop />} />
        </Route>

        {/* Cart and Checkout routes */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Cart />} />
        </Route>
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Checkout />} />
        </Route>
        <Route
          path="/order-confirmation/:orderId"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<OrderConfirmation />} />
        </Route>

        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

// App Component with Providers
const App: React.FC = () => {
  return (
    <AuthProvider>
      <SidebarProvider>
        <CartProvider customerId="current-user-id" sessionId="session-id">
          <AppContent />
        </CartProvider>
      </SidebarProvider>
    </AuthProvider>
  );
};

export default App;
