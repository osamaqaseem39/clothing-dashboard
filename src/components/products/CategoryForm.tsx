import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Category } from '../../types';
import ImageUpload from '../common/ImageUpload';

interface CategoryFormProps {
  category?: Category;
  parentCategories: Category[];
  onSubmit: (categoryData: Partial<Category>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  parentCategories,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    description: category?.description || '',
    parentId: category?.parentId || '',
    isActive: category?.isActive ?? true,
    image: category?.image || '',
    icon: category?.icon || '',
    color: category?.color || '',
    sortOrder: category?.sortOrder ?? 0,
    metaTitle: category?.metaTitle || '',
    metaDescription: category?.metaDescription || '',
    metaKeywords: category?.metaKeywords || [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form data when category prop changes (e.g., after async load)
  useEffect(() => {
    if (category && category._id) {
      console.log('CategoryForm: Updating form with category:', category);
      // Handle parentId - it might be a string or an object with _id
      let parentId = '';
      if (category.parentId) {
        parentId = typeof category.parentId === 'string' 
          ? category.parentId 
          : (category.parentId as any)?._id || '';
      }
      
      setFormData({
        name: category.name || '',
        slug: category.slug || '',
        description: category.description || '',
        parentId: parentId,
        isActive: (category as any).isActive !== undefined ? (category as any).isActive : true,
        image: category.image || '',
        icon: (category as any).icon || '',
        color: (category as any).color || '',
        sortOrder: (category as any).sortOrder ?? 0,
        metaTitle: (category as any).metaTitle || '',
        metaDescription: (category as any).metaDescription || '',
        metaKeywords: (category as any).metaKeywords || [],
      });
    } else if (!category) {
      // Reset form for new category
      setFormData({
        name: '',
        slug: '',
        description: '',
        parentId: '',
        isActive: true,
        image: '',
        icon: '',
        color: '',
        sortOrder: 0,
        metaTitle: '',
        metaDescription: '',
        metaKeywords: [],
      });
    }
  }, [category]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Category slug is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const categoryData: any = {
      name: formData.name.trim(),
      slug: formData.slug.trim(),
      description: formData.description.trim(),
      isActive: formData.isActive,
      sortOrder: formData.sortOrder,
    };

    // Only include parentId if it's not empty
    if (formData.parentId && formData.parentId.trim() !== '') {
      categoryData.parentId = formData.parentId;
    }

    // Include image if present
    if (formData.image && formData.image.trim() !== '') {
      categoryData.image = formData.image.trim();
    }

    // Include icon if present
    if (formData.icon && formData.icon.trim() !== '') {
      categoryData.icon = formData.icon.trim();
    }

    // Include color if present
    if (formData.color && formData.color.trim() !== '') {
      categoryData.color = formData.color.trim();
    }

    // Include SEO fields if present
    if (formData.metaTitle && formData.metaTitle.trim() !== '') {
      categoryData.metaTitle = formData.metaTitle.trim();
    }
    if (formData.metaDescription && formData.metaDescription.trim() !== '') {
      categoryData.metaDescription = formData.metaDescription.trim();
    }
    if (formData.metaKeywords && formData.metaKeywords.length > 0) {
      categoryData.metaKeywords = formData.metaKeywords;
    }

    await onSubmit(categoryData);
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear field-specific error
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const generateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    handleChange('slug', slug);
  };

  const handleKeywordAdd = (keyword: string) => {
    const trimmed = keyword.trim();
    if (trimmed && !formData.metaKeywords.includes(trimmed)) {
      handleChange('metaKeywords', [...formData.metaKeywords, trimmed]);
    }
  };

  const handleKeywordRemove = (keywordToRemove: string) => {
    handleChange('metaKeywords', formData.metaKeywords.filter(k => k !== keywordToRemove));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {category ? 'Edit Category' : 'Add New Category'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
          type="button"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`input-field ${errors.name ? 'border-red-300' : ''}`}
                placeholder="Enter category name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleChange('slug', e.target.value)}
                  className={`input-field flex-1 ${errors.slug ? 'border-red-300' : ''}`}
                  placeholder="category-slug"
                />
                <button
                  type="button"
                  onClick={generateSlug}
                  className="btn btn-secondary whitespace-nowrap"
                >
                  Generate
                </button>
              </div>
              {errors.slug && (
                <p className="mt-1 text-sm text-red-600">{errors.slug}</p>
              )}
            </div>
          </div>

          {/* Parent Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Parent Category
            </label>
            <select
              value={formData.parentId}
              onChange={(e) => handleChange('parentId', e.target.value)}
              className="input-field"
            >
              <option value="">No Parent (Top Level)</option>
              {parentCategories
                .filter(cat => cat._id !== category?._id) // Prevent self-reference
                .map((parentCategory) => (
                  <option key={parentCategory._id} value={parentCategory._id}>
                    {parentCategory.name}
                  </option>
                ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">
              Leave empty to create a top-level category
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              className="input-field"
              placeholder="Enter category description"
            />
          </div>

          {/* Visual Settings */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Visual Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Image
                </label>
                <ImageUpload
                  existingImages={formData.image ? [formData.image] : []}
                  maxImages={1}
                  onImageUpload={(url) => handleChange('image', url)}
                  onImageRemove={() => handleChange('image', '')}
                />
                <p className="mt-1 text-sm text-gray-500">
                  Upload a representative image
                </p>
              </div>

              {/* Icon */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon
                </label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => handleChange('icon', e.target.value)}
                  className="input-field"
                  placeholder="e.g., fa-icon-name or icon-name"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Icon class or identifier
                </p>
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.color || '#3B82F6'}
                    onChange={(e) => handleChange('color', e.target.value)}
                    className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => handleChange('color', e.target.value)}
                    className="input-field flex-1"
                    placeholder="#3B82F6"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Category color for UI
                </p>
              </div>
            </div>
          </div>

          {/* Display Settings */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Display Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sort Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => handleChange('sortOrder', parseInt(e.target.value) || 0)}
                  className="input-field"
                  min="0"
                  placeholder="0"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Lower numbers appear first
                </p>
              </div>

              {/* Status */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => handleChange('isActive', e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <div className="ml-3">
                    <span className="text-sm font-medium text-gray-700">Active Status</span>
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.isActive 
                        ? 'This category will be visible to customers' 
                        : 'This category will be hidden from customers'}
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* SEO Settings */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Settings</h3>
            <div className="space-y-6">
              {/* Meta Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={formData.metaTitle}
                  onChange={(e) => handleChange('metaTitle', e.target.value)}
                  className="input-field"
                  placeholder="SEO meta title (max 60 characters)"
                  maxLength={60}
                />
                <p className="mt-1 text-sm text-gray-500">
                  {formData.metaTitle.length}/60 characters
                </p>
              </div>

              {/* Meta Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description
                </label>
                <textarea
                  value={formData.metaDescription}
                  onChange={(e) => handleChange('metaDescription', e.target.value)}
                  rows={3}
                  className="input-field"
                  placeholder="SEO meta description (max 160 characters)"
                  maxLength={160}
                />
                <p className="mt-1 text-sm text-gray-500">
                  {formData.metaDescription.length}/160 characters
                </p>
              </div>

              {/* Meta Keywords */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Keywords
                </label>
                <div className="flex flex-wrap gap-2 mb-2 p-3 border border-gray-300 rounded-lg min-h-[42px]">
                  {formData.metaKeywords.length === 0 ? (
                    <span className="text-gray-400 text-sm">No keywords added</span>
                  ) : (
                    formData.metaKeywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                      >
                        {keyword}
                        <button
                          type="button"
                          onClick={() => handleKeywordRemove(keyword)}
                          className="text-primary-600 hover:text-primary-800"
                        >
                          ×
                        </button>
                      </span>
                    ))
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleKeywordAdd(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                    className="input-field flex-1"
                    placeholder="Type keyword and press Enter"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      if (input) {
                        handleKeywordAdd(input.value);
                        input.value = '';
                      }
                    }}
                    className="btn btn-secondary whitespace-nowrap"
                  >
                    Add
                  </button>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Add keywords for SEO (press Enter or click Add)
                </p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-secondary"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : (category ? 'Update Category' : 'Create Category')}
            </button>
          </div>
        </form>
    </div>
  );
};

export default CategoryForm; 
