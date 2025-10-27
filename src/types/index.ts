// User Types
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'user' | 'moderator' | 'admin';
  isActive: boolean;
  profileImage?: string;
  addresses: Address[];
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  _id: string;
  type: 'shipping' | 'billing';
  firstName: string;
  lastName: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  street?: string; // Alias for addressLine1
  city: string;
  state: string;
  postalCode: string;
  zipCode?: string; // Alias for postalCode
  country: string;
  phone: string;
  isDefault: boolean;
}

// Product Types for Dashboard
export type ProductType = 'simple' | 'variable' | 'grouped' | 'external';
export type ProductStatus = 'draft' | 'published' | 'archived';
export type StockStatus = 'instock' | 'outofstock' | 'onbackorder';

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  sku: string;
  type: ProductType;
  price: number;
  salePrice?: number;
  originalPrice?: number;
  currency: string;
  stockQuantity: number;
  stockStatus: StockStatus;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  manageStock: boolean;
  allowBackorders: boolean;
  status: ProductStatus;
  categories: string[];
  tags: string[];
  brand: string;
  attributes: string[];
  variations: ProductVariant[];
  images: (string | {
    url: string;
    altText?: string;
    position: number;
  })[];
  
  // UI-specific fields
  rating: number;
  reviews: number;
  isNew: boolean;
  isSale: boolean;
  features: string[];
  colors: string[];
  inStock: boolean;
  stockCount: number;
  shippingWeight: number;
  shippingDimensions: {
    length: number;
    width: number;
    height: number;
  };
  isActive: boolean;
  seo: ProductSEO;
  
  // Pakistani Clothing Specific Fields
  fabric: string;
  collectionName: string;
  occasion: string;
  season: string;
  careInstructions: string;
  modelMeasurements: {
    height: string;
    bust: string;
    waist: string;
    hips: string;
  };
  designer: string;
  handwork: string[];
  colorFamily: string;
  pattern: string;
  sleeveLength: string;
  neckline: string;
  length: string;
  fit: string;
  ageGroup: string;
  bodyType: string[];
  isLimitedEdition: boolean;
  isCustomMade: boolean;
  customDeliveryDays?: number;
  sizeChart: string;
  sizeChartImageUrl?: string;
  availableSizes: string[];
  createdAt: string;
  updatedAt: string;
  
  // Dashboard-specific relationship fields
  categoryId?: Category;
  brandId?: Brand;
  variants?: ProductVariant[];
  category?: Category; // Alias for categoryId
}

export interface SizeChart {
  _id: string;
  name: string;
  description?: string;
  sizeType: 'numeric' | 'alphabetic' | 'custom';
  sizes: Array<{
    size: string;
    measurements: {
      bust?: string;
      waist?: string;
      hips?: string;
      shoulder?: string;
      sleeveLength?: string;
      length?: string;
      custom?: Record<string, string>;
    };
  }>;
  imageUrl?: string;
  imageAltText?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  _id: string;
  name: string;
  sku: string;
  price: number;
  salePrice?: number;
  comparePrice?: number;
  costPrice?: number;
  stockQuantity: number;
  stockStatus: 'instock' | 'outofstock' | 'onbackorder';
  attributes: Record<string, string>;
  images: string[];
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  isActive: boolean;
}

export interface ProductSEO {
  title: string;
  description: string;
  keywords: string[];
  slug: string;
  canonicalUrl: string;
  ogImage: string;
  noIndex: boolean;
  noFollow: boolean;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  image?: string;
  icon?: string;
  color?: string;
  isActive: boolean;
  sortOrder: number;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  productCount?: number;
  children?: Category[];
  createdAt: string;
  updatedAt: string;
}

export interface Brand {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  logoUrl?: string; // Alias for logo
  website?: string;
  country?: string;
  foundedYear?: number;
  mainCompany?: string;
  level: 'main' | 'sub';
  industry?: string;
  colors?: {
    primary: string;
    secondary: string;
  };
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface SEOData {
  title?: string;
  description?: string;
  keywords?: string[];
  slug?: string;
  canonicalUrl?: string;
  ogImage?: string;
  noIndex: boolean;
  noFollow: boolean;
}

// Order Types
export interface Order {
  _id: string;
  userId: User;
  orderNumber: string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingMethod: string;
  paymentMethod: string;
  trackingNumber?: string;
  placedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: Product;
  variantId: ProductVariant;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  // Alias for productId to match UI usage
  product?: Product;
}

// Payment Types
export interface Payment {
  _id: string;
  orderId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  gatewayResponse?: any;
  refundAmount?: number;
  refundReason?: string;
  createdAt: string;
  updatedAt: string;
}

// Review Types
export interface Review {
  _id: string;
  productId: string;
  userId: User;
  rating: number;
  title: string;
  comment: string;
  isApproved: boolean;
  helpfulVotes: number;
  createdAt: string;
  updatedAt: string;
}

// Cart Types
export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: Product;
  variantId: ProductVariant;
  quantity: number;
  price: number;
}

