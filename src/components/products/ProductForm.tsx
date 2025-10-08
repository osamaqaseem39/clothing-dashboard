import React, { useState } from 'react';
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Product, Category, Brand, ProductVariant } from '../../types';

interface ProductFormProps {
  product?: Product;
  categories: Category[];
  brands: Brand[];
  onSubmit: (productData: Partial<Product>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

interface ProductFormData {
  name: string;
  description: string;
  categoryId: string;
  brandId: string;
  tags: string[];
  isActive: boolean;
  status: string;
  seo: {
    title: string;
    description: string;
    keywords: string[];
    slug: string;
    noIndex: boolean;
    noFollow: boolean;
  };
  variants: Omit<ProductVariant, '_id'>[];
  images: string[];
  // Pakistani Clothing Specific Fields
  fabric?: string;
  collection?: string;
  occasion?: string;
  season?: string;
  careInstructions?: string;
  modelMeasurements?: {
    height: string;
    bust: string;
    waist: string;
    hips: string;
  };
  designer?: string;
  handwork?: string[];
  colorFamily?: string;
  pattern?: string;
  sleeveLength?: string;
  neckline?: string;
  length?: string;
  fit?: string;
  ageGroup?: string;
  bodyType?: string[];
  isLimitedEdition?: boolean;
  isCustomMade?: boolean;
  customDeliveryDays?: number;
  sizeChart?: string;
  availableSizes?: string[];
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  categories,
  brands,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: product?.name || '',
    description: product?.description || '',
    categoryId: typeof product?.categoryId === 'object' ? product.categoryId._id : product?.categoryId || '',
    brandId: typeof product?.brandId === 'object' ? product.brandId._id : product?.brandId || '',
    tags: product?.tags || [],
    isActive: product?.isActive ?? true,
    status: product?.status || 'draft',
    // SEO
    seo: {
      title: product?.seo?.title || '',
      description: product?.seo?.description || '',
      keywords: product?.seo?.keywords || [],
      slug: product?.seo?.slug || '',
      noIndex: product?.seo?.noIndex ?? false,
      noFollow: product?.seo?.noFollow ?? false,
    },
    // Variants
    variants: product?.variants || [
      {
        sku: '',
        name: 'Default Variant',
        price: 0,
        comparePrice: 0,
        costPrice: 0,
        stockQuantity: 0,
        weight: 0,
        dimensions: { length: 0, width: 0, height: 0 },
        attributes: {},
        isActive: true,
      },
    ],
    // Images
    images: product?.images || [],
    // Pakistani Clothing Specific Fields
    fabric: product?.fabric || '',
    collection: product?.collection || '',
    occasion: product?.occasion || '',
    season: product?.season || '',
    careInstructions: product?.careInstructions || '',
    modelMeasurements: product?.modelMeasurements || {
      height: '',
      bust: '',
      waist: '',
      hips: '',
    },
    designer: product?.designer || '',
    handwork: product?.handwork || [],
    colorFamily: product?.colorFamily || '',
    pattern: product?.pattern || '',
    sleeveLength: product?.sleeveLength || '',
    neckline: product?.neckline || '',
    length: product?.length || '',
    fit: product?.fit || '',
    ageGroup: product?.ageGroup || '',
    bodyType: product?.bodyType || [],
    isLimitedEdition: product?.isLimitedEdition || false,
    isCustomMade: product?.isCustomMade || false,
    customDeliveryDays: product?.customDeliveryDays || 0,
    sizeChart: product?.sizeChart || '',
    availableSizes: product?.availableSizes || [],
  });

  const [newTag, setNewTag] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [newHandwork, setNewHandwork] = useState('');
  const [newBodyType, setNewBodyType] = useState('');
  const [newSize, setNewSize] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Product description is required';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }

    if (formData.variants.length === 0) {
      newErrors.variants = 'At least one variant is required';
    }

    // Validate variants
    formData.variants.forEach((variant, index) => {
      if (!variant.sku.trim()) {
        newErrors[`variant-${index}-sku`] = 'SKU is required';
      }
      if (!variant.name.trim()) {
        newErrors[`variant-${index}-name`] = 'Variant name is required';
      }
      if (variant.price <= 0) {
        newErrors[`variant-${index}-price`] = 'Price must be greater than 0';
      }
      if (variant.stockQuantity < 0) {
        newErrors[`variant-${index}-stock`] = 'Stock quantity cannot be negative';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Convert form data to Product format
    const productData: Partial<Product> = {
      name: formData.name,
      description: formData.description,
      tags: formData.tags,
      isActive: formData.isActive,
      status: formData.status as any,
      seo: formData.seo,
      variants: formData.variants.map(variant => ({
        ...variant,
        _id: '', // Add empty _id for new variants
      })),
      images: formData.images,
      // Pakistani Clothing Specific Fields
      fabric: formData.fabric || undefined,
      collection: formData.collection || undefined,
      occasion: formData.occasion || undefined,
      season: formData.season || undefined,
      careInstructions: formData.careInstructions || undefined,
      modelMeasurements: formData.modelMeasurements && (formData.modelMeasurements.height || formData.modelMeasurements.bust || formData.modelMeasurements.waist || formData.modelMeasurements.hips) ? formData.modelMeasurements : undefined,
      designer: formData.designer || undefined,
      handwork: formData.handwork && formData.handwork.length > 0 ? formData.handwork : undefined,
      colorFamily: formData.colorFamily || undefined,
      pattern: formData.pattern || undefined,
      sleeveLength: formData.sleeveLength || undefined,
      neckline: formData.neckline || undefined,
      length: formData.length || undefined,
      fit: formData.fit || undefined,
      ageGroup: formData.ageGroup || undefined,
      bodyType: formData.bodyType && formData.bodyType.length > 0 ? formData.bodyType : undefined,
      isLimitedEdition: formData.isLimitedEdition || undefined,
      isCustomMade: formData.isCustomMade || undefined,
      customDeliveryDays: formData.customDeliveryDays && formData.customDeliveryDays > 0 ? formData.customDeliveryDays : undefined,
      sizeChart: formData.sizeChart || undefined,
      availableSizes: formData.availableSizes && formData.availableSizes.length > 0 ? formData.availableSizes : undefined,
    };

    // Add category and brand if selected
    if (formData.categoryId) {
      const selectedCategory = categories.find(cat => cat._id === formData.categoryId);
      if (selectedCategory) {
        productData.categoryId = selectedCategory;
      }
    }

    if (formData.brandId) {
      const selectedBrand = brands.find(brand => brand._id === formData.brandId);
      if (selectedBrand) {
        productData.brandId = selectedBrand;
      }
    }

    await onSubmit(productData);
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

  const handleVariantChange = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((variant, i) =>
        i === index ? { ...variant, [field]: value } : variant
      ),
    }));
    
