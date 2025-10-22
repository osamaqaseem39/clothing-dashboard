// Shared Product Types for E-commerce Platform
// This file ensures consistency across Landing Page, Dashboard, and API

export type ProductType = 'simple' | 'variable' | 'grouped' | 'external';
export type StockStatus = 'instock' | 'outofstock' | 'onbackorder';
export type ProductStatus = 'draft' | 'published';

export interface ProductDimensions {
  length: number;
  width: number;
  height: number;
}

export interface ModelMeasurements {
  height: string;
  bust: string;
  waist: string;
  hips: string;
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

export interface ProductVariant {
  _id: string;
  sku: string;
  name: string;
  price: number;
  comparePrice?: number;
  costPrice: number;
  stockQuantity: number;
  weight: number;
  dimensions: ProductDimensions;
  attributes: Record<string, string>;
  isActive: boolean;
}

// Core Product Interface - All systems must implement this
export interface Product {
  // Core Fields
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
  weight?: number;
  dimensions?: ProductDimensions;
  manageStock: boolean;
  allowBackorders: boolean;
  status: ProductStatus;
  categories: string[];
  tags: string[];
  brand?: string;
  attributes: string[]; // Array of strings for product attributes
  variations?: string[];
  images: string[];
  
  // UI-specific Fields
  rating?: number;
  reviews?: number;
  isNew?: boolean;
  isSale?: boolean;
  features?: string[];
  colors?: string[];
  inStock?: boolean;
  stockCount?: number;
  shippingWeight?: number;
  shippingDimensions?: ProductDimensions;
  isActive?: boolean;
  seo?: SEOData;
  
  // Pakistani Clothing Specific Fields
  fabric?: string;
  collection?: string;
  collectionName?: string; // API uses collectionName
  occasion?: string;
  season?: string;
  careInstructions?: string;
  modelMeasurements?: ModelMeasurements;
  designer?: string;
  handwork?: string[];
  colorFamily?: string;
  pattern?: string;
  sleeveLength?: string;
  neckline?: string;
  length?: string;
  fit?: string;
  ageGroup?: string;
  bodyType?: string[];
  isLimitedEdition?: boolean;
  isCustomMade?: boolean;
  customDeliveryDays?: number;
  sizeChart?: string;
  availableSizes?: string[];
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// Extended Product Interface for Dashboard (includes relationships)
export interface DashboardProduct extends Product {
  categoryId?: {
    _id: string;
    name: string;
    slug: string;
  };
  brandId?: {
    _id: string;
    name: string;
    slug: string;
  };
  variants?: ProductVariant[];
  category?: {
    _id: string;
    name: string;
    slug: string;
  }; // Alias for categoryId
}

// Product Filters Interface
export interface ProductFilters {
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  rating?: number;
  status?: 'published' | 'draft';
  sortBy?: 'name' | 'price' | 'rating' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  
  // Pakistani Clothing Specific Filters
  fabrics?: string[];
  collections?: string[];
  occasions?: string[];
  seasons?: string[];
  designers?: string[];
  handwork?: string[];
  colorFamilies?: string[];
  patterns?: string[];
  sleeveLengths?: string[];
  necklines?: string[];
  lengths?: string[];
  fits?: string[];
  ageGroups?: string[];
  bodyTypes?: string[];
  sizes?: string[];
  isLimitedEdition?: boolean;
  isCustomMade?: boolean;
  
  // Attribute-based filters
  attributes?: string[];
  tags?: string[];
}

// Product Form Interface for creating/updating products
export interface ProductForm {
  name: string;
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
  weight?: number;
  dimensions?: ProductDimensions;
  manageStock: boolean;
  allowBackorders: boolean;
  status: ProductStatus;
  categories: string[];
  tags: string[];
  brand?: string;
  attributes: string[];
  images: string[];
  
  // UI-specific fields
  rating?: number;
  reviews?: number;
  isNew?: boolean;
  isSale?: boolean;
  features?: string[];
  colors?: string[];
  inStock?: boolean;
  stockCount?: number;
  shippingWeight?: number;
  shippingDimensions?: ProductDimensions;
  isActive?: boolean;
  
  // Pakistani Clothing Specific Fields
  fabric?: string;
  collection?: string;
  collectionName?: string;
  occasion?: string;
  season?: string;
  careInstructions?: string;
  modelMeasurements?: ModelMeasurements;
  designer?: string;
  handwork?: string[];
  colorFamily?: string;
  pattern?: string;
  sleeveLength?: string;
  neckline?: string;
  length?: string;
  fit?: string;
  ageGroup?: string;
  bodyType?: string[];
  isLimitedEdition?: boolean;
  isCustomMade?: boolean;
  customDeliveryDays?: number;
  sizeChart?: string;
  availableSizes?: string[];
}

// API Response Interfaces
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    total: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}