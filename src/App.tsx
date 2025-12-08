import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SidebarProvider } from './contexts/SidebarContext';
import { CartProvider } from './contexts/CartContext';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Public routes - load immediately
import LoginForm from './components/auth/LoginForm';
import Register from './pages/Register';
import DashboardLayout from './components/layout/DashboardLayout';

// Lazy load all dashboard pages for code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Products = lazy(() => import('./pages/Products'));
const ProductFormPageWrapper = lazy(() => import('./pages/ProductFormPageWrapper'));
const Categories = lazy(() => import('./pages/Categories'));
const Inventory = lazy(() => import('./pages/Inventory'));
const ProductSetup = lazy(() => import('./pages/ProductSetup'));
const Orders = lazy(() => import('./pages/Orders'));
const Customers = lazy(() => import('./pages/Customers'));
const Brands = lazy(() => import('./pages/Brands'));
const BrandFormPage = lazy(() => import('./pages/BrandFormPage'));
const CategoryFormPage = lazy(() => import('./pages/CategoryFormPage'));
const ColorFormPage = lazy(() => import('./pages/ColorFormPage'));
const ColorsPage = lazy(() => import('./pages/ColorsPage'));
const MaterialsPage = lazy(() => import('./pages/MaterialsPage'));
const MaterialFormPage = lazy(() => import('./pages/MaterialFormPage'));
const OccasionsPage = lazy(() => import('./pages/OccasionsPage'));
const OccasionFormPage = lazy(() => import('./pages/OccasionFormPage'));
const SeasonsPage = lazy(() => import('./pages/SeasonsPage'));
const SeasonFormPage = lazy(() => import('./pages/SeasonFormPage'));
const SizeFormPage = lazy(() => import('./pages/SizeFormPage'));
const SizesPage = lazy(() => import('./pages/SizesPage'));
const PatternsPage = lazy(() => import('./pages/PatternsPage'));
const PatternFormPage = lazy(() => import('./pages/PatternFormPage'));
const SleeveLengthsPage = lazy(() => import('./pages/SleeveLengthsPage'));
const SleeveLengthFormPage = lazy(() => import('./pages/SleeveLengthFormPage'));
const ColorFamiliesPage = lazy(() => import('./pages/ColorFamiliesPage'));
const ColorFamilyFormPage = lazy(() => import('./pages/ColorFamilyFormPage'));
const MasterDataPage = lazy(() => import('./pages/MasterDataPage'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Settings = lazy(() => import('./pages/Settings'));
const DeliveryChargesPage = lazy(() => import('./pages/DeliveryChargesPage'));
const BannersPage = lazy(() => import('./pages/BannersPage'));
const Help = lazy(() => import('./pages/Help'));

// Loading fallback component
const PageLoader: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="xl" />
  </div>
);

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoading } = useAuth();

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
          <Route index element={<Suspense fallback={<PageLoader />}><Dashboard /></Suspense>} />
          <Route path="products" element={<Suspense fallback={<PageLoader />}><Products /></Suspense>} />
          <Route path="products/new" element={<Suspense fallback={<PageLoader />}><ProductFormPageWrapper /></Suspense>} />
          <Route path="products/:id/edit" element={<Suspense fallback={<PageLoader />}><ProductFormPageWrapper /></Suspense>} />
          <Route path="categories" element={<Suspense fallback={<PageLoader />}><Categories /></Suspense>} />
          <Route path="categories/new" element={<Suspense fallback={<PageLoader />}><CategoryFormPage /></Suspense>} />
          <Route path="categories/:id/edit" element={<Suspense fallback={<PageLoader />}><CategoryFormPage /></Suspense>} />
          <Route path="inventory" element={<Suspense fallback={<PageLoader />}><Inventory /></Suspense>} />
          <Route path="product-setup" element={<Suspense fallback={<PageLoader />}><ProductSetup /></Suspense>} />
          <Route path="orders" element={<Suspense fallback={<PageLoader />}><Orders /></Suspense>} />
          <Route path="customers" element={<Suspense fallback={<PageLoader />}><Customers /></Suspense>} />
          <Route path="brands" element={<Suspense fallback={<PageLoader />}><Brands /></Suspense>} />
          <Route path="brands/new" element={<Suspense fallback={<PageLoader />}><BrandFormPage /></Suspense>} />
          <Route path="brands/:id/edit" element={<Suspense fallback={<PageLoader />}><BrandFormPage /></Suspense>} />
          
          {/* Master Data Routes */}
          <Route path="colors" element={<Suspense fallback={<PageLoader />}><ColorsPage /></Suspense>} />
          <Route path="colors/new" element={<Suspense fallback={<PageLoader />}><ColorFormPage /></Suspense>} />
          <Route path="colors/:id/edit" element={<Suspense fallback={<PageLoader />}><ColorFormPage /></Suspense>} />
          <Route path="materials" element={<Suspense fallback={<PageLoader />}><MaterialsPage /></Suspense>} />
          <Route path="materials/new" element={<Suspense fallback={<PageLoader />}><MaterialFormPage /></Suspense>} />
          <Route path="materials/:id/edit" element={<Suspense fallback={<PageLoader />}><MaterialFormPage /></Suspense>} />
          <Route path="occasions" element={<Suspense fallback={<PageLoader />}><OccasionsPage /></Suspense>} />
          <Route path="occasions/new" element={<Suspense fallback={<PageLoader />}><OccasionFormPage /></Suspense>} />
          <Route path="occasions/:id/edit" element={<Suspense fallback={<PageLoader />}><OccasionFormPage /></Suspense>} />
          <Route path="seasons" element={<Suspense fallback={<PageLoader />}><SeasonsPage /></Suspense>} />
          <Route path="seasons/new" element={<Suspense fallback={<PageLoader />}><SeasonFormPage /></Suspense>} />
          <Route path="seasons/:id/edit" element={<Suspense fallback={<PageLoader />}><SeasonFormPage /></Suspense>} />
          <Route path="sizes" element={<Suspense fallback={<PageLoader />}><SizesPage /></Suspense>} />
          <Route path="sizes/new" element={<Suspense fallback={<PageLoader />}><SizeFormPage /></Suspense>} />
          <Route path="sizes/:id/edit" element={<Suspense fallback={<PageLoader />}><SizeFormPage /></Suspense>} />
          <Route path="patterns" element={<Suspense fallback={<PageLoader />}><PatternsPage /></Suspense>} />
          <Route path="patterns/new" element={<Suspense fallback={<PageLoader />}><PatternFormPage /></Suspense>} />
          <Route path="patterns/:id/edit" element={<Suspense fallback={<PageLoader />}><PatternFormPage /></Suspense>} />
          <Route path="sleeve-lengths" element={<Suspense fallback={<PageLoader />}><SleeveLengthsPage /></Suspense>} />
          <Route path="sleeve-lengths/new" element={<Suspense fallback={<PageLoader />}><SleeveLengthFormPage /></Suspense>} />
          <Route path="sleeve-lengths/:id/edit" element={<Suspense fallback={<PageLoader />}><SleeveLengthFormPage /></Suspense>} />
          <Route path="color-families" element={<Suspense fallback={<PageLoader />}><ColorFamiliesPage /></Suspense>} />
          <Route path="color-families/new" element={<Suspense fallback={<PageLoader />}><ColorFamilyFormPage /></Suspense>} />
          <Route path="color-families/:id/edit" element={<Suspense fallback={<PageLoader />}><ColorFamilyFormPage /></Suspense>} />
          <Route path="master-data" element={<Suspense fallback={<PageLoader />}><MasterDataPage /></Suspense>} />
          <Route path="analytics" element={<Suspense fallback={<PageLoader />}><Analytics /></Suspense>} />
          <Route path="settings" element={<Suspense fallback={<PageLoader />}><Settings /></Suspense>} />
          <Route path="delivery-charges" element={<Suspense fallback={<PageLoader />}><DeliveryChargesPage /></Suspense>} />
          <Route path="banners" element={<Suspense fallback={<PageLoader />}><BannersPage /></Suspense>} />
          <Route path="help" element={<Suspense fallback={<PageLoader />}><Help /></Suspense>} />
        </Route>

        {/* Removed Shop, Cart, Checkout, and Order Confirmation routes */}

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
