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
    const params = new URLSearchParams();
    
    if (filters?.search) params.append('search', filters.search);
    if (filters?.category) {
      // Backend expects categories as array, so we wrap single category in array
      const categoryArray = Array.isArray(filters.category) ? filters.category : [filters.category];
      categoryArray.forEach(cat => params.append('categories', cat));
    }
    if (filters?.categories) {
      filters.categories.forEach(cat => params.append('categories', cat));
    }
    if (filters?.brand) params.append('brand', filters.brand);
    if (filters?.brands) {
      filters.brands.forEach(brand => params.append('brands', brand));
    }
    if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters?.inStock !== undefined) params.append('inStock', filters.inStock.toString());
    if (filters?.rating) params.append('rating', filters.rating.toString());
    if (filters?.status) params.append('status', filters.status);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);
    
    params.append('page', page.toString());
    params.append('limit', limit.toString());

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