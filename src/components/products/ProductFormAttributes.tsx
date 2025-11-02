import React, { useState, useEffect } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Product, Attribute, Color } from '../../types';
import FeaturesModal from './modals/FeaturesModal';
import ColorsModal from './modals/ColorsModal';
import AttributesModal from './modals/AttributesModal';
import SizesModal from './modals/SizesModal';
import { attributeService, colorService } from '../../services/masterDataService';

interface ProductFormAttributesProps {
  formData: Partial<Product>;
  errors: Record<string, string>;
  onFieldChange: (field: string, value: any) => void;
}

const ProductFormAttributes: React.FC<ProductFormAttributesProps> = ({
  formData,
  errors,
  onFieldChange,
}) => {
  const [isFeaturesModalOpen, setIsFeaturesModalOpen] = useState(false);
  const [isColorsModalOpen, setIsColorsModalOpen] = useState(false);
  const [isAttributesModalOpen, setIsAttributesModalOpen] = useState(false);
  const [isSizesModalOpen, setIsSizesModalOpen] = useState(false);
  const [attributeMap, setAttributeMap] = useState<Record<string, Attribute>>({});
  const [colorMap, setColorMap] = useState<Record<string, Color>>({});

  // Load attribute and color data for display
  useEffect(() => {
    const loadData = async () => {
      // Load attributes
      try {
        const attrResponse = await attributeService.getAll();
        if (attrResponse.success && attrResponse.data) {
          const map: Record<string, Attribute> = {};
          attrResponse.data.forEach((attr: Attribute) => {
            map[attr._id] = attr;
          });
          setAttributeMap(map);
        }
      } catch (error) {
        console.error('Error loading attributes:', error);
      }

      // Load colors
      try {
        const colorResponse = await colorService.getAll();
        if (colorResponse.success && colorResponse.data) {
          const map: Record<string, Color> = {};
          colorResponse.data.forEach((color: Color) => {
            map[color._id] = color;
          });
          setColorMap(map);
        }
      } catch (error) {
        console.error('Error loading colors:', error);
      }
    };

    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Product Attributes</h2>
        
        {/* Features */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Product Features
            </label>
            <button
              type="button"
              onClick={() => setIsFeaturesModalOpen(true)}
              className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-700 border border-blue-300 rounded-md hover:bg-blue-50"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Manage Features
            </button>
          </div>
          <div className="flex flex-wrap gap-2 min-h-[2rem] p-3 border border-gray-200 rounded-md">
            {formData.features?.map((feature, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
              >
                {feature}
              </span>
            ))}
            {(!formData.features || formData.features.length === 0) && (
              <span className="text-gray-500 text-sm">No features added</span>
            )}
          </div>
        </div>

        {/* Colors */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Available Colors
            </label>
            <button
              type="button"
              onClick={() => setIsColorsModalOpen(true)}
              className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-700 border border-blue-300 rounded-md hover:bg-blue-50"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Manage Colors
            </button>
          </div>
          <div className="flex flex-wrap gap-2 min-h-[2rem] p-3 border border-gray-200 rounded-md">
            {formData.colors?.map((colorSelection, index) => {
              const color = colorMap[colorSelection.colorId];
              return (
                <div
                  key={index}
                  className="inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                >
                  {colorSelection.imageUrl && (
                    <img
                      src={colorSelection.imageUrl}
                      alt={color?.name || 'Color'}
                      className="w-4 h-4 rounded-full object-cover"
                    />
                  )}
                  <span>{color?.name || colorSelection.colorId}</span>
                </div>
              );
            })}
            {(!formData.colors || formData.colors.length === 0) && (
              <span className="text-gray-500 text-sm">No colors added</span>
            )}
          </div>
        </div>

        {/* Available Sizes */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Available Sizes
              </label>
              <p className="text-xs text-gray-500 mt-0.5">
                Add sizes to enable size-wise inventory management
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsSizesModalOpen(true)}
              className="flex items-center px-3 py-1 text-sm text-amber-600 hover:text-amber-700 border border-amber-300 rounded-md hover:bg-amber-50 transition-colors"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Manage Sizes
            </button>
          </div>
          <div className="flex flex-wrap gap-2 min-h-[2rem] p-3 border border-gray-200 rounded-md bg-gradient-to-br from-amber-50/50 to-orange-50/50">
            {formData.availableSizes && formData.availableSizes.length > 0 ? (
              formData.availableSizes.map((size, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold bg-amber-100 text-amber-800 border border-amber-200 shadow-sm"
                >
                  {size}
                </span>
              ))
            ) : (
              <span className="text-gray-500 text-sm">No sizes added</span>
            )}
          </div>
        </div>

        {/* Attributes */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Product Attributes
            </label>
            <button
              type="button"
              onClick={() => setIsAttributesModalOpen(true)}
              className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-700 border border-blue-300 rounded-md hover:bg-blue-50"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Manage Attributes
            </button>
          </div>
          <div className="flex flex-wrap gap-2 min-h-[2rem] p-3 border border-gray-200 rounded-md">
            {formData.attributes?.map((attributeId, index) => {
              const attribute = attributeMap[attributeId];
              return (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {attribute?.name || attributeId}
                </span>
              );
            })}
            {(!formData.attributes || formData.attributes.length === 0) && (
              <span className="text-gray-500 text-sm">No attributes added</span>
            )}
          </div>
        </div>

      </div>

      {/* Tags */}
      <div className="border-t pt-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Tags</h2>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Tags
          </label>
          <div className="flex flex-wrap gap-2 min-h-[2rem] p-3 border border-gray-200 rounded-md">
            {formData.tags?.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
              >
                {tag}
              </span>
            ))}
            {(!formData.tags || formData.tags.length === 0) && (
              <span className="text-gray-500 text-sm">No tags added</span>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Tags help customers find your product. Separate multiple tags with commas.
          </p>
        </div>
      </div>

      {/* Modals */}
      <FeaturesModal
        isOpen={isFeaturesModalOpen}
        onClose={() => setIsFeaturesModalOpen(false)}
        features={formData.features || []}
        onFeaturesChange={(features) => onFieldChange('features', features)}
      />
      
      <ColorsModal
        isOpen={isColorsModalOpen}
        onClose={() => setIsColorsModalOpen(false)}
        colors={formData.colors || []}
        onColorsChange={(colors) => onFieldChange('colors', colors)}
      />
      
      <AttributesModal
        isOpen={isAttributesModalOpen}
        onClose={() => setIsAttributesModalOpen(false)}
        attributes={formData.attributes || []}
        onAttributesChange={(attributes) => onFieldChange('attributes', attributes)}
      />
      
      <SizesModal
        isOpen={isSizesModalOpen}
        onClose={() => setIsSizesModalOpen(false)}
        sizes={formData.availableSizes || []}
        onSizesChange={(sizes) => onFieldChange('availableSizes', sizes)}
      />
    </div>
  );
};

export default ProductFormAttributes;
