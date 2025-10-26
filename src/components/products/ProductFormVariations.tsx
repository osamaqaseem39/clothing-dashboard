import React from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Product, ProductVariant } from '../../types';

interface ProductFormVariationsProps {
  formData: Partial<Product>;
  errors: Record<string, string>;
  onFieldChange: (field: string, value: any) => void;
}

const ProductFormVariations: React.FC<ProductFormVariationsProps> = ({
  formData,
  errors,
  onFieldChange,
}) => {
  const handleVariantChange = (index: number, field: string, value: any) => {
    const variants = [...(formData.variations || [])];
    variants[index] = { ...variants[index], [field]: value };
    onFieldChange('variations', variants);
  };

  const addVariant = () => {
    const newVariant: Omit<ProductVariant, '_id'> = {
      sku: '',
      name: `Variant ${(formData.variations?.length || 0) + 1}`,
      price: 0,
      comparePrice: 0,
      costPrice: 0,
      stockQuantity: 0,
      stockStatus: 'instock',
      weight: 0,
      dimensions: { length: 0, width: 0, height: 0 },
      attributes: {},
      images: [],
      isActive: true,
    };
    
    onFieldChange('variations', [...(formData.variations || []), newVariant]);
  };

  const removeVariant = (index: number) => {
    const variants = [...(formData.variations || [])];
    if (variants.length > 1) {
      variants.splice(index, 1);
      onFieldChange('variations', variants);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Product Variations</h2>
          <button
            type="button"
            onClick={addVariant}
            className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-300 rounded-md hover:bg-blue-100"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Variation
          </button>
        </div>

        {errors.variations && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{errors.variations}</p>
          </div>
        )}

        <div className="space-y-6">
          {(formData.variations || []).map((variant, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-md font-medium text-gray-900">
                  Variation {index + 1}
                </h3>
                {(formData.variations?.length || 0) > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* SKU */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SKU *
                  </label>
                  <input
                    type="text"
                    value={variant.sku}
                    onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors[`variant-${index}-sku`] ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="SKU"
                  />
                  {errors[`variant-${index}-sku`] && (
                    <p className="mt-1 text-xs text-red-600">{errors[`variant-${index}-sku`]}</p>
                  )}
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={variant.name}
                    onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors[`variant-${index}-name`] ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Variant name"
                  />
                  {errors[`variant-${index}-name`] && (
                    <p className="mt-1 text-xs text-red-600">{errors[`variant-${index}-name`]}</p>
                  )}
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">₨</span>
                    <input
                      type="number"
                      step="0.01"
                      value={variant.price}
                      onChange={(e) => handleVariantChange(index, 'price', parseFloat(e.target.value) || 0)}
                      className={`w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors[`variant-${index}-price`] ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="0.00"
                    />
                  </div>
                  {errors[`variant-${index}-price`] && (
                    <p className="mt-1 text-xs text-red-600">{errors[`variant-${index}-price`]}</p>
                  )}
                </div>

                {/* Compare Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Compare Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">₨</span>
                    <input
                      type="number"
                      step="0.01"
                      value={variant.comparePrice}
                      onChange={(e) => handleVariantChange(index, 'comparePrice', parseFloat(e.target.value) || 0)}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Cost Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cost Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">₨</span>
                    <input
                      type="number"
                      step="0.01"
                      value={variant.costPrice}
                      onChange={(e) => handleVariantChange(index, 'costPrice', parseFloat(e.target.value) || 0)}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Stock Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={variant.stockQuantity}
                    onChange={(e) => handleVariantChange(index, 'stockQuantity', parseInt(e.target.value) || 0)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors[`variant-${index}-stock`] ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="0"
                  />
                  {errors[`variant-${index}-stock`] && (
                    <p className="mt-1 text-xs text-red-600">{errors[`variant-${index}-stock`]}</p>
                  )}
                </div>

                {/* Weight */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Weight (kg)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      value={variant.weight}
                      onChange={(e) => handleVariantChange(index, 'weight', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                    <span className="absolute right-3 top-2 text-gray-500">kg</span>
                  </div>
                </div>

                {/* Dimensions */}
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dimensions (cm)
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Length</label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.1"
                          value={variant.dimensions.length}
                          onChange={(e) => handleVariantChange(index, 'dimensions', {
                            ...variant.dimensions,
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
                          value={variant.dimensions.width}
                          onChange={(e) => handleVariantChange(index, 'dimensions', {
                            ...variant.dimensions,
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
                          value={variant.dimensions.height}
                          onChange={(e) => handleVariantChange(index, 'dimensions', {
                            ...variant.dimensions,
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

                {/* Active Status */}
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={variant.isActive}
                      onChange={(e) => handleVariantChange(index, 'isActive', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">This variation is active</span>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>

        {(!formData.variations || formData.variations.length === 0) && (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500 mb-4">No variations added yet</p>
            <button
              type="button"
              onClick={addVariant}
              className="flex items-center mx-auto px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-300 rounded-md hover:bg-blue-100"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add First Variation
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductFormVariations;
