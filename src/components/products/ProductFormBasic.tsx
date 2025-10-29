import React from 'react';
import { Product, Category, Brand } from '../../types';

interface ProductFormBasicProps {
  formData: Partial<Product>;
  errors: Record<string, string>;
  categories: Category[];
  brands: Brand[];
  materials?: Array<{ _id: string; name: string }>;
  occasions?: Array<{ _id: string; name: string }>;
  seasons?: Array<{ _id: string; name: string }>;
  onFieldChange: (field: string, value: any) => void;
  onNestedFieldChange: (parentField: string, field: string, value: any) => void;
  onAddCategory?: () => void;
  onAddBrand?: () => void;
  onAddMaterial?: () => void;
  onAddOccasion?: () => void;
  onAddSeason?: () => void;
}

const ProductFormBasic: React.FC<ProductFormBasicProps> = ({
  formData,
  errors,
  categories,
  brands,
  materials = [],
  occasions = [],
  seasons = [],
  onFieldChange,
  onNestedFieldChange,
  onAddCategory,
  onAddBrand,
  onAddMaterial,
  onAddOccasion,
  onAddSeason,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">General Information</h2>
        
        {/* Product Name */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Name *
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
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        {/* SKU */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SKU *
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
          {errors.sku && (
            <p className="mt-1 text-sm text-red-600">{errors.sku}</p>
          )}
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
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
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        {/* Short Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Short Description
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={Array.isArray(formData.categories) ? formData.categories[0] || '' : formData.categories || ''}
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
            <button type="button" onClick={onAddCategory} className="mt-2 text-sm text-blue-600 hover:text-blue-700">
              + Add new category
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand
            </label>
            <select
              value={formData.brand || ''}
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
              <option value="Pastels">Pastels</option>
              <option value="Brights">Brights</option>
              <option value="Neutrals">Neutrals</option>
              <option value="Dark">Dark</option>
              <option value="Earthy">Earthy</option>
              <option value="Jewel Tones">Jewel Tones</option>
            </select>
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
              <option value="Solid">Solid</option>
              <option value="Floral">Floral</option>
              <option value="Geometric">Geometric</option>
              <option value="Abstract">Abstract</option>
              <option value="Striped">Striped</option>
              <option value="Polka Dot">Polka Dot</option>
              <option value="Embroidered">Embroidered</option>
            </select>
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
              <option value="Sleeveless">Sleeveless</option>
              <option value="Short">Short</option>
              <option value="3/4">3/4</option>
              <option value="Long">Long</option>
              <option value="Full">Full</option>
            </select>
          </div>
        </div>

        {/* Row 3: Neckline, Length, Fit, Age Group */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Neckline
            </label>
            <select
              value={formData.neckline || ''}
              onChange={(e) => onFieldChange('neckline', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Neckline</option>
              <option value="Round">Round</option>
              <option value="V-neck">V-neck</option>
              <option value="Boat">Boat</option>
              <option value="High">High</option>
              <option value="Off-shoulder">Off-shoulder</option>
              <option value="Halter">Halter</option>
              <option value="Sweetheart">Sweetheart</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Length
            </label>
            <select
              value={formData.length || ''}
              onChange={(e) => onFieldChange('length', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Length</option>
              <option value="Short">Short</option>
              <option value="Medium">Medium</option>
              <option value="Long">Long</option>
              <option value="Floor Length">Floor Length</option>
              <option value="Ankle Length">Ankle Length</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fit
            </label>
            <select
              value={formData.fit || ''}
              onChange={(e) => onFieldChange('fit', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Fit</option>
              <option value="Loose">Loose</option>
              <option value="Fitted">Fitted</option>
              <option value="Semi-fitted">Semi-fitted</option>
              <option value="Oversized">Oversized</option>
              <option value="A-line">A-line</option>
              <option value="Straight">Straight</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Age Group
            </label>
            <select
              value={formData.ageGroup || ''}
              onChange={(e) => onFieldChange('ageGroup', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Age Group</option>
              <option value="Young Adult">Young Adult</option>
              <option value="Adult">Adult</option>
              <option value="Mature">Mature</option>
            </select>
          </div>
        </div>

        {/* Care Instructions */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Care Instructions
          </label>
          <textarea
            value={formData.careInstructions || ''}
            onChange={(e) => onFieldChange('careInstructions', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Dry clean only, Hand wash in cold water"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductFormBasic;
