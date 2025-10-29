import api from './api';
import { ApiResponse, Product, ProductFilters } from '../types';

export const productService = {
  // Normalize dashboard product shape to backend-accepted payload
  buildProductPayload(productData: any) {
    const allowedTypes = new Set(['simple', 'variable', 'grouped', 'external']);

    // Derive slug
    const rawSlug = productData.slug || productData.seo?.slug || productData.name || '';
    const slug = String(rawSlug)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    // Ensure type is valid
    const type = allowedTypes.has(productData.type) ? productData.type : 'simple';

    // Normalize categories to array of strings (ids)
    let categories: string[] | undefined = undefined;
    if (Array.isArray(productData.categories)) {
      categories = productData.categories.map((c: any) => (typeof c === 'string' ? c : c?._id || c?.id)).filter(Boolean);
    } else if (productData.categoryId) {
      const cid = typeof productData.categoryId === 'string' ? productData.categoryId : productData.categoryId?._id;
      categories = cid ? [cid] : undefined;
    }

    // Normalize images to strings if objects contain url
    const images = Array.isArray(productData.images)
      ? productData.images.map((img: any) => (typeof img === 'string' ? img : img?.url)).filter(Boolean)
      : undefined;

    // Strip fields rejected by backend
    const {
      seo, // nested SEO object not supported by backend
      isActive,
      features,
      colors,
      sizeChartImageUrl,
      // keep rest
      ...rest
    } = productData || {};

    // Whitelist fields commonly accepted by backend to avoid 500s from unknown props
    const whitelisted: Record<string, any> = {};

    const copyIfDefined = (key: string, srcKey?: string) => {
      const fromKey = srcKey || key;
      if (rest[fromKey] !== undefined && rest[fromKey] !== null) {
        whitelisted[key] = rest[fromKey];
      }
    };

    // Basic identity and merchandising fields
    copyIfDefined('name');
    whitelisted.slug = slug;
    copyIfDefined('description');
    copyIfDefined('shortDescription');
    copyIfDefined('sku');
    whitelisted.type = type;
    copyIfDefined('status');

    // Pricing
    copyIfDefined('price');
    copyIfDefined('salePrice');
    copyIfDefined('originalPrice');
    copyIfDefined('currency');

    // Inventory
    copyIfDefined('stockQuantity');
    copyIfDefined('stockStatus');
    copyIfDefined('manageStock');
    copyIfDefined('allowBackorders');

    // Shipping/physical
    copyIfDefined('weight');
    if (rest.dimensions && typeof rest.dimensions === 'object') {
      whitelisted.dimensions = {
        length: Number(rest.dimensions.length) || 0,
        width: Number(rest.dimensions.width) || 0,
        height: Number(rest.dimensions.height) || 0,
      };
    }

    // Relationships and taxonomy
    if (categories) whitelisted.categories = categories;
    copyIfDefined('tags');
    copyIfDefined('brand'); // should be brand id string

    // Media
    if (images) whitelisted.images = images;

    return whitelisted;
  },
  // Get all products with filters
  async getProducts(filters?: ProductFilters, page: number = 1, limit: number = 20): Promise<ApiResponse<any>> {
    // Backend NestJS only accepts PaginationDto (page, limit, sortBy, sortOrder) for most endpoints
    // Use specific endpoints based on filter priority: search > category > published > default
    
    // Extract page and limit from filters if provided, otherwise use function parameters
    const actualPage = filters?.page ?? page;
    const actualLimit = filters?.limit ?? limit;
    
    const buildPaginationParams = () => {
      const params = new URLSearchParams();
      if (filters?.sortBy) params.append('sortBy', filters.sortBy);
      if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);
      params.append('page', actualPage.toString());
      params.append('limit', actualLimit.toString());
      return params;
    };

    // Priority 1: Published products with category or search
    // Note: Backend endpoints don't combine status with other filters well,
    // so we use the most specific endpoint and filter client-side if needed
    if (filters?.status === 'published' && filters?.category) {
      // Use category endpoint, then filter for published status client-side if needed
      const categoryId = Array.isArray(filters.category) ? filters.category[0] : filters.category;
      const params = buildPaginationParams();
      const suffix = params.toString() ? `?${params.toString()}` : '';
      const response = await api.get(`/products/category/${categoryId}${suffix}`);
      // Response structure varies, so return as-is and let caller handle filtering
      return response.data;
    }

    // Priority 2: Search queries
    if (filters?.search) {
      const params = buildPaginationParams();
      params.append('q', filters.search);
      const suffix = params.toString() ? `?${params.toString()}` : '';
      const response = await api.get(`/products/search${suffix}`);
      return response.data;
    }

    // Priority 3: Category filtering (without published status requirement)
    if (filters?.category) {
      const categoryId = Array.isArray(filters.category) ? filters.category[0] : filters.category;
      const params = buildPaginationParams();
      const suffix = params.toString() ? `?${params.toString()}` : '';
      const response = await api.get(`/products/category/${categoryId}${suffix}`);
      return response.data;
    }

    // Priority 4: Published products only - use dedicated endpoint
    if (filters?.status === 'published') {
      const params = buildPaginationParams();
      const suffix = params.toString() ? `?${params.toString()}` : '';
      const response = await api.get(`/products/published${suffix}`);
      return response.data;
    }

    // Default: use base /products endpoint with only pagination params
    const params = buildPaginationParams();
    const response = await api.get(`/products?${params.toString()}`);
    return response.data;
  },

  // Get single product by ID
  async getProduct(id: string): Promise<ApiResponse<{ product: Product }>> {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Create new product
  async createProduct(productData: any): Promise<ApiResponse<{ product: Product }>> {
    const payload = productService.buildProductPayload(productData);
    // Debug payload to help diagnose backend 500s
    // eslint-disable-next-line no-console
    console.log('createProduct payload', payload);
    const response = await api.post('/products', payload);
    return response.data;
  },

  // Update product
  async updateProduct(id: string, productData: any): Promise<ApiResponse<{ product: Product }>> {
    const payload = productService.buildProductPayload(productData);
    // eslint-disable-next-line no-console
    console.log('updateProduct payload', id, payload);
    const response = await api.put(`/products/${id}`, payload);
    return response.data;
  },

  // Delete product
  async deleteProduct(id: string): Promise<ApiResponse<{ message: string }>> {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // Upload product images
  async uploadProductImages(id: string, images: File[]): Promise<ApiResponse<any>> {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append('images', image);
    });

    const response = await api.post(`/products/${id}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
}; 