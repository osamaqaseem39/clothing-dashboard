import React from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/outline';
import { Product } from '../../types';
import ImageUpload from '../common/ImageUpload';

interface ProductFormImagesProps {
  formData: Partial<Product>;
  errors: Record<string, string>;
  onFieldChange: (field: string, value: any) => void;
}

const ProductFormImages: React.FC<ProductFormImagesProps> = ({
  formData,
  errors,
  onFieldChange,
}) => {
  const handleImageUpload = (imageUrl: string) => {
    const images = [...(formData.images || []), imageUrl];
    onFieldChange('images', images);
  };

  const handleImageRemove = (index: number) => {
    const images = [...(formData.images || [])];
    images.splice(index, 1);
    onFieldChange('images', images);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Product Images</h2>
        
        {/* Image Upload Component */}
        <ImageUpload
          onImageUpload={handleImageUpload}
          onImageRemove={handleImageRemove}
          existingImages={formData.images || []}
          maxImages={10}
        />

        {/* Image Guidelines */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Image Guidelines</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Use high-quality images (minimum 800x800px)</li>
            <li>• First image will be used as the main product image</li>
            <li>• Supported formats: JPG, PNG, WebP</li>
            <li>• Maximum file size: 5MB per image</li>
            <li>• Use square aspect ratio for best results</li>
          </ul>
        </div>
      </div>

      {/* Size Chart Image */}
      <div className="border-t pt-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Size Chart Image</h2>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Size Chart Image
          </label>
          <ImageUpload
            onImageUpload={(url) => onFieldChange('sizeChartImageUrl', url)}
            onImageRemove={() => onFieldChange('sizeChartImageUrl', '')}
            existingImages={formData.sizeChartImageUrl ? [formData.sizeChartImageUrl] : []}
            maxImages={1}
          />
        </div>

        {formData.sizeChartImageUrl && (
          <div className="mb-4">
            <div className="max-w-md">
              <img
                src={formData.sizeChartImageUrl}
                alt="Size chart preview"
                className="w-full h-auto object-contain border border-gray-200 rounded-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="hidden text-center text-gray-500 py-8 border border-gray-200 rounded-lg">
                <div className="text-2xl mb-2">📏</div>
                <div className="text-sm">Size chart image not found</div>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Size Chart Guidelines</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Use clear, high-resolution images</li>
            <li>• Include measurements in inches or centimeters</li>
            <li>• Show how to measure each body part</li>
            <li>• Recommended size: 600x800px or larger</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductFormImages;
