import React, { useState } from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Product } from '../../types';
import FeaturesModal from './modals/FeaturesModal';
import ColorsModal from './modals/ColorsModal';
import AttributesModal from './modals/AttributesModal';
import HandworkModal from './modals/HandworkModal';
import BodyTypeModal from './modals/BodyTypeModal';
import SizesModal from './modals/SizesModal';

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
  const [isHandworkModalOpen, setIsHandworkModalOpen] = useState(false);
  const [isBodyTypeModalOpen, setIsBodyTypeModalOpen] = useState(false);
  const [isSizesModalOpen, setIsSizesModalOpen] = useState(false);
  const [isFeaturesModalOpen, setIsFeaturesModalOpen] = useState(false);
  const [isColorsModalOpen, setIsColorsModalOpen] = useState(false);
  const [isAttributesModalOpen, setIsAttributesModalOpen] = useState(false);

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
            {formData.colors?.map((color, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
              >
                {color}
              </span>
            ))}
            {(!formData.colors || formData.colors.length === 0) && (
              <span className="text-gray-500 text-sm">No colors added</span>
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
            {formData.attributes?.map((attribute, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {attribute}
              </span>
            ))}
            {(!formData.attributes || formData.attributes.length === 0) && (
              <span className="text-gray-500 text-sm">No attributes added</span>
            )}
          </div>
        </div>

        {/* Handwork Details */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Handwork Details
            </label>
            <button
              type="button"
              onClick={() => setIsHandworkModalOpen(true)}
              className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-700 border border-blue-300 rounded-md hover:bg-blue-50"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Manage Handwork
            </button>
          </div>
          <div className="flex flex-wrap gap-2 min-h-[2rem] p-3 border border-gray-200 rounded-md">
            {formData.handwork?.map((handwork, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
              >
                {handwork}
              </span>
            ))}
            {(!formData.handwork || formData.handwork.length === 0) && (
              <span className="text-gray-500 text-sm">No handwork details added</span>
            )}
          </div>
        </div>

        {/* Body Type Suitability */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Body Type Suitability
            </label>
            <button
              type="button"
              onClick={() => setIsBodyTypeModalOpen(true)}
              className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-700 border border-blue-300 rounded-md hover:bg-blue-50"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Manage Body Types
            </button>
          </div>
          <div className="flex flex-wrap gap-2 min-h-[2rem] p-3 border border-gray-200 rounded-md">
            {formData.bodyType?.map((bodyType, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
              >
                {bodyType}
              </span>
            ))}
            {(!formData.bodyType || formData.bodyType.length === 0) && (
              <span className="text-gray-500 text-sm">No body types added</span>
            )}
          </div>
        </div>

        {/* Available Sizes */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Available Sizes
            </label>
            <button
              type="button"
              onClick={() => setIsSizesModalOpen(true)}
              className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-700 border border-blue-300 rounded-md hover:bg-blue-50"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Manage Sizes
            </button>
          </div>
          <div className="flex flex-wrap gap-2 min-h-[2rem] p-3 border border-gray-200 rounded-md">
            {formData.availableSizes?.map((size, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {size}
              </span>
            ))}
            {(!formData.availableSizes || formData.availableSizes.length === 0) && (
              <span className="text-gray-500 text-sm">No sizes added</span>
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
      
      <HandworkModal
        isOpen={isHandworkModalOpen}
        onClose={() => setIsHandworkModalOpen(false)}
        handwork={formData.handwork || []}
        onHandworkChange={(handwork) => onFieldChange('handwork', handwork)}
      />
      
      <BodyTypeModal
        isOpen={isBodyTypeModalOpen}
        onClose={() => setIsBodyTypeModalOpen(false)}
        bodyTypes={formData.bodyType || []}
        onBodyTypesChange={(bodyTypes) => onFieldChange('bodyType', bodyTypes)}
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
