import React, { useEffect, useState } from 'react';
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Product, Category, Brand, ProductVariant } from '../../types';
import TagsModal from './modals/TagsModal';
import KeywordsModal from './modals/KeywordsModal';
import SizesModal from './modals/SizesModal';
import FeaturesModal from './modals/FeaturesModal';
import ColorsModal from './modals/ColorsModal';
import AttributesModal from './modals/AttributesModal';
import ImageUpload from '../common/ImageUpload';
import QuickAddMasterDataModal from '../master-data/QuickAddMasterDataModal';
import ProductFormSEO from './ProductFormSEO';
import InfoIcon from '../ui/InfoIcon';
import { 
  colorFamilyService,
  patternService,
  sleeveLengthService,
  materialService,
  occasionService,
  seasonService,
  sizeService,
  Size,
} from '../../services/masterDataService';

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
  slug: string;
  description: string;
  shortDescription: string;
  type: string;
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
    canonicalUrl: string;
    ogImage: string;
    noIndex: boolean;
    noFollow: boolean;
  };
  variants: Omit<ProductVariant, '_id'>[];
  images: string[];
  // UI-specific fields
  features?: string[];
  colors?: Array<{
    colorId: string;
    imageUrl?: string;
  }>;
  attributes: string[];
  // Pakistani Clothing Specific Fields
  fabric?: string;
  collectionName?: string;
  occasion?: string;
  season?: string;
  careInstructions?: string;
  modelMeasurements?: {
    height: string;
    bust: string;
    waist: string;
    hips: string;
    sizeWearing: string;
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
  sizeChartImageUrl?: string;
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
    slug: product?.slug || '',
    description: product?.description || '',
    shortDescription: product?.shortDescription || '',
    type: product?.type || 'simple',
    categoryId: product?.categoryId
      ? (typeof product.categoryId === 'object' && '_id' in product.categoryId
        ? (product.categoryId as any)._id
        : typeof product.categoryId === 'string'
        ? product.categoryId
        : Array.isArray(product.categories) && product.categories.length > 0
        ? (typeof product.categories[0] === 'object' && '_id' in product.categories[0]
          ? (product.categories[0] as any)._id
          : product.categories[0] as string)
        : '')
      : '',
    brandId: product?.brandId
      ? (typeof product.brandId === 'object' && '_id' in product.brandId
        ? (product.brandId as any)._id
        : typeof product.brandId === 'string'
        ? product.brandId
        : typeof product.brand === 'object' && product.brand && '_id' in product.brand
        ? (product.brand as any)._id
        : typeof product.brand === 'string'
        ? product.brand
        : '')
      : '',
    tags: product?.tags || [],
    isActive: product?.isActive ?? true,
    status: product?.status || 'draft',
    // SEO - auto-populate from product data if not set
    seo: {
      title: product?.seo?.title || product?.name || '',
      description: product?.seo?.description || product?.shortDescription || '',
      keywords: product?.seo?.keywords || [],
      slug: product?.seo?.slug || product?.slug || '',
      canonicalUrl: product?.seo?.canonicalUrl || '',
      ogImage: product?.seo?.ogImage || '',
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
        stockStatus: 'instock' as const,
        weight: 0,
        dimensions: { length: 0, width: 0, height: 0 },
        attributes: {},
        images: [],
        isActive: true,
      },
    ].map((variant: any) => {
      // Clean dimensions to remove _id if present
      if (variant.dimensions && variant.dimensions._id) {
        const { _id, ...cleanDimensions } = variant.dimensions;
        return { ...variant, dimensions: cleanDimensions };
      }
      return variant;
    }),
    // Images - extract URLs if objects, filter out ObjectIds (24 hex chars) that aren't URLs
    images: (product?.images || []).map((img: any) => {
      if (typeof img === 'string') {
        // Check if it's a valid URL (starts with http/https) or if it's an ObjectId
        // ObjectIds are 24 hex characters, URLs start with http/https
        if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('/')) {
          return img;
        }
        // If it looks like an ObjectId (24 hex chars), filter it out - it's not a valid image URL
        if (/^[0-9a-fA-F]{24}$/.test(img)) {
          return null; // Filter out ObjectIds
        }
        return img; // Keep other strings that might be relative paths
      }
      return img?.url || null;
    }).filter((img: any) => img !== null && img !== undefined),
    // UI-specific fields
    features: product?.features || [],
    colors: product?.colors || [],
    attributes: product?.attributes || [],
    // Pakistani Clothing Specific Fields
    fabric: product?.fabric || '',
    collectionName: product?.collectionName || '',
    occasion: product?.occasion || '',
    season: product?.season || '',
    careInstructions: product?.careInstructions || '',
    modelMeasurements: product?.modelMeasurements ? (() => {
      // Clean modelMeasurements: remove _id if present
      const measurements = product.modelMeasurements as any;
      const { _id, ...rest } = measurements;
      return {
        height: measurements.height || '',
        bust: measurements.bust || '',
        waist: measurements.waist || '',
        hips: measurements.hips || '',
        sizeWearing: measurements.sizeWearing || '',
      };
    })() : {
      height: '',
      bust: '',
      waist: '',
      hips: '',
      sizeWearing: '',
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
    sizeChartImageUrl: product?.sizeChartImageUrl || '',
    availableSizes: product?.availableSizes || [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<string>('basic');
  
  // Update form data when product prop changes (important for edit mode when product loads asynchronously)
  useEffect(() => {
    if (product) {
      // Extract categoryId - handle both object and string formats
      const categoryId = typeof product.categoryId === 'object' && product.categoryId && '_id' in product.categoryId
        ? (product.categoryId as any)._id
        : typeof product.categoryId === 'string'
        ? product.categoryId
        : Array.isArray(product.categories) && product.categories.length > 0
        ? (typeof product.categories[0] === 'object' && product.categories[0] && '_id' in product.categories[0]
          ? (product.categories[0] as any)._id
          : product.categories[0] as string)
        : '';
      
      // Extract brandId - handle both object and string formats
      const brandId = typeof product.brandId === 'object' && product.brandId && '_id' in product.brandId
        ? (product.brandId as any)._id
        : typeof product.brandId === 'string'
        ? product.brandId
        : typeof product.brand === 'object' && product.brand && '_id' in product.brand
        ? (product.brand as any)._id
        : typeof product.brand === 'string'
        ? product.brand
        : '';
      
      setFormData(prev => ({
        ...prev,
        name: product.name || prev.name,
        slug: product.slug || prev.slug,
        description: product.description || prev.description,
        shortDescription: product.shortDescription || prev.shortDescription,
        type: product.type || prev.type,
        categoryId: categoryId || prev.categoryId,
        brandId: brandId || prev.brandId,
        tags: product.tags || prev.tags,
        isActive: product.isActive ?? prev.isActive,
        status: product.status || prev.status,
        seo: {
          title: product.seo?.title || product.name || prev.seo.title,
          description: product.seo?.description || product.shortDescription || prev.seo.description,
          keywords: product.seo?.keywords || prev.seo.keywords,
          slug: product.seo?.slug || product.slug || prev.seo.slug,
          canonicalUrl: product.seo?.canonicalUrl || prev.seo.canonicalUrl,
          ogImage: product.seo?.ogImage || prev.seo.ogImage,
          noIndex: product.seo?.noIndex ?? prev.seo.noIndex ?? false,
          noFollow: product.seo?.noFollow ?? prev.seo.noFollow ?? false,
        },
        variants: product.variants && product.variants.length > 0
          ? product.variants.map((variant: any) => {
              if (variant.dimensions && variant.dimensions._id) {
                const { _id, ...cleanDimensions } = variant.dimensions;
                return { ...variant, dimensions: cleanDimensions };
              }
              return variant;
            })
          : prev.variants,
        images: (product.images || []).map((img: any) => {
          if (typeof img === 'string') {
            if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('/')) {
              return img;
            }
            if (/^[0-9a-fA-F]{24}$/.test(img)) {
              return null;
            }
            return img;
          }
          return img?.url || null;
        }).filter((img: any) => img !== null && img !== undefined),
      }));
    }
  }, [product]);
  
  // Modal states
  const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
  const [isKeywordsModalOpen, setIsKeywordsModalOpen] = useState(false);
  const [isSizesModalOpen, setIsSizesModalOpen] = useState(false);
  const [isFeaturesModalOpen, setIsFeaturesModalOpen] = useState(false);
  const [isColorsModalOpen, setIsColorsModalOpen] = useState(false);
  const [isAttributesModalOpen, setIsAttributesModalOpen] = useState(false);
  // Quick add modal states
  const [quickAdd, setQuickAdd] = useState<{
    type: null | 'Color Family' | 'Pattern' | 'Sleeve Length' | 'Fabric' | 'Occasion' | 'Season';
  }>({ type: null });

  // Local option lists to allow appending newly created values
  const [fabricOptions, setFabricOptions] = useState<string[]>([]);
  const [occasionOptions, setOccasionOptions] = useState<string[]>([]);
  const [seasonOptions, setSeasonOptions] = useState<string[]>([]);
  const [colorFamilyOptions, setColorFamilyOptions] = useState<string[]>([]);
  const [patternOptions, setPatternOptions] = useState<string[]>([]);
  const [sleeveLengthOptions, setSleeveLengthOptions] = useState<string[]>([]);
  const [isOptionsLoading, setIsOptionsLoading] = useState<boolean>(false);
  const [sizeNamesMap, setSizeNamesMap] = useState<Record<string, string>>({});

  // Load master data options
  useEffect(() => {
    let isMounted = true;
    const loadOptions = async () => {
      try {
        setIsOptionsLoading(true);
        const [
          colorFamiliesRes,
          patternsRes,
          sleeveLengthsRes,
          fabricsRes,
          occasionsRes,
          seasonsRes,
        ] = await Promise.all([
          colorFamilyService.getAll(),
          patternService.getAll(),
          sleeveLengthService.getAll(),
          materialService.getAll(),
          occasionService.getAll(),
          seasonService.getAll(),
        ]);

        if (!isMounted) return;

        const sortByName = (arr: any[]) => arr.map((i: any) => i.name).sort((a: string, b: string) => a.localeCompare(b));
        if (colorFamiliesRes.success && colorFamiliesRes.data) setColorFamilyOptions(sortByName(colorFamiliesRes.data));
        if (patternsRes.success && patternsRes.data) setPatternOptions(sortByName(patternsRes.data));
        if (sleeveLengthsRes.success && sleeveLengthsRes.data) setSleeveLengthOptions(sortByName(sleeveLengthsRes.data));
        if (fabricsRes.success && fabricsRes.data) setFabricOptions(sortByName(fabricsRes.data));
        if (occasionsRes.success && occasionsRes.data) setOccasionOptions(sortByName(occasionsRes.data));
        if (seasonsRes.success && seasonsRes.data) setSeasonOptions(sortByName(seasonsRes.data));
      } catch (err) {
        // Swallow errors, keep defaults
        console.error('Failed to load master data options', err);
      } finally {
        setIsOptionsLoading(false);
      }
    };
    loadOptions();
    return () => { isMounted = false; };
  }, []);

  // Fetch size names when availableSizes change
  useEffect(() => {
    const fetchSizeNames = async () => {
      if (!formData.availableSizes || formData.availableSizes.length === 0) {
        setSizeNamesMap({});
        return;
      }

      try {
        const response = await sizeService.getAll();
        if (response.success && response.data) {
          const namesMap: Record<string, string> = {};
          response.data.forEach((size: Size) => {
            if (formData.availableSizes?.includes(size._id)) {
              namesMap[size._id] = size.name;
            }
          });
          setSizeNamesMap(namesMap);
        }
      } catch (error) {
        console.error('Error fetching size names:', error);
      }
    };

    fetchSizeNames();
  }, [formData.availableSizes]);

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
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Convert images from URLs to objects with position
    const imageObjects = formData.images.map((url, index) => ({
      url: url,
      altText: formData.name, // Use product name as alt text
      position: index,
    }));

    // Convert form data to Product format
    // Note: We cast images as any[] to satisfy the union type
    const productData: Partial<Product> = {
      name: formData.name,
      slug: formData.slug || formData.seo.slug || generateSlug(formData.name), // Use SEO slug or generate from name
      description: formData.description,
      shortDescription: formData.shortDescription || formData.description.substring(0, 200),
      type: formData.type as any,
      tags: formData.tags,
      isActive: formData.isActive,
      status: formData.status as any,
      seo: {
        ...formData.seo,
        // Ensure SEO slug matches main slug if not explicitly set
        slug: formData.seo.slug || formData.slug || generateSlug(formData.name),
        // Auto-populate SEO title from name if empty
        title: formData.seo.title || formData.name,
        // Auto-populate SEO description from shortDescription if empty
        description: formData.seo.description || formData.shortDescription || formData.description.substring(0, 160),
        // Ensure noIndex and noFollow have default values
        noIndex: formData.seo.noIndex ?? false,
        noFollow: formData.seo.noFollow ?? false,
      },
      variants: formData.variants.map(variant => {
        // Clean dimensions to remove _id if present
        const dimensions = variant.dimensions || { length: 0, width: 0, height: 0 };
        const cleanDimensions = '_id' in dimensions ? (({ _id, ...rest }) => rest)(dimensions as any) : dimensions;
        return {
          ...variant,
          _id: '', // Add empty _id for new variants
          dimensions: cleanDimensions,
        };
      }),
      images: imageObjects as any,
      // UI-specific fields
      features: formData.features && formData.features.length > 0 ? formData.features : undefined,
      colors: formData.colors && formData.colors.length > 0 ? formData.colors : undefined,
      attributes: formData.attributes && formData.attributes.length > 0 ? formData.attributes : undefined,
      // Pakistani Clothing Specific Fields
      fabric: formData.fabric || undefined,
      collectionName: formData.collectionName || undefined,
      occasion: formData.occasion || undefined,
      season: formData.season || undefined,
      careInstructions: formData.careInstructions || undefined,
      modelMeasurements: formData.modelMeasurements && formData.modelMeasurements.height ? {
        height: formData.modelMeasurements.height,
        bust: formData.modelMeasurements.bust || '',
        waist: formData.modelMeasurements.waist || '',
        hips: formData.modelMeasurements.hips || '',
        sizeWearing: formData.modelMeasurements.sizeWearing || '',
      } : undefined,
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
      sizeChartImageUrl: formData.sizeChartImageUrl || undefined,
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

  // Helper function to generate slug from text
  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => {
      const updated = {
        ...prev,
        [field]: value,
      };
      
      // Auto-sync SEO fields when name or slug changes
      if (field === 'name' && value) {
        // Auto-generate slug from name if slug is empty
        if (!prev.slug) {
          updated.slug = generateSlug(value);
        }
        // Auto-generate SEO slug from name if SEO slug is empty
        if (!prev.seo.slug) {
          updated.seo = {
            ...prev.seo,
            slug: generateSlug(value),
          };
        }
        // Auto-generate SEO title from name if SEO title is empty
        if (!prev.seo.title) {
          updated.seo = {
            ...updated.seo,
            title: value,
          };
        }
      }
      
      // Auto-sync main slug with SEO slug if main slug is empty
      if (field === 'slug' && value && !prev.slug) {
        // Main slug is being set, ensure SEO slug matches if empty
        if (!prev.seo.slug) {
          updated.seo = {
            ...prev.seo,
            slug: value,
          };
        }
      }
      
      // Auto-sync shortDescription to SEO description if SEO description is empty
      if (field === 'shortDescription' && value && !prev.seo.description) {
        updated.seo = {
          ...prev.seo,
          description: value.substring(0, 160), // Limit to 160 chars
        };
      }
      
      return updated;
    });
    
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
          stockStatus: 'instock' as const,
          weight: 0,
          dimensions: { length: 0, width: 0, height: 0 },
          attributes: {},
          images: [],
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

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              type="button"
              onClick={() => setActiveTab('basic')}
              className={`${
                activeTab === 'basic'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Basic Information
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('properties')}
              className={`${
                activeTab === 'properties'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Clothing Properties
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('measurements')}
              className={`${
                activeTab === 'measurements'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Measurements
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('features')}
              className={`${
                activeTab === 'features'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Features & Details
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('images')}
              className={`${
                activeTab === 'images'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Images
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('seo')}
              className={`${
                activeTab === 'seo'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              SEO
            </button>
          </nav>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                Product Name *
                <InfoIcon content="Enter a clear, descriptive product name. This will be displayed to customers and used for SEO. Minimum 3 characters required." />
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
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                Slug *
                <InfoIcon content="URL-friendly version of the product name. Used in the product URL (e.g., /products/product-slug). Auto-generated from product name if left empty. Use lowercase letters, numbers, and hyphens only." />
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => {
                    handleChange('slug', e.target.value);
                    // Sync SEO slug with main slug
                    setFormData(prev => ({
                      ...prev,
                      seo: {
                        ...prev.seo,
                        slug: e.target.value,
                      },
                    }));
                  }}
                  className={`input-field flex-1 ${errors.slug ? 'border-red-300' : ''}`}
                  placeholder="product-slug"
                />
                <button
                  type="button"
                  onClick={() => {
                    const generatedSlug = generateSlug(formData.name);
                    handleChange('slug', generatedSlug);
                    setFormData(prev => ({
                      ...prev,
                      seo: {
                        ...prev.seo,
                        slug: generatedSlug,
                      },
                    }));
                  }}
                  className="btn btn-secondary whitespace-nowrap"
                  disabled={!formData.name}
                >
                  Generate
                </button>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                URL: /products/{formData.slug || 'product-slug'}
              </p>
              {errors.slug && (
                <p className="mt-1 text-sm text-red-600">{errors.slug}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                Product Type *
                <InfoIcon content="Simple: Standard product with fixed price. Variable: Product with multiple variants (sizes, colors). Grouped: Collection of related products. External: Product sold on another website." />
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className={`input-field ${errors.type ? 'border-red-300' : ''}`}
              >
                <option value="simple">Simple Product</option>
                <option value="variable">Variable Product</option>
                <option value="grouped">Grouped Product</option>
                <option value="external">External Product</option>
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">{errors.type}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                Category *
                <InfoIcon content="Select the main category for this product. Categories help organize products and improve navigation. Products can appear in category listings and search results." />
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
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                Brand
                <InfoIcon content="Optional: Select the brand or manufacturer. Brands help customers filter and find products. Useful for brand-aware shoppers." />
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
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                Status
                <InfoIcon content="Draft: Product is saved but not visible to customers. Published: Product is live and visible. Archived: Product is hidden but kept for records." />
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="input-field"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                Description *
                <InfoIcon content="Detailed product description. Include key features, materials, care instructions, and any important details customers should know. Minimum 20 characters required." />
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className={`input-field ${errors.description ? 'border-red-300' : ''}`}
                rows={4}
                placeholder="Enter product description"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                Short Description
                <InfoIcon content="Brief summary (max 200 characters) used in product cards, search results, and meta descriptions. Should be concise and compelling." />
              </label>
              <textarea
                value={formData.shortDescription}
                onChange={(e) => {
                  handleChange('shortDescription', e.target.value);
                  // Auto-sync to SEO description if empty
                  if (!formData.seo.description) {
                    setFormData(prev => ({
                      ...prev,
                      seo: {
                        ...prev.seo,
                        description: e.target.value.substring(0, 160),
                      },
                    }));
                  }
                }}
                className="input-field"
                rows={2}
                placeholder="Brief product description (used for meta description and product cards)"
                maxLength={200}
              />
              <p className="mt-1 text-sm text-gray-500">
                {formData.shortDescription?.length || 0}/200 characters
              </p>
            </div>
          </div>

          {/* Tags */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Tags
              </label>
              <button
                type="button"
                onClick={() => setIsTagsModalOpen(true)}
                className="btn btn-secondary text-sm"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Manage Tags
              </button>
            </div>
            <div className="flex flex-wrap gap-2 min-h-[2rem]">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                >
                  {tag}
                </span>
              ))}
              {formData.tags.length === 0 && (
                <span className="text-gray-500 text-sm">No tags added</span>
              )}
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
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                        SKU *
                        <InfoIcon content="Stock Keeping Unit - unique identifier for inventory tracking. Use letters, numbers, dashes, underscores, and dots only." />
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
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                        Price *
                        <InfoIcon content="Selling price for this variant. Must be greater than 0. This is the price customers will pay." />
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={variant.price === 0 ? '' : variant.price}
                        onChange={(e) => handleVariantChange(index, 'price', e.target.value === '' ? 0 : (parseFloat(e.target.value) || 0))}
                        className={`input-field ${errors[`variant-${index}-price`] ? 'border-red-300' : ''}`}
                        placeholder="0.00"
                      />
                      {errors[`variant-${index}-price`] && (
                        <p className="mt-1 text-xs text-red-600">{errors[`variant-${index}-price`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                        Compare Price
                        <InfoIcon content="Original or MSRP price. If set, will be shown crossed out next to the selling price to show savings. Used for displaying discounts." />
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={variant.comparePrice === 0 ? '' : (variant.comparePrice || '')}
                        onChange={(e) => handleVariantChange(index, 'comparePrice', e.target.value === '' ? 0 : (parseFloat(e.target.value) || 0))}
                        className="input-field"
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                        Cost Price
                        <InfoIcon content="Internal cost price for profit margin calculations. Not visible to customers. Used for inventory and financial reporting." />
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={variant.costPrice === 0 ? '' : (variant.costPrice || '')}
                        onChange={(e) => handleVariantChange(index, 'costPrice', e.target.value === '' ? 0 : (parseFloat(e.target.value) || 0))}
                        className="input-field"
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={variant.weight === 0 ? '' : variant.weight}
                        onChange={(e) => handleVariantChange(index, 'weight', e.target.value === '' ? 0 : (parseFloat(e.target.value) || 0))}
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
                        value={variant.dimensions.length === 0 ? '' : variant.dimensions.length}
                        onChange={(e) => handleVariantChange(index, 'dimensions', {
                          ...variant.dimensions,
                          length: e.target.value === '' ? 0 : (parseFloat(e.target.value) || 0),
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
                        value={variant.dimensions.width === 0 ? '' : variant.dimensions.width}
                        onChange={(e) => handleVariantChange(index, 'dimensions', {
                          ...variant.dimensions,
                          width: e.target.value === '' ? 0 : (parseFloat(e.target.value) || 0),
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
                        value={variant.dimensions.height === 0 ? '' : variant.dimensions.height}
                        onChange={(e) => handleVariantChange(index, 'dimensions', {
                          ...variant.dimensions,
                          height: e.target.value === '' ? 0 : (parseFloat(e.target.value) || 0),
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

                  {/* Variant Images */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Variant Images
                    </label>
                    <ImageUpload
                      existingImages={variant.images || []}
                      onImageUpload={(url) => {
                        handleVariantChange(index, 'images', [...(variant.images || []), url]);
                      }}
                      onImageRemove={(imgIndex) => {
                        const next = [...(variant.images || [])];
                        next.splice(imgIndex, 1);
                        handleVariantChange(index, 'images', next);
                      }}
                      maxImages={10}
                    />
                    <p className="mt-1 text-xs text-gray-500">Upload multiple images specific to this variant.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
            </div>
          )}

          {/* SEO Tab */}
          {activeTab === 'seo' && (
            <ProductFormSEO
              formData={formData}
              errors={errors}
              onFieldChange={handleChange}
              onNestedFieldChange={(parentField, field, value) => {
                if (parentField === 'seo') {
                  setFormData(prev => ({
                    ...prev,
                    seo: {
                      ...prev.seo,
                      [field]: value,
                    },
                  }));
                  // Auto-sync main slug with SEO slug when SEO slug changes
                  if (field === 'slug' && value) {
                    setFormData(prev => ({
                      ...prev,
                      slug: value, // Sync main slug with SEO slug
                    }));
                  }
                }
              }}
            />
          )}

          {/* Clothing Properties Tab */}
          {activeTab === 'properties' && (
            <div className="space-y-6">
              {/* Row 1: Fabric, Collection, Occasion, Season */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    Fabric Type
                    <InfoIcon content="Select the primary fabric or material used in this clothing item (e.g., Cotton, Silk, Linen). Helps customers understand product quality and care requirements." />
                  </label>
                  <button type="button" className="text-xs text-blue-600 hover:underline" onClick={() => setQuickAdd({ type: 'Fabric' })}>+ Add new fabric type</button>
                </div>
                <select
                  value={formData.fabric}
                  onChange={(e) => handleChange('fabric', e.target.value)}
                  className="input-field"
                >
                  <option value="">Select Fabric</option>
                  {fabricOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  Collection
                  <InfoIcon content="Optional collection name (e.g., 'Summer 2024', 'Eid Collection'). Used to group related products for marketing and display purposes." />
                </label>
                <input
                  type="text"
                  value={formData.collectionName}
                  onChange={(e) => handleChange('collectionName', e.target.value)}
                  className="input-field"
                  placeholder="e.g., Summer 2024, Eid Collection"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    Occasion
                    <InfoIcon content="Select the occasion this clothing is suitable for (e.g., Casual, Formal, Wedding, Party). Helps customers find appropriate clothing for their needs." />
                  </label>
                  <button type="button" className="text-xs text-blue-600 hover:underline" onClick={() => setQuickAdd({ type: 'Occasion' })}>+ Add new occasion</button>
                </div>
                <select
                  value={formData.occasion}
                  onChange={(e) => handleChange('occasion', e.target.value)}
                  className="input-field"
                >
                  <option value="">Select Occasion</option>
                  {occasionOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    Season
                    <InfoIcon content="Select the season this clothing is designed for (e.g., Spring, Summer, Fall, Winter). Helps with seasonal collections and recommendations." />
                  </label>
                  <button type="button" className="text-xs text-blue-600 hover:underline" onClick={() => setQuickAdd({ type: 'Season' })}>+ Add new season</button>
                </div>
                <select
                  value={formData.season}
                  onChange={(e) => handleChange('season', e.target.value)}
                  className="input-field"
                >
                  <option value="">Select Season</option>
                  {seasonOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
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
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Color Family</label>
                  <button type="button" className="text-xs text-blue-600 hover:underline" onClick={() => setQuickAdd({ type: 'Color Family' })}>+ Add new color family</button>
                </div>
                <select
                  value={formData.colorFamily}
                  onChange={(e) => handleChange('colorFamily', e.target.value)}
                  className="input-field"
                >
                  <option value="">Select Color Family</option>
                  {colorFamilyOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Pattern</label>
                  <button type="button" className="text-xs text-blue-600 hover:underline" onClick={() => setQuickAdd({ type: 'Pattern' })}>+ Add new pattern</button>
                </div>
                <select
                  value={formData.pattern}
                  onChange={(e) => handleChange('pattern', e.target.value)}
                  className="input-field"
                >
                  <option value="">Select Pattern</option>
                  {patternOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Sleeve Length</label>
                  <button type="button" className="text-xs text-blue-600 hover:underline" onClick={() => setQuickAdd({ type: 'Sleeve Length' })}>+ Add new sleeve length</button>
                </div>
                <select
                  value={formData.sleeveLength}
                  onChange={(e) => handleChange('sleeveLength', e.target.value)}
                  className="input-field"
                >
                  <option value="">Select Sleeve Length</option>
                  {sleeveLengthOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Add Modal Dispatcher */}
            {quickAdd.type && (
              <QuickAddMasterDataModal
                isOpen={true}
                onClose={() => setQuickAdd({ type: null })}
                title={quickAdd.type}
                service={
                  quickAdd.type === 'Color Family' ? (colorFamilyService as any) :
                  quickAdd.type === 'Pattern' ? (patternService as any) :
                  quickAdd.type === 'Sleeve Length' ? (sleeveLengthService as any) :
                  quickAdd.type === 'Fabric' ? (materialService as any) :
                  quickAdd.type === 'Occasion' ? (occasionService as any) :
                  (seasonService as any)
                }
                onCreated={(created: any) => {
                  const name = created.name;
                  switch (quickAdd.type) {
                    case 'Color Family':
                      setColorFamilyOptions(prev => prev.includes(name) ? prev : [...prev, name]);
                      handleChange('colorFamily', name);
                      break;
                    case 'Pattern':
                      setPatternOptions(prev => prev.includes(name) ? prev : [...prev, name]);
                      handleChange('pattern', name);
                      break;
                    case 'Sleeve Length':
                      setSleeveLengthOptions(prev => prev.includes(name) ? prev : [...prev, name]);
                      handleChange('sleeveLength', name);
                      break;
                    case 'Fabric':
                      setFabricOptions(prev => prev.includes(name) ? prev : [...prev, name]);
                      handleChange('fabric', name);
                      break;
                    case 'Occasion':
                      setOccasionOptions(prev => prev.includes(name) ? prev : [...prev, name]);
                      handleChange('occasion', name);
                      break;
                    case 'Season':
                      setSeasonOptions(prev => prev.includes(name) ? prev : [...prev, name]);
                      handleChange('season', name);
                      break;
                  }
                  setQuickAdd({ type: null });
                }}
              />
            )}
          </div>
        )}

          {/* Measurements Tab */}
          {activeTab === 'measurements' && (
            <div className="space-y-6">
              {/* Model Measurements */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Model Height (for size reference)
                </label>
                <div className="w-full md:w-1/3">
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
                    className="btn btn-secondary text-sm"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Manage Sizes
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 min-h-[2rem]">
                  {formData.availableSizes?.map((sizeId, index) => (
                    <span
                      key={sizeId || index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                    >
                      {sizeNamesMap[sizeId] || sizeId}
                    </span>
                  ))}
                  {(!formData.availableSizes || formData.availableSizes.length === 0) && (
                    <span className="text-gray-500 text-sm">No sizes added</span>
                  )}
                </div>
              </div>

              {/* Size Chart */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size Chart ID
                </label>
                <input
                  type="text"
                  value={formData.sizeChart}
                  onChange={(e) => handleChange('sizeChart', e.target.value)}
                  placeholder="Enter size chart ID"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Size Chart Image */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size Chart Image
                </label>
                <ImageUpload
                  onImageUpload={(url) => handleChange('sizeChartImageUrl', url)}
                  onImageRemove={() => handleChange('sizeChartImageUrl', '')}
                  existingImages={formData.sizeChartImageUrl ? [formData.sizeChartImageUrl] : []}
                  maxImages={1}
                />
              </div>
            </div>
          )}

          {/* Features & Details Tab */}
          {activeTab === 'features' && (
            <div className="space-y-6">
              {/* Features */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Product Features
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsFeaturesModalOpen(true)}
                    className="btn btn-secondary text-sm"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Manage Features
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 min-h-[2rem]">
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
                    className="btn btn-secondary text-sm"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Manage Colors
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 min-h-[2rem]">
                  {formData.colors?.map((color, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                    >
                      {color.colorId}
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
                    className="btn btn-secondary text-sm"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Manage Attributes
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 min-h-[2rem]">
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

            </div>
          )}

          {/* Images Tab */}
          {activeTab === 'images' && (
            <div className="space-y-6">
              <div>
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
            </div>
          )}

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

        {/* Modals */}
        <TagsModal
          isOpen={isTagsModalOpen}
          onClose={() => setIsTagsModalOpen(false)}
          tags={formData.tags}
          onTagsChange={(tags) => handleChange('tags', tags)}
        />

        <KeywordsModal
          isOpen={isKeywordsModalOpen}
          onClose={() => setIsKeywordsModalOpen(false)}
          keywords={formData.seo.keywords}
          onKeywordsChange={(keywords) => handleChange('seo', { ...formData.seo, keywords })}
        />

        <FeaturesModal
          isOpen={isFeaturesModalOpen}
          onClose={() => setIsFeaturesModalOpen(false)}
          features={formData.features || []}
          onFeaturesChange={(features) => handleChange('features', features)}
        />

        <ColorsModal
          isOpen={isColorsModalOpen}
          onClose={() => setIsColorsModalOpen(false)}
          colors={formData.colors || []}
          onColorsChange={(colors) => handleChange('colors', colors)}
        />

        <AttributesModal
          isOpen={isAttributesModalOpen}
          onClose={() => setIsAttributesModalOpen(false)}
          attributes={formData.attributes || []}
          onAttributesChange={(attributes) => handleChange('attributes', attributes)}
        />

        <SizesModal
          isOpen={isSizesModalOpen}
          onClose={() => setIsSizesModalOpen(false)}
          sizes={formData.availableSizes || []}
          onSizesChange={(sizes) => handleChange('availableSizes', sizes)}
        />
      </div>
    </div>
  );
};

export default ProductForm; 
