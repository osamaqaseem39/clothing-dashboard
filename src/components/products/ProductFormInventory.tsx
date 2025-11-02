import React, { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Product } from '../../types';
import SizesModal from './modals/SizesModal';

interface ProductFormInventoryProps {
  formData: Partial<Product>;
  errors: Record<string, string>;
  onFieldChange: (field: string, value: any) => void;
}

const ProductFormInventory: React.FC<ProductFormInventoryProps> = ({
  formData,
  errors,
  onFieldChange,
}) => {
  const [isSizesModalOpen, setIsSizesModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Inventory Management</h2>
        
        {/* Available Sizes */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Available Sizes
            </label>
            <button
              type="button"
              onClick={() => setIsSizesModalOpen(true)}
              className="flex items-center px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Manage Sizes
            </button>
          </div>
          <div className="flex flex-wrap gap-2 min-h-[2rem] p-2 border border-gray-300 rounded-md bg-gray-50">
            {formData.availableSizes && formData.availableSizes.length > 0 ? (
              formData.availableSizes.map((size, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {size}
                </span>
              ))
            ) : (
              <span className="text-gray-500 text-sm">No sizes added. Add sizes to manage inventory size-wise.</span>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-500">
            When sizes are added, inventory will be managed per size. The total stock quantity will be the sum of all sizes.
          </p>
        </div>

        {/* Stock Status */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stock Status
          </label>
          <select
            value={formData.stockStatus || 'instock'}
            onChange={(e) => onFieldChange('stockStatus', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="instock">In Stock</option>
            <option value="outofstock">Out of Stock</option>
            <option value="onbackorder">On Backorder</option>
          </select>
        </div>

        {/* Stock Quantity */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stock Quantity *
          </label>
          <input
            type="number"
            min="0"
            value={formData.stockQuantity === 0 ? '' : (formData.stockQuantity || '')}
            onChange={(e) => onFieldChange('stockQuantity', e.target.value === '' ? 0 : (parseInt(e.target.value) || 0))}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.stockQuantity ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="0"
          />
          <p className="mt-1 text-sm text-gray-500">Enter available quantity (0 or higher).</p>
          {errors.stockQuantity && (
            <p className="mt-1 text-sm text-red-600">{errors.stockQuantity}</p>
          )}
        </div>

        {/* Manage Stock */}
        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.manageStock ?? true}
              onChange={(e) => onFieldChange('manageStock', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Manage stock for this product</span>
          </label>
        </div>

        {/* Allow Backorders */}
        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.allowBackorders ?? false}
              onChange={(e) => onFieldChange('allowBackorders', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Allow backorders</span>
          </label>
        </div>
      </div>

      {/* Pricing */}
      <div className="border-t pt-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Pricing</h2>
        
        {/* Regular Price */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Regular Price *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">₨</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.price === 0 ? '' : (formData.price || '')}
              onChange={(e) => onFieldChange('price', e.target.value === '' ? 0 : (parseFloat(e.target.value) || 0))}
              className={`w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.price ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="0.00"
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">Base selling price before any discounts.</p>
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price}</p>
          )}
        </div>

        {/* Sale Price */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sale Price
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">₨</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.salePrice === 0 ? '' : (formData.salePrice || '')}
              onChange={(e) => onFieldChange('salePrice', e.target.value === '' ? 0 : (parseFloat(e.target.value) || 0))}
              className={`w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.salePrice ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="0.00"
            />
          </div>
          {errors.salePrice && (
            <p className="mt-1 text-sm text-red-600">{errors.salePrice}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">Must be lower than Regular Price. Leave empty to disable sale pricing.</p>
        </div>

        {/* Cost Price */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cost Price
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">₨</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.originalPrice === 0 ? '' : (formData.originalPrice || '')}
              onChange={(e) => onFieldChange('originalPrice', e.target.value === '' ? 0 : (parseFloat(e.target.value) || 0))}
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Cost price for profit calculations
          </p>
        </div>
      </div>

      {/* Model Measurements */}
      <div className="border-t pt-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Model Measurements</h2>
        <p className="text-sm text-gray-600 mb-4">
          Reference measurements for size guidance
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
            <input
              type="text"
              value={formData.modelMeasurements?.height || ''}
              onChange={(e) => onFieldChange('modelMeasurements', {
                ...formData.modelMeasurements,
                height: e.target.value,
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 5'6&quot;"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Chest</label>
            <input
              type="text"
              value={formData.modelMeasurements?.bust || ''}
              onChange={(e) => onFieldChange('modelMeasurements', {
                ...formData.modelMeasurements,
                bust: e.target.value,
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 34&quot;"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Waist</label>
            <input
              type="text"
              value={formData.modelMeasurements?.waist || ''}
              onChange={(e) => onFieldChange('modelMeasurements', {
                ...formData.modelMeasurements,
                waist: e.target.value,
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 28&quot;"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hips</label>
            <input
              type="text"
              value={formData.modelMeasurements?.hips || ''}
              onChange={(e) => onFieldChange('modelMeasurements', {
                ...formData.modelMeasurements,
                hips: e.target.value,
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 36&quot;"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Size Wearing</label>
            <input
              type="text"
              value={formData.modelMeasurements?.sizeWearing || ''}
              onChange={(e) => onFieldChange('modelMeasurements', {
                ...formData.modelMeasurements,
                sizeWearing: e.target.value,
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., M"
            />
          </div>
        </div>
      </div>

      {/* Sizes Modal */}
      <SizesModal
        isOpen={isSizesModalOpen}
        onClose={() => setIsSizesModalOpen(false)}
        sizes={formData.availableSizes || []}
        onSizesChange={(sizes) => onFieldChange('availableSizes', sizes)}
      />
    </div>
  );
};

export default ProductFormInventory;