    // Clear variant-specific error
    const errorKey = `variant-${index}-${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({
        ...prev,
        [errorKey]: '',
      }));
    }
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          sku: '',
          name: `Variant ${prev.variants.length + 1}`,
          price: 0,
          comparePrice: 0,
          costPrice: 0,
          stockQuantity: 0,
          weight: 0,
          dimensions: { length: 0, width: 0, height: 0 },
          attributes: {},
          isActive: true,
        },
      ],
    }));
  };

  const removeVariant = (index: number) => {
    if (formData.variants.length > 1) {
      setFormData(prev => ({
        ...prev,
        variants: prev.variants.filter((_, i) => i !== index),
      }));
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !formData.seo.keywords.includes(newKeyword.trim())) {
      setFormData(prev => ({
        ...prev,
        seo: {
          ...prev.seo,
          keywords: [...prev.seo.keywords, newKeyword.trim()],
        },
      }));
      setNewKeyword('');
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      seo: {
        ...prev.seo,
        keywords: prev.seo.keywords.filter(keyword => keyword !== keywordToRemove),
      },
    }));
  };

  const addHandwork = () => {
    if (newHandwork.trim() && formData.handwork && !formData.handwork.includes(newHandwork.trim())) {
      setFormData(prev => ({
        ...prev,
        handwork: [...(prev.handwork || []), newHandwork.trim()],
      }));
      setNewHandwork('');
    }
  };

  const removeHandwork = (handworkToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      handwork: (prev.handwork || []).filter(h => h !== handworkToRemove),
    }));
  };

  const addBodyType = () => {
    if (newBodyType.trim() && formData.bodyType && !formData.bodyType.includes(newBodyType.trim())) {
      setFormData(prev => ({
        ...prev,
        bodyType: [...(prev.bodyType || []), newBodyType.trim()],
      }));
      setNewBodyType('');
    }
  };

  const removeBodyType = (bodyTypeToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      bodyType: (prev.bodyType || []).filter(bt => bt !== bodyTypeToRemove),
    }));
  };

  const addSize = () => {
    if (newSize.trim() && formData.availableSizes && !formData.availableSizes.includes(newSize.trim())) {
      setFormData(prev => ({
        ...prev,
        availableSizes: [...(prev.availableSizes || []), newSize.trim()],
      }));
      setNewSize('');
    }
  };

  const removeSize = (sizeToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      availableSizes: (prev.availableSizes || []).filter(s => s !== sizeToRemove),
    }));
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-6 border w-full max-w-4xl shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`input-field ${errors.name ? 'border-red-300' : ''}`}
                placeholder="Enter product name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => handleChange('categoryId', e.target.value)}
                className={`input-field ${errors.categoryId ? 'border-red-300' : ''}`}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand
              </label>
              <select
                value={formData.brandId}
                onChange={(e) => handleChange('brandId', e.target.value)}
                className="input-field"
              >
                <option value="">Select Brand</option>
                {brands.map((brand) => (
                  <option key={brand._id} value={brand._id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="input-field"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              className={`input-field ${errors.description ? 'border-red-300' : ''}`}
              placeholder="Enter product description"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="input-field flex-1"
                placeholder="Add a tag"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <button
                type="button"
                onClick={addTag}
                className="btn btn-secondary"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-primary-600 hover:text-primary-800"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Product Variants */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Product Variants</h3>
              <button
                type="button"
                onClick={addVariant}
                className="btn btn-secondary"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Variant
              </button>
            </div>

            {errors.variants && (
              <p className="mb-2 text-sm text-red-600">{errors.variants}</p>
            )}

            <div className="space-y-4">
              {formData.variants.map((variant, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-gray-900">
                      Variant {index + 1}
                    </h4>
                    {formData.variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        SKU *
                      </label>
                      <input
                        type="text"
                        value={variant.sku}
                        onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                        className={`input-field ${errors[`variant-${index}-sku`] ? 'border-red-300' : ''}`}
                        placeholder="SKU"
                      />
                      {errors[`variant-${index}-sku`] && (
                        <p className="mt-1 text-xs text-red-600">{errors[`variant-${index}-sku`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={variant.name}
                        onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                        className={`input-field ${errors[`variant-${index}-name`] ? 'border-red-300' : ''}`}
                        placeholder="Variant name"
                      />
                      {errors[`variant-${index}-name`] && (
                        <p className="mt-1 text-xs text-red-600">{errors[`variant-${index}-name`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={variant.price}
                        onChange={(e) => handleVariantChange(index, 'price', parseFloat(e.target.value) || 0)}
                        className={`input-field ${errors[`variant-${index}-price`] ? 'border-red-300' : ''}`}
                        placeholder="0.00"
                      />
                      {errors[`variant-${index}-price`] && (
                        <p className="mt-1 text-xs text-red-600">{errors[`variant-${index}-price`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Compare Price
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={variant.comparePrice}
                        onChange={(e) => handleVariantChange(index, 'comparePrice', parseFloat(e.target.value) || 0)}
                        className="input-field"
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cost Price
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={variant.costPrice}
                        onChange={(e) => handleVariantChange(index, 'costPrice', parseFloat(e.target.value) || 0)}
                        className="input-field"
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Stock Quantity *
                      </label>
                      <input
                        type="number"
                        value={variant.stockQuantity}
                        onChange={(e) => handleVariantChange(index, 'stockQuantity', parseInt(e.target.value) || 0)}
                        className={`input-field ${errors[`variant-${index}-stock`] ? 'border-red-300' : ''}`}
                        placeholder="0"
                      />
                      {errors[`variant-${index}-stock`] && (
                        <p className="mt-1 text-xs text-red-600">{errors[`variant-${index}-stock`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={variant.weight}
                        onChange={(e) => handleVariantChange(index, 'weight', parseFloat(e.target.value) || 0)}
                        className="input-field"
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Length (cm)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={variant.dimensions.length}
                        onChange={(e) => handleVariantChange(index, 'dimensions', {
                          ...variant.dimensions,
                          length: parseFloat(e.target.value) || 0,
                        })}
                        className="input-field"
                        placeholder="0.0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Width (cm)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={variant.dimensions.width}
                        onChange={(e) => handleVariantChange(index, 'dimensions', {
                          ...variant.dimensions,
                          width: parseFloat(e.target.value) || 0,
                        })}
                        className="input-field"
                        placeholder="0.0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Height (cm)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={variant.dimensions.height}
                        onChange={(e) => handleVariantChange(index, 'dimensions', {
                          ...variant.dimensions,
                          height: parseFloat(e.target.value) || 0,
                        })}
                        className="input-field"
                        placeholder="0.0"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={variant.isActive}
                        onChange={(e) => handleVariantChange(index, 'isActive', e.target.checked)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Active</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SEO Settings */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">SEO Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Title
                </label>
                <input
                  type="text"
                  value={formData.seo.title}
                  onChange={(e) => handleChange('seo', { ...formData.seo, title: e.target.value })}
                  className="input-field"
                  placeholder="SEO title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Slug
                </label>
                <input
                  type="text"
                  value={formData.seo.slug}
                  onChange={(e) => handleChange('seo', { ...formData.seo, slug: e.target.value })}
                  className="input-field"
                  placeholder="seo-friendly-url"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description
                </label>
                <textarea
                  value={formData.seo.description}
                  onChange={(e) => handleChange('seo', { ...formData.seo, description: e.target.value })}
                  rows={3}
                  className="input-field"
                  placeholder="Meta description for search engines"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keywords
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    className="input-field flex-1"
                    placeholder="Add a keyword"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                  />
                  <button
                    type="button"
                    onClick={addKeyword}
                    className="btn btn-secondary"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.seo.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {keyword}
                      <button
                        type="button"
                        onClick={() => removeKeyword(keyword)}
                        className="ml-1 text-gray-600 hover:text-gray-800"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="flex gap-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.seo.noIndex}
                      onChange={(e) => handleChange('seo', { ...formData.seo, noIndex: e.target.checked })}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">No Index</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.seo.noFollow}
                      onChange={(e) => handleChange('seo', { ...formData.seo, noFollow: e.target.checked })}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">No Follow</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Pakistani Clothing Specific Fields */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Clothing Details</h3>
            
            {/* Row 1: Fabric, Collection, Occasion, Season */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fabric Type
                </label>
                <select
                  value={formData.fabric}
                  onChange={(e) => handleChange('fabric', e.target.value)}
                  className="input-field"
                >
                  <option value="">Select Fabric</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Silk">Silk</option>
                  <option value="Lawn">Lawn</option>
                  <option value="Chiffon">Chiffon</option>
                  <option value="Linen">Linen</option>
                  <option value="Georgette">Georgette</option>
                  <option value="Organza">Organza</option>
                  <option value="Velvet">Velvet</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Collection
                </label>
                <input
                  type="text"
                  value={formData.collection}
                  onChange={(e) => handleChange('collection', e.target.value)}
                  className="input-field"
                  placeholder="e.g., Summer 2024, Eid Collection"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Occasion
                </label>
                <select
                  value={formData.occasion}
                  onChange={(e) => handleChange('occasion', e.target.value)}
                  className="input-field"
                >
                  <option value="">Select Occasion</option>
                  <option value="Formal">Formal</option>
                  <option value="Casual">Casual</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Party">Party</option>
                  <option value="Office">Office</option>
                  <option value="Traditional">Traditional</option>
                  <option value="Festive">Festive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Season
                </label>
                <select
                  value={formData.season}
                  onChange={(e) => handleChange('season', e.target.value)}
                  className="input-field"
                >
                  <option value="">Select Season</option>
                  <option value="Summer">Summer</option>
                  <option value="Winter">Winter</option>
                  <option value="Spring">Spring</option>
                  <option value="Fall">Fall</option>
                  <option value="All Season">All Season</option>
                </select>
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
                  value={formData.designer}
                  onChange={(e) => handleChange('designer', e.target.value)}
                  className="input-field"
                  placeholder="Designer/Design House"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color Family
                </label>
                <select
                  value={formData.colorFamily}
                  onChange={(e) => handleChange('colorFamily', e.target.value)}
                  className="input-field"
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
                  value={formData.pattern}
                  onChange={(e) => handleChange('pattern', e.target.value)}
                  className="input-field"
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
                  value={formData.sleeveLength}
                  onChange={(e) => handleChange('sleeveLength', e.target.value)}
                  className="input-field"
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
                  value={formData.neckline}
                  onChange={(e) => handleChange('neckline', e.target.value)}
                  className="input-field"
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
                  value={formData.length}
                  onChange={(e) => handleChange('length', e.target.value)}
                  className="input-field"
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
                  value={formData.fit}
                  onChange={(e) => handleChange('fit', e.target.value)}
                  className="input-field"
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
                  value={formData.ageGroup}
                  onChange={(e) => handleChange('ageGroup', e.target.value)}
                  className="input-field"
                >
                  <option value="">Select Age Group</option>
                  <option value="Young Adult">Young Adult</option>
                  <option value="Adult">Adult</option>
                  <option value="Mature">Mature</option>
                </select>
              </div>
            </div>

            {/* Handwork Details */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Handwork Details
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newHandwork}
                  onChange={(e) => setNewHandwork(e.target.value)}
                  className="input-field flex-1"
                  placeholder="Add handwork type (e.g., Embroidery, Zari, Sequins)"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHandwork())}
                />
                <button
                  type="button"
                  onClick={addHandwork}
                  className="btn btn-secondary"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.handwork?.map((handwork, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                  >
                    {handwork}
                    <button
                      type="button"
                      onClick={() => removeHandwork(handwork)}
                      className="ml-1 text-purple-600 hover:text-purple-800"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Body Type Suitability */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Body Type Suitability
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newBodyType}
                  onChange={(e) => setNewBodyType(e.target.value)}
                  className="input-field flex-1"
                  placeholder="Add body type (e.g., Apple, Pear, Hourglass)"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBodyType())}
                />
                <button
                  type="button"
                  onClick={addBodyType}
                  className="btn btn-secondary"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.bodyType?.map((bodyType, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                  >
                    {bodyType}
                    <button
                      type="button"
                      onClick={() => removeBodyType(bodyType)}
                      className="ml-1 text-green-600 hover:text-green-800"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Available Sizes */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Sizes
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                  className="input-field flex-1"
                  placeholder="Add size (e.g., S, M, L, XL, 6, 8, 10)"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
                />
                <button
                  type="button"
                  onClick={addSize}
                  className="btn btn-secondary"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.availableSizes?.map((size, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {size}
                    <button
                      type="button"
                      onClick={() => removeSize(size)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Model Measurements */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Model Measurements (for size reference)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Height</label>
                  <input
                    type="text"
                    value={formData.modelMeasurements?.height || ''}
                    onChange={(e) => handleChange('modelMeasurements', {
                      ...formData.modelMeasurements,
                      height: e.target.value,
                    })}
                    className="input-field"
                    placeholder="e.g., 5'6&quot;"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Bust</label>
                  <input
                    type="text"
                    value={formData.modelMeasurements?.bust || ''}
                    onChange={(e) => handleChange('modelMeasurements', {
                      ...formData.modelMeasurements,
                      bust: e.target.value,
                    })}
                    className="input-field"
                    placeholder="e.g., 34&quot;"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Waist</label>
                  <input
                    type="text"
                    value={formData.modelMeasurements?.waist || ''}
                    onChange={(e) => handleChange('modelMeasurements', {
                      ...formData.modelMeasurements,
                      waist: e.target.value,
                    })}
                    className="input-field"
                    placeholder="e.g., 28&quot;"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Hips</label>
                  <input
                    type="text"
                    value={formData.modelMeasurements?.hips || ''}
                    onChange={(e) => handleChange('modelMeasurements', {
                      ...formData.modelMeasurements,
                      hips: e.target.value,
                    })}
                    className="input-field"
                    placeholder="e.g., 36&quot;"
                  />
                </div>
              </div>
            </div>

            {/* Special Features */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Special Features
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isLimitedEdition}
                    onChange={(e) => handleChange('isLimitedEdition', e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Limited Edition</span>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isCustomMade}
                    onChange={(e) => handleChange('isCustomMade', e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Custom Made</span>
                </div>
              </div>
              
              {formData.isCustomMade && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Delivery Time (days)
                  </label>
                  <input
                    type="number"
                    value={formData.customDeliveryDays}
                    onChange={(e) => handleChange('customDeliveryDays', parseInt(e.target.value) || 0)}
                    className="input-field w-32"
                    placeholder="0"
                    min="0"
                  />
                </div>
              )}
            </div>

            {/* Care Instructions */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Care Instructions
              </label>
              <textarea
                value={formData.careInstructions}
                onChange={(e) => handleChange('careInstructions', e.target.value)}
                rows={3}
                className="input-field"
                placeholder="e.g., Dry clean only, Hand wash in cold water, Do not bleach"
              />
            </div>
          </div>

          {/* Images */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Product Images</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleChange('images', formData.images.filter((_, i) => i !== index))}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 hover:border-gray-400 hover:text-gray-600"
              >
                <PlusIcon className="h-8 w-8" />
              </button>
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
              {isLoading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm; 