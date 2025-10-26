import React, { useState } from 'react';
import { PlusIcon } from '@heroicons/react/outline';
import { Product } from '../../types';
import ImageUpload from '../common/ImageUpload';

interface ProductFormSEOProps {
  formData: Partial<Product>;
  errors: Record<string, string>;
  onFieldChange: (field: string, value: any) => void;
  onNestedFieldChange: (parentField: string, field: string, value: any) => void;
}

const ProductFormSEO: React.FC<ProductFormSEOProps> = ({
  formData,
  errors,
  onFieldChange,
  onNestedFieldChange,
}) => {
  const [isKeywordsModalOpen, setIsKeywordsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">SEO Settings</h2>
        
        {/* SEO Title */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SEO Title
          </label>
          <input
            type="text"
            value={formData.seo?.title || ''}
            onChange={(e) => onNestedFieldChange('seo', 'title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="SEO optimized title"
            maxLength={60}
          />
          <p className="mt-1 text-sm text-gray-500">
            {formData.seo?.title?.length || 0}/60 characters
          </p>
        </div>

        {/* SEO Slug */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SEO Slug
          </label>
          <input
            type="text"
            value={formData.seo?.slug || ''}
            onChange={(e) => onNestedFieldChange('seo', 'slug', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="seo-friendly-url"
          />
          <p className="mt-1 text-sm text-gray-500">
            URL: /products/{formData.seo?.slug || 'your-slug'}
          </p>
        </div>

        {/* Meta Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meta Description
          </label>
          <textarea
            value={formData.seo?.description || ''}
            onChange={(e) => onNestedFieldChange('seo', 'description', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Meta description for search engines"
            maxLength={160}
          />
          <p className="mt-1 text-sm text-gray-500">
            {formData.seo?.description?.length || 0}/160 characters
          </p>
        </div>

        {/* Keywords */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Keywords
            </label>
            <button
              type="button"
              onClick={() => setIsKeywordsModalOpen(true)}
              className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-700 border border-blue-300 rounded-md hover:bg-blue-50"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Manage Keywords
            </button>
          </div>
          <div className="flex flex-wrap gap-2 min-h-[2rem] p-3 border border-gray-200 rounded-md">
            {formData.seo?.keywords?.map((keyword, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                {keyword}
              </span>
            ))}
            {(!formData.seo?.keywords || formData.seo.keywords.length === 0) && (
              <span className="text-gray-500 text-sm">No keywords added</span>
            )}
          </div>
        </div>

        {/* Canonical URL */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Canonical URL
          </label>
          <input
            type="url"
            value={formData.seo?.canonicalUrl || ''}
            onChange={(e) => onNestedFieldChange('seo', 'canonicalUrl', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://example.com/canonical-url"
          />
          <p className="mt-1 text-sm text-gray-500">
            Leave empty to use the default product URL
          </p>
        </div>

        {/* Open Graph Image */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Open Graph Image
          </label>
          <ImageUpload
            onImageUpload={(url) => onNestedFieldChange('seo', 'ogImage', url)}
            onImageRemove={() => onNestedFieldChange('seo', 'ogImage', '')}
            existingImages={formData.seo?.ogImage ? [formData.seo.ogImage] : []}
            maxImages={1}
          />
        </div>

        {/* SEO Options */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-4">
            SEO Options
          </label>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.seo?.noIndex || false}
                onChange={(e) => onNestedFieldChange('seo', 'noIndex', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">No Index</span>
            </label>
            <p className="ml-6 text-sm text-gray-500">
              Prevent search engines from indexing this product
            </p>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.seo?.noFollow || false}
                onChange={(e) => onNestedFieldChange('seo', 'noFollow', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">No Follow</span>
            </label>
            <p className="ml-6 text-sm text-gray-500">
              Prevent search engines from following links on this product page
            </p>
          </div>
        </div>
      </div>

      {/* SEO Preview */}
      <div className="border-t pt-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Search Engine Preview</h2>
        
        <div className="border border-gray-200 rounded-lg p-4 bg-white">
          <div className="text-blue-600 text-lg hover:underline cursor-pointer">
            {formData.seo?.title || formData.name || 'Product Title'}
          </div>
          <div className="text-green-600 text-sm mt-1">
            https://yoursite.com/products/{formData.seo?.slug || 'product-slug'}
          </div>
          <div className="text-gray-600 text-sm mt-2">
            {formData.seo?.description || formData.description || 'Product description will appear here...'}
          </div>
        </div>
      </div>

      {/* SEO Guidelines */}
      <div className="border-t pt-6">
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <h3 className="text-sm font-medium text-yellow-900 mb-2">SEO Best Practices</h3>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• Use descriptive, keyword-rich titles (50-60 characters)</li>
            <li>• Write compelling meta descriptions (150-160 characters)</li>
            <li>• Include relevant keywords naturally</li>
            <li>• Use hyphens in URLs for better readability</li>
            <li>• Optimize images with descriptive alt text</li>
            <li>• Create unique content for each product</li>
          </ul>
        </div>
      </div>

      {/* Keywords Modal would be imported here */}
      {/* 
      <KeywordsModal
        isOpen={isKeywordsModalOpen}
        onClose={() => setIsKeywordsModalOpen(false)}
        keywords={formData.seo?.keywords || []}
        onKeywordsChange={(keywords) => onNestedFieldChange('seo', 'keywords', keywords)}
      />
      */}
    </div>
  );
};

export default ProductFormSEO;
