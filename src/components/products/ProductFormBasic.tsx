import React from 'react';
import { Product, Category, Brand } from '../../types';
import InfoIcon from '../ui/InfoIcon';

interface ProductFormBasicProps {
  formData: Partial<Product>;
  errors: Record<string, string>;
  categories: Category[];
  brands: Brand[];
  materials?: Array<{ _id: string; name: string }>;
  occasions?: Array<{ _id: string; name: string }>;
  seasons?: Array<{ _id: string; name: string }>;
  colorFamilies?: Array<{ _id: string; name: string }>;
  patterns?: Array<{ _id: string; name: string }>;
  sleeveLengths?: Array<{ _id: string; name: string }>;
  necklines?: Array<{ _id: string; name: string }>;
  lengths?: Array<{ _id: string; name: string }>;
  fits?: Array<{ _id: string; name: string }>;
  ageGroups?: Array<{ _id: string; name: string }>;
  onFieldChange: (field: string, value: any) => void;
  onNestedFieldChange: (parentField: string, field: string, value: any) => void;
  onAddCategory?: () => void;
  onAddBrand?: () => void;
  onAddMaterial?: () => void;
  onAddOccasion?: () => void;
  onAddSeason?: () => void;
  onAddColorFamily?: () => void;
  onAddPattern?: () => void;
  onAddSleeveLength?: () => void;
  onAddNeckline?: () => void;
  onAddLength?: () => void;
  onAddFit?: () => void;
  onAddAgeGroup?: () => void;
}

