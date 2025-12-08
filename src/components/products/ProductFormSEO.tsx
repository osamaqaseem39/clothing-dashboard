import React, { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Product } from '../../types';
import ImageUpload from '../common/ImageUpload';
import KeywordsModal from './modals/KeywordsModal';
import InfoIcon from '../ui/InfoIcon';

interface ProductFormSEOProps {
  formData: Partial<Product> | any; // Allow flexible form data type
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
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            SEO Title
            <InfoIcon content="Title shown in search engine results. Keep it 50-60 characters for optimal display. Should include important keywords and be compelling. Defaults to product name if empty." />
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={formData.seo?.title || ''}
              onChange={(e) => onNestedFieldChange('seo', 'title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="SEO optimized title (defaults to product name)"
              maxLength={60}
            />
            <button
              type="button"
              onClick={() => {
                if (formData.name) {
                  onNestedFieldChange('seo', 'title', formData.name);
                }
              }}
              className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 border border-blue-300 rounded-md hover:bg-blue-50 whitespace-nowrap"
              disabled={!formData.name}
            >
              Use Name
            </button>
          </div>
          <p className={`mt-1 text-sm ${(formData.seo?.title?.length || 0) > 60 ? 'text-red-500' : 'text-gray-500'}`}>
            {formData.seo?.title?.length || 0}/60 characters
            {(formData.seo?.title?.length || 0) > 60 && ' (too long)'}
          </p>
        </div>

        {/* SEO Slug */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            SEO Slug
            <InfoIcon content="URL-friendly version for SEO. Uses lowercase letters, numbers, and hyphens. If empty, uses the main product slug. Should be descriptive and keyword-rich." />
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={formData.seo?.slug || ''}
              onChange={(e) => {
                const slug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
                onNestedFieldChange('seo', 'slug', slug);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="seo-friendly-url"
            />
            <button
              type="button"
              onClick={() => {
                if (formData.name) {
                  const generatedSlug = formData.name
                    .toLowerCase()
                    .trim()
                    .replace(/[^\w\s-]/g, '')
                    .replace(/[\s_-]+/g, '-')
                    .replace(/^-+|-+$/g, '');
                  onNestedFieldChange('seo', 'slug', generatedSlug);
                }
              }}
              className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 border border-blue-300 rounded-md hover:bg-blue-50 whitespace-nowrap"
              disabled={!formData.name}
            >
              Generate
            </button>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            URL: /products/{formData.seo?.slug || 'your-slug'}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Leave empty to use the main product slug
          </p>
        </div>

        {/* Meta Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            Meta Description
            <InfoIcon content="Description shown in search engine results (150-160 characters recommended). Should be compelling and include key product benefits. Defaults to short description if empty." />
          </label>
          <div className="flex gap-2">
            <textarea
              value={formData.seo?.description || ''}
              onChange={(e) => onNestedFieldChange('seo', 'description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Meta description for search engines (defaults to short description)"
              maxLength={160}
            />
            <button
              type="button"
              onClick={() => {
                if ((formData as any).shortDescription) {
                  onNestedFieldChange('seo', 'description', (formData as any).shortDescription.substring(0, 160));
                } else if (formData.description) {
                  onNestedFieldChange('seo', 'description', formData.description.substring(0, 160));
                }
              }}
              className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 border border-blue-300 rounded-md hover:bg-blue-50 whitespace-nowrap self-start"
              disabled={!(formData as any).shortDescription && !formData.description}
            >
              Use Short Desc
            </button>
          </div>
          <p className={`mt-1 text-sm ${(formData.seo?.description?.length || 0) > 160 ? 'text-red-500' : 'text-gray-500'}`}>
            {formData.seo?.description?.length || 0}/160 characters
            {(formData.seo?.description?.length || 0) > 160 && ' (too long)'}
          </p>
        </div>

        {/* Keywords */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              Keywords
              <InfoIcon content="Relevant search keywords for this product. Used for SEO and internal search. Add keywords that customers might use to find this product." />
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
            {formData.seo?.keywords?.map((keyword: string, index: number) => (
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
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            Canonical URL
            <InfoIcon content="Preferred URL for this product page. Used to prevent duplicate content issues. Should be a full URL starting with http:// or https://. Leave empty to use default product URL." />
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={formData.seo?.canonicalUrl || ''}
              onChange={(e) => {
                const url = e.target.value.trim();
                onNestedFieldChange('seo', 'canonicalUrl', url);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://yoursite.com/products/product-slug"
            />
            <button
              type="button"
              onClick={() => {
                // Auto-generate canonical URL from product slug
                const baseUrl = window.location.origin || 'https://yoursite.com';
                const productSlug = formData.seo?.slug || (formData as any).slug || '';
                if (productSlug) {
                  const canonicalUrl = `${baseUrl}/products/${productSlug}`;
                  onNestedFieldChange('seo', 'canonicalUrl', canonicalUrl);
                } else {
                  // If no slug, use product ID
                  const productId = (formData as any)._id || '';
                  if (productId) {
                    const canonicalUrl = `${baseUrl}/products/${productId}`;
                    onNestedFieldChange('seo', 'canonicalUrl', canonicalUrl);
                  }
                }
              }}
              className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 border border-blue-300 rounded-md hover:bg-blue-50 whitespace-nowrap"
              disabled={!formData.seo?.slug && !(formData as any).slug && !(formData as any)._id}
            >
              Auto Generate
            </button>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {formData.seo?.canonicalUrl ? (
              <>
                Canonical URL: <span className="font-mono text-xs">{formData.seo.canonicalUrl}</span>
              </>
            ) : (
              <>
                Leave empty to use the default product URL: <span className="font-mono text-xs">/products/{formData.seo?.slug || (formData as any).slug || 'product-slug'}</span>
              </>
            )}
          </p>
          {formData.seo?.canonicalUrl && !formData.seo.canonicalUrl.match(/^https?:\/\//) && (
            <p className="mt-1 text-sm text-red-500">
              Canonical URL must start with http:// or https://
            </p>
          )}
        </div>

        {/* Open Graph Image */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            Open Graph Image
            <InfoIcon content="Image shown when this product is shared on social media (Facebook, Twitter, etc.). Recommended size: 1200x630px. If not set, uses the first product image." />
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
          <label className="block text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
            SEO Options
            <InfoIcon content="No Index: Prevents search engines from indexing this product. No Follow: Prevents search engines from following links on this page. Use these for test products or pages you don't want in search results." />
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
            https://yoursite.com/products/{formData.seo?.slug || (formData as any).slug || 'product-slug'}
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

      {/* Keywords Modal */}
      <KeywordsModal
        isOpen={isKeywordsModalOpen}
        onClose={() => setIsKeywordsModalOpen(false)}
        keywords={formData.seo?.keywords || []}
        onKeywordsChange={(keywords) => onNestedFieldChange('seo', 'keywords', keywords)}
      />
    </div>
  );
};

export default ProductFormSEO;
