import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CurrencyDollarIcon,
  ShoppingCartIcon,
  ShoppingBagIcon,
  UsersIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  PlusIcon,
  PencilIcon,
  ListBulletIcon,
  TagIcon,
  PhotoIcon,
  CubeIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  InformationCircleIcon,
  TruckIcon,
  RectangleStackIcon,
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { dashboardService } from '../services/dashboardService';
import type { DashboardStats } from '../types';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [ordersData, setOrdersData] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch all dashboard data in parallel
        const [
          statsResponse,
          revenueResponse,
          ordersResponse,
          topProductsResponse,
          recentOrdersResponse
        ] = await Promise.all([
          dashboardService.getDashboardStats(),
          dashboardService.getRevenueChart('7d'),
          dashboardService.getOrdersChart('7d'),
          dashboardService.getTopProducts(5),
          dashboardService.getRecentOrders(5)
        ]);

        if (statsResponse.success && statsResponse.data) {
          setStats(statsResponse.data);
        }

        if (revenueResponse.success && revenueResponse.data) {
          setRevenueData(revenueResponse.data.revenueChart || []);
        }

        if (ordersResponse.success && ordersResponse.data) {
          setOrdersData(ordersResponse.data.orderChart || []);
        }

        if (topProductsResponse.success && topProductsResponse.data) {
          setTopProducts(topProductsResponse.data.products || []);
        }

        if (recentOrdersResponse.success && recentOrdersResponse.data) {
          setRecentOrders(recentOrdersResponse.data.orders || []);
        }

      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PKR',
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  const statsCards = [
    {
      name: 'Total Revenue',
      value: stats ? formatCurrency(stats.totalRevenue) : '₨0.00',
      change: '+20.1%',
      changeType: 'positive' as const,
      icon: CurrencyDollarIcon,
    },
    {
      name: 'Total Orders',
      value: stats ? formatNumber(stats.totalOrders) : '0',
      change: '+180.1%',
      changeType: 'positive' as const,
      icon: ShoppingCartIcon,
    },
    {
      name: 'Total Products',
      value: stats ? formatNumber(stats.totalProducts) : '0',
      change: '+19%',
      changeType: 'positive' as const,
      icon: ShoppingBagIcon,
    },
    {
      name: 'Total Users',
      value: stats ? formatNumber(stats.totalUsers) : '0',
      change: '+201',
      changeType: 'positive' as const,
      icon: UsersIcon,
    },
  ];

  // Quick action buttons configuration
  const quickActions = [
    {
      title: 'Products',
      description: 'Manage your product catalog',
      icon: ShoppingBagIcon,
      color: 'bg-blue-500 hover:bg-blue-600',
      actions: [
        { label: 'View All Products', path: '/dashboard/products', icon: ListBulletIcon },
        { label: 'Add New Product', path: '/dashboard/products/new', icon: PlusIcon },
      ],
    },
    {
      title: 'Categories',
      description: 'Organize products by categories',
      icon: TagIcon,
      color: 'bg-green-500 hover:bg-green-600',
      actions: [
        { label: 'View Categories', path: '/dashboard/categories', icon: ListBulletIcon },
        { label: 'Add Category', path: '/dashboard/categories/new', icon: PlusIcon },
      ],
    },
    {
      title: 'Brands',
      description: 'Manage product brands',
      icon: CubeIcon,
      color: 'bg-purple-500 hover:bg-purple-600',
      actions: [
        { label: 'View Brands', path: '/dashboard/brands', icon: ListBulletIcon },
        { label: 'Add Brand', path: '/dashboard/brands/new', icon: PlusIcon },
      ],
    },
    {
      title: 'Inventory',
      description: 'Track stock levels',
      icon: RectangleStackIcon,
      color: 'bg-orange-500 hover:bg-orange-600',
      actions: [
        { label: 'Manage Inventory', path: '/dashboard/inventory', icon: ListBulletIcon },
      ],
    },
    {
      title: 'Orders',
      description: 'View and manage orders',
      icon: ShoppingCartIcon,
      color: 'bg-indigo-500 hover:bg-indigo-600',
      actions: [
        { label: 'View Orders', path: '/dashboard/orders', icon: ListBulletIcon },
      ],
    },
    {
      title: 'Banners',
      description: 'Manage homepage banners',
      icon: PhotoIcon,
      color: 'bg-pink-500 hover:bg-pink-600',
      actions: [
        { label: 'Manage Banners', path: '/dashboard/banners', icon: ListBulletIcon },
      ],
    },
    {
      title: 'Master Data',
      description: 'Colors, sizes, materials, etc.',
      icon: Cog6ToothIcon,
      color: 'bg-gray-500 hover:bg-gray-600',
      actions: [
        { label: 'View Master Data', path: '/dashboard/master-data', icon: ListBulletIcon },
      ],
    },
    {
      title: 'Analytics',
      description: 'View sales and performance',
      icon: ChartBarIcon,
      color: 'bg-teal-500 hover:bg-teal-600',
      actions: [
        { label: 'View Analytics', path: '/dashboard/analytics', icon: ListBulletIcon },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">She's Trends Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back! Here's what's happening with your boutique today.
        </p>
      </div>

      {/* Quick Actions Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            <p className="text-sm text-gray-500 mt-1">
              Quickly access common tasks and manage your store
            </p>
          </div>
          <InformationCircleIcon className="h-5 w-5 text-gray-400" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <div
              key={action.title}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start space-x-3">
                <div className={`${action.color} p-2 rounded-lg text-white`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900">{action.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{action.description}</p>
                  <div className="mt-3 space-y-1">
                    {action.actions.map((btn) => (
                      <button
                        key={btn.label}
                        onClick={() => navigate(btn.path)}
                        className="w-full flex items-center justify-center space-x-1 text-xs px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-md transition-colors"
                      >
                        <btn.icon className="h-3.5 w-3.5" />
                        <span>{btn.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Instructions Section */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Getting Started</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex items-start space-x-2">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">
                1
              </div>
              <div>
                <p className="font-medium text-gray-900">Add Products</p>
                <p className="text-xs text-gray-500 mt-1">
                  Start by adding your products with images, prices, and descriptions
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-semibold">
                2
              </div>
              <div>
                <p className="font-medium text-gray-900">Organize Categories</p>
                <p className="text-xs text-gray-500 mt-1">
                  Create categories and assign products to help customers find items easily
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-semibold">
                3
              </div>
              <div>
                <p className="font-medium text-gray-900">Manage Inventory</p>
                <p className="text-xs text-gray-500 mt-1">
                  Track stock levels and set up alerts for low inventory items
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-8 w-8 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                    <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.changeType === 'positive' ? (
                        <ArrowTrendingUpIcon className="self-center flex-shrink-0 h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowTrendingDownIcon className="self-center flex-shrink-0 h-4 w-4 text-red-500" />
                      )}
                      <span className="sr-only">{stat.changeType === 'positive' ? 'Increased' : 'Decreased'} by</span>
                      {stat.change}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Overview</h3>
          {revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No revenue data available
            </div>
          )}
        </div>

        {/* Orders Chart */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Orders Overview</h3>
          {ordersData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ordersData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No orders data available
            </div>
          )}
        </div>
      </div>

      {/* Tables section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Products */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Products</h3>
          {topProducts.length > 0 ? (
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sales
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenue
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {topProducts.map((product, index) => (
                    <tr key={product._id || index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatNumber(product.sales || 0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(product.revenue || 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No product data available
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Orders</h3>
          {recentOrders.length > 0 ? (
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.orderNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.userId?.firstName} {order.userId?.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(order.totalAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.orderStatus)}`}>
                          {order.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No orders available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 