const ProductFormBasic: React.FC<ProductFormBasicProps> = ({
  formData,
  errors,
  categories,
  brands,
  materials = [],
  occasions = [],
  seasons = [],
  colorFamilies = [],
  patterns = [],
  sleeveLengths = [],
  onFieldChange,
  onNestedFieldChange,
  onAddCategory,
  onAddBrand,
  onAddMaterial,
  onAddOccasion,
  onAddSeason,
  onAddColorFamily,
  onAddPattern,
  onAddSleeveLength,
}) => {
  // Helper function to extract ID from value (handles both objects and strings)
  const extractId = (value: any): string => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && '_id' in value) return value._id;
    return '';
  };

  // Get category ID for select value
  const getCategoryValue = (): string => {
    if (Array.isArray(formData.categories)) {
      return formData.categories.length > 0 ? extractId(formData.categories[0]) : '';
    }
    return extractId(formData.categories);
  };

  // Get brand ID for select value
  const getBrandValue = (): string => {
    return extractId(formData.brand);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">General Information</h2>
        
        {/* Product Name */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            Product Name *
            <InfoIcon content="Enter a clear, descriptive product name. This will be displayed to customers and used for SEO. Minimum 3 characters required." />
          </label>
          <input
            type="text"
            value={formData.name || ''}
            onChange={(e) => onFieldChange('name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.name ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter product name"
          />
          <p className="mt-1 text-sm text-gray-500">Use a clear, descriptive title (min 3 characters).</p>
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        {/* SKU */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            SKU *
            <InfoIcon content="Stock Keeping Unit - unique identifier for inventory tracking. Use letters, numbers, dashes, underscores, and dots only." />
          </label>
          <input
            type="text"
            value={formData.sku || ''}
            onChange={(e) => onFieldChange('sku', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.sku ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter SKU"
          />
          <p className="mt-1 text-sm text-gray-500">Allowed: letters, numbers, dashes, underscores, and dots.</p>
          {errors.sku && (
            <p className="mt-1 text-sm text-red-600">{errors.sku}</p>
          )}
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            Description *
            <InfoIcon content="Detailed product description. Include key features, materials, care instructions, and any important details customers should know. Minimum 20 characters required." />
          </label>
          <textarea
            value={formData.description || ''}
            onChange={(e) => onFieldChange('description', e.target.value)}
            rows={6}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.description ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter product description"
          />
          <p className="mt-1 text-sm text-gray-500">Provide key details, materials, and care (min 20 characters).</p>
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        {/* Short Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            Short Description
            <InfoIcon content="Brief summary used in product cards, search results, and meta descriptions. Should be concise and compelling." />
          </label>
          <textarea
            value={formData.shortDescription || ''}
            onChange={(e) => onFieldChange('shortDescription', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Brief product summary"
          />
        </div>

        {/* Category and Brand */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              Category
              <InfoIcon content="Select the main category for this product. Categories help organize products and improve navigation. Products can appear in category listings and search results." />
            </label>
            <select
              value={getCategoryValue()}
              onChange={(e) => onFieldChange('categories', e.target.value ? [e.target.value] : [])}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">Choose the most relevant category.</p>
            {errors.categories && (
              <p className="mt-1 text-sm text-red-600">{errors.categories}</p>
            )}
            <button type="button" onClick={onAddCategory} className="mt-2 text-sm text-blue-600 hover:text-blue-700">
              + Add new category
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              Brand
              <InfoIcon content="Optional: Select the brand or manufacturer. Brands help customers filter and find products. Useful for brand-aware shoppers." />
            </label>
            <select
              value={getBrandValue()}
              onChange={(e) => onFieldChange('brand', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Brand</option>
              {brands.map((brand) => (
                <option key={brand._id} value={brand._id}>
                  {brand.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">Optional but recommended for brand-aware shoppers.</p>
            <button type="button" onClick={onAddBrand} className="mt-2 text-sm text-blue-600 hover:text-blue-700">
              + Add new brand
            </button>
          </div>
        </div>

        {/* Status */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={formData.status || 'draft'}
            onChange={(e) => onFieldChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Active Status */}
        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isActive ?? true}
              onChange={(e) => onFieldChange('isActive', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Product is active</span>
          </label>
        </div>
      </div>

      {/* Pakistani Clothing Specific Fields */}
      <div className="border-t pt-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Clothing Details</h2>
        
        {/* Row 1: Fabric, Collection, Occasion, Season */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fabric Type
            </label>
            <select
              value={formData.fabric || ''}
              onChange={(e) => onFieldChange('fabric', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Fabric</option>
              {materials.map((m) => (
                <option key={m._id} value={m.name}>{m.name}</option>
              ))}
            </select>
            <button type="button" onClick={onAddMaterial} className="mt-2 text-sm text-blue-600 hover:text-blue-700">
              + Add new fabric type
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Collection
            </label>
            <input
              type="text"
              value={formData.collectionName || ''}
              onChange={(e) => onFieldChange('collectionName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Summer 2024"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Occasion
            </label>
            <select
              value={formData.occasion || ''}
              onChange={(e) => onFieldChange('occasion', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Occasion</option>
              {occasions.map(o => (
                <option key={o._id} value={o.name}>{o.name}</option>
              ))}
            </select>
            <button type="button" onClick={onAddOccasion} className="mt-2 text-sm text-blue-600 hover:text-blue-700">
              + Add new occasion
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Season
            </label>
            <select
              value={formData.season || ''}
              onChange={(e) => onFieldChange('season', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Season</option>
              {seasons.map(s => (
                <option key={s._id} value={s.name}>{s.name}</option>
              ))}
            </select>
            <button type="button" onClick={onAddSeason} className="mt-2 text-sm text-blue-600 hover:text-blue-700">
              + Add new season
            </button>
          </div>
        </div>

        {/* Row 2: Designer, Color Family, Pattern, Sleeve Length */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Designer
            </label>
            <input
              type="text"
              value={formData.designer || ''}
              onChange={(e) => onFieldChange('designer', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Designer/Design House"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color Family
            </label>
            <select
              value={formData.colorFamily || ''}
              onChange={(e) => onFieldChange('colorFamily', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Color Family</option>
              {colorFamilies.map(cf => (
                <option key={cf._id} value={cf.name}>{cf.name}</option>
              ))}
            </select>
            <button type="button" onClick={onAddColorFamily} className="mt-2 text-sm text-blue-600 hover:text-blue-700">
              + Add new color family
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pattern
            </label>
            <select
              value={formData.pattern || ''}
              onChange={(e) => onFieldChange('pattern', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Pattern</option>
              {patterns.map(p => (
                <option key={p._id} value={p.name}>{p.name}</option>
              ))}
            </select>
            <button type="button" onClick={onAddPattern} className="mt-2 text-sm text-blue-600 hover:text-blue-700">
              + Add new pattern
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sleeve Length
            </label>
            <select
              value={formData.sleeveLength || ''}
              onChange={(e) => onFieldChange('sleeveLength', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Sleeve Length</option>
              {sleeveLengths.map(s => (
                <option key={s._id} value={s.name}>{s.name}</option>
              ))}
            </select>
            <button type="button" onClick={onAddSleeveLength} className="mt-2 text-sm text-blue-600 hover:text-blue-700">
              + Add new sleeve length
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFormBasic;
