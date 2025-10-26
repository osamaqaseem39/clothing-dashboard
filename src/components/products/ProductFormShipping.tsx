import React from 'react';
import { Product } from '../../types';

interface ProductFormShippingProps {
  formData: Partial<Product>;
  errors: Record<string, string>;
  onFieldChange: (field: string, value: any) => void;
}

const ProductFormShipping: React.FC<ProductFormShippingProps> = ({
  formData,
  errors,
  onFieldChange,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping Details</h2>
        
        {/* Weight */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Weight (kg)
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.weight || 0}
              onChange={(e) => onFieldChange('weight', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
            />
            <span className="absolute right-3 top-2 text-gray-500">kg</span>
          </div>
        </div>

        {/* Dimensions */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dimensions (cm)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Length</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.dimensions?.length || 0}
                  onChange={(e) => onFieldChange('dimensions', {
                    ...formData.dimensions,
                    length: parseFloat(e.target.value) || 0,
                  })}
                  className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.0"
                />
                <span className="absolute right-3 top-2 text-gray-500">cm</span>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Width</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.dimensions?.width || 0}
                  onChange={(e) => onFieldChange('dimensions', {
                    ...formData.dimensions,
                    width: parseFloat(e.target.value) || 0,
                  })}
                  className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.0"
                />
                <span className="absolute right-3 top-2 text-gray-500">cm</span>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Height</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.dimensions?.height || 0}
                  onChange={(e) => onFieldChange('dimensions', {
                    ...formData.dimensions,
                    height: parseFloat(e.target.value) || 0,
                  })}
                  className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.0"
                />
                <span className="absolute right-3 top-2 text-gray-500">cm</span>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Weight */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Shipping Weight (kg)
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.shippingWeight || 0}
              onChange={(e) => onFieldChange('shippingWeight', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
            />
            <span className="absolute right-3 top-2 text-gray-500">kg</span>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Weight used for shipping calculations (if different from product weight)
          </p>
        </div>

        {/* Shipping Dimensions */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Shipping Dimensions (cm)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Length</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.shippingDimensions?.length || 0}
                  onChange={(e) => onFieldChange('shippingDimensions', {
                    ...formData.shippingDimensions,
                    length: parseFloat(e.target.value) || 0,
                  })}
                  className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.0"
                />
                <span className="absolute right-3 top-2 text-gray-500">cm</span>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Width</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.shippingDimensions?.width || 0}
                  onChange={(e) => onFieldChange('shippingDimensions', {
                    ...formData.shippingDimensions,
                    width: parseFloat(e.target.value) || 0,
                  })}
                  className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.0"
                />
                <span className="absolute right-3 top-2 text-gray-500">cm</span>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Height</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.shippingDimensions?.height || 0}
                  onChange={(e) => onFieldChange('shippingDimensions', {
                    ...formData.shippingDimensions,
                    height: parseFloat(e.target.value) || 0,
                  })}
                  className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.0"
                />
                <span className="absolute right-3 top-2 text-gray-500">cm</span>
              </div>
            </div>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Dimensions used for shipping calculations (if different from product dimensions)
          </p>
        </div>
      </div>

      {/* Special Features */}
      <div className="border-t pt-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Special Features</h2>
        
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isLimitedEdition || false}
              onChange={(e) => onFieldChange('isLimitedEdition', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Limited Edition</span>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isCustomMade || false}
              onChange={(e) => onFieldChange('isCustomMade', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Custom Made</span>
          </div>
          
          {formData.isCustomMade && (
            <div className="ml-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Delivery Time (days)
              </label>
              <input
                type="number"
                min="0"
                value={formData.customDeliveryDays || 0}
                onChange={(e) => onFieldChange('customDeliveryDays', parseInt(e.target.value) || 0)}
                className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductFormShipping;