// Coupon Types
export interface Coupon {
  _id: string;
  code: string;
  type: 'percentage' | 'fixed' | 'free_shipping';
  value: number;
  minimumAmount?: number;
  maximumDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  validFrom: string;
  validTo: string;
  isActive: boolean;
  applicableProducts?: string[];
  applicableCategories?: string[];
  applicableUsers?: string[];
  createdAt: string;
  updatedAt: string;
}

// Inventory Types
export interface Inventory {
  _id: string;
  productId: string;
  variantId?: string;
  productName?: string;
  sku?: string;
  productImage?: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  reorderPoint: number;
  reorderQuantity: number;
  maxStock?: number;
  costPrice: number;
  sellingPrice: number;
  warehouse: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued';
  lastRestocked?: string;
  lastSold?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryMovement {
  _id: string;
  inventoryId: string;
  type: 'purchase' | 'sale' | 'return' | 'adjustment' | 'transfer' | 'damage' | 'expired';
  quantity: number;
  previousStock: number;
  newStock: number;
  referenceId?: string;
  referenceType?: string;
  notes?: string;
  userId?: string;
  unitCost?: number;
  totalCost?: number;
  fromWarehouse?: string;
  toWarehouse?: string;
  createdAt: string;
  updatedAt: string;
}

// Shipping Types
export interface ShippingZone {
  _id: string;
  name: string;
  countries: string[];
  states?: string[];
  cities?: string[];
  postalCodes?: string[];
  methods: ShippingMethod[];
  isActive: boolean;
}

export interface ShippingMethod {
  _id: string;
  name: string;
  description?: string;
  baseRate: number;
  perItemRate: number;
  perWeightRate: number;
  freeShippingThreshold?: number;
  estimatedDays: string;
  restrictions?: {
    maxWeight?: number;
    maxDimensions?: number;
    excludedProducts?: string[];
    excludedCategories?: string[];
  };
  isActive: boolean;
}

// Analytics Types
export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  averageOrderValue: number;
  conversionRate: number;
  topProducts: Product[];
  recentOrders: Order[];
  revenueChart: RevenueData[];
  orderChart: OrderData[];
}

export interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
}

export interface OrderData {
  date: string;
  orders: number;
  revenue: number;
}

// Notification Types
export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  channel: 'email' | 'push' | 'sms' | 'in_app';
  isRead: boolean;
  scheduledFor?: string;
  sentAt?: string;
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
  pagination?: PaginationData;
}

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  total: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ProductForm {
  name: string;
  description: string;
  categoryId: string;
  brandId?: string;
  tags: string[];
  variants: Omit<ProductVariant, '_id'>[];
  images: string[];
}

// Filter Types for Dashboard
export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  status?: 'published' | 'draft' | 'archived';
  sortBy?: 'name' | 'price' | 'createdAt' | 'updatedAt' | 'rating';
  sortOrder?: 'asc' | 'desc';
  sizes?: string[];
  fabrics?: string[];
  occasions?: string[];
  colorFamilies?: string[];
  tags?: string[];
  attributes?: string[];
  collections?: string[];
  designers?: string[];
  seasons?: string[];
  ageGroups?: string[];
  bodyTypes?: string[];
  isNew?: boolean;
  isSale?: boolean;
  isLimitedEdition?: boolean;
  isCustomMade?: boolean;
  handwork?: string[];
  patterns?: string[];
  sleeveLengths?: string[];
  necklines?: string[];
  lengths?: string[];
  fits?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: {
    min: number;
    max: number;
  };
}

export interface OrderFilters {
  search?: string;
  status?: string;
  paymentStatus?: string;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
  page?: number;
  limit?: number;
}

// Customer Types
export interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  createdAt: string;
  orders?: Array<{
    _id: string;
    orderNumber: string;
    totalAmount: number;
    orderStatus: string;
    createdAt: string;
  }>;
  addresses?: Array<{
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  }>;
}

export interface CustomerFilters {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
} 