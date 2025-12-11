import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  PlusIcon, 
  TrashIcon, 
  PencilIcon,
  CheckCircleIcon,
  XCircleIcon,
  PhotoIcon,
  QuestionMarkCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { bannerService, Banner, CreateBannerDto } from '../services/bannerService';
import ImageUpload from '../components/common/ImageUpload';

const BannersPage: React.FC = () => {
  const navigate = useNavigate();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [formData, setFormData] = useState<CreateBannerDto>({
    title: '',
    subtitle: '',
    description: '',
    imageUrl: '',
    altText: '',
    linkUrl: '',
    linkText: '',
    displayOrder: 0,
    enabled: true,
    position: 'hero',
    startDate: '',
    endDate: '',
    requiredSize: {
      width: 1920,
      height: 800,
    },
  });

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await bannerService.getAll(1, 100);
      console.log('Banner service response:', response); // Debug log
      if (response.success) {
        if (Array.isArray(response.data)) {
          setBanners(response.data);
        } else {
          console.warn('Response data is not an array:', response.data);
          setBanners([]);
        }
      } else {
        setError(response.message || 'Failed to load banners');
      }
    } catch (err: any) {
      console.error('Error loading banners:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load banners');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Clean requiredSize to remove _id if it exists
      const cleanRequiredSize = formData.requiredSize
        ? { width: formData.requiredSize.width, height: formData.requiredSize.height }
        : { width: 1920, height: 800 };

      const submitData: CreateBannerDto = {
        ...formData,
        requiredSize: cleanRequiredSize,
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined,
      };

      if (editingBanner?._id) {
        const response = await bannerService.update(editingBanner._id, submitData);
        if (response.success && response.data) {
          await loadBanners();
          setShowForm(false);
          setEditingBanner(null);
          resetForm();
        } else {
          setError(response.message || 'Failed to update banner');
        }
      } else {
        const response = await bannerService.create(submitData);
        if (response.success && response.data) {
          await loadBanners();
          setShowForm(false);
          resetForm();
        } else {
          setError(response.message || 'Failed to create banner');
        }
      }
    } catch (err: any) {
      console.error('Error saving banner:', err);
      setError(err.response?.data?.message || 'Failed to save banner');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    // Clean requiredSize to remove _id if it exists
    const cleanRequiredSize = banner.requiredSize 
      ? { width: banner.requiredSize.width, height: banner.requiredSize.height }
      : { width: 1920, height: 800 };
    
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || '',
      description: banner.description || '',
      imageUrl: banner.imageUrl,
      altText: banner.altText || '',
      linkUrl: banner.linkUrl || '',
      linkText: banner.linkText || '',
      displayOrder: banner.displayOrder,
      enabled: banner.enabled,
      position: banner.position,
      startDate: banner.startDate ? new Date(banner.startDate).toISOString().split('T')[0] : '',
      endDate: banner.endDate ? new Date(banner.endDate).toISOString().split('T')[0] : '',
      requiredSize: cleanRequiredSize,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) {
      return;
    }

    setIsLoading(true);
    try {
      await bannerService.delete(id);
      await loadBanners();
    } catch (err: any) {
      console.error('Error deleting banner:', err);
      setError(err.response?.data?.message || 'Failed to delete banner');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    setIsLoading(true);
    try {
      await bannerService.toggleStatus(id, !currentStatus);
      await loadBanners();
    } catch (err: any) {
      console.error('Error toggling banner status:', err);
      setError(err.response?.data?.message || 'Failed to toggle banner status');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      imageUrl: '',
      altText: '',
      linkUrl: '',
      linkText: '',
      displayOrder: 0,
      enabled: true,
      position: 'hero',
      startDate: '',
      endDate: '',
      requiredSize: {
        width: 1920,
        height: 800,
      },
    });
  };

  const getPositionLabel = (position: string) => {
    const labels: Record<string, string> = {
      hero: 'Hero (Homepage)',
      collection: 'Collection',
      promotional: 'Promotional',
      sidebar: 'Sidebar',
    };
    return labels[position] || position;
  };

  const getSizeRequirement = (position: string) => {
    const sizes: Record<string, { width: number; height: number }> = {
      hero: { width: 1920, height: 800 },
      collection: { width: 1200, height: 600 },
      promotional: { width: 1920, height: 400 },
      sidebar: { width: 300, height: 600 },
    };
    return sizes[position] || { width: 1920, height: 800 };
  };

  const handlePositionChange = (position: string) => {
    const size = getSizeRequirement(position);
    setFormData({
      ...formData,
      position: position as any,
      requiredSize: size,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back
          </button>
          <div className="h-6 w-px bg-gray-300" />
          <h1 className="text-2xl font-bold text-gray-900">Banners</h1>
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="flex items-center text-gray-500 hover:text-gray-700"
            title="Show help"
          >
            <QuestionMarkCircleIcon className="h-5 w-5" />
          </button>
        </div>
        <button
          onClick={() => {
            setEditingBanner(null);
            resetForm();
            setShowForm(true);
          }}
          className="btn btn-primary"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Banner
        </button>
      </div>

      {/* Help Section */}
      {showHelp && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
          <div className="flex items-start">
            <InformationCircleIcon className="h-6 w-6 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Banner Management Guide</h3>
              
              <div className="space-y-4 text-sm text-blue-800">
                <div>
                  <h4 className="font-semibold mb-2">How to Create a Banner:</h4>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Click the "Add Banner" button</li>
                    <li>Fill in the required fields (Title, Position, Image URL)</li>
                    <li>Choose the banner position (Hero, Collection, Promotional, or Sidebar)</li>
                    <li>Upload or enter the image URL matching the required dimensions</li>
                    <li>Add optional details like subtitle, description, and link</li>
                    <li>Set display order to control banner sequence</li>
                    <li>Click "Create Banner" to save</li>
                  </ol>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Banner Positions & Sizes:</h4>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li><strong>Hero (Homepage):</strong> 1920 x 800px - Main banner on homepage</li>
                    <li><strong>Collection:</strong> 1200 x 600px - Collection page banners</li>
                    <li><strong>Promotional:</strong> 1920 x 400px - Promotional banners</li>
                    <li><strong>Sidebar:</strong> 300 x 600px - Sidebar advertisements</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Tips for Best Results:</h4>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Use high-quality images that match the exact dimensions</li>
                    <li>Keep file sizes optimized for faster loading</li>
                    <li>Use descriptive alt text for accessibility</li>
                    <li>Set start and end dates for time-limited promotions</li>
                    <li>Use display order to prioritize important banners</li>
                    <li>Test banners on different screen sizes</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Managing Banners:</h4>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li><strong>Edit:</strong> Click the pencil icon to modify a banner</li>
                    <li><strong>Enable/Disable:</strong> Click the status icon to toggle visibility</li>
                    <li><strong>Delete:</strong> Click the trash icon to remove a banner</li>
                    <li>Only enabled banners will be displayed on the website</li>
                  </ul>
                </div>
              </div>

              <button
                onClick={() => setShowHelp(false)}
                className="mt-4 text-sm text-blue-700 hover:text-blue-900 font-medium"
              >
                Hide Help
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">
                  {editingBanner ? 'Edit Banner' : 'Add Banner'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingBanner(null);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Size Requirement Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <div className="flex items-start">
                    <PhotoIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-900">
                        Required Image Size: {formData.requiredSize.width} x {formData.requiredSize.height} pixels
                      </p>
                      <p className="text-xs text-blue-700 mt-1">
                        Please ensure your banner image matches these dimensions for optimal display. Images that don't match may appear stretched or distorted.
                      </p>
                      <div className="mt-2 text-xs text-blue-600">
                        <strong>Quick Tips:</strong>
                        <ul className="list-disc list-inside mt-1 ml-2">
                          <li>Use image editing software to resize your images</li>
                          <li>Maintain aspect ratio when possible</li>
                          <li>Optimize images for web (JPEG or PNG format)</li>
                          <li>Keep file sizes under 500KB for faster loading</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Banner title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Position *
                      <span className="ml-2 text-xs text-gray-500 font-normal">
                        (Where the banner will appear)
                      </span>
                    </label>
                    <select
                      required
                      value={formData.position}
                      onChange={(e) => handlePositionChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="hero">Hero (Homepage) - 1920 x 800px</option>
                      <option value="collection">Collection - 1200 x 600px</option>
                      <option value="promotional">Promotional - 1920 x 400px</option>
                      <option value="sidebar">Sidebar - 300 x 600px</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      The image size requirement will update automatically based on position
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      value={formData.subtitle}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Banner subtitle"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Display Order
                      <span className="ml-2 text-xs text-gray-500 font-normal">
                        (Lower numbers appear first)
                      </span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.displayOrder}
                      onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Banners with the same position are ordered by this number (ascending)
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Banner description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL *
                  </label>
                  <ImageUpload
                    existingImages={formData.imageUrl ? [formData.imageUrl] : []}
                    onImageUpload={(url) => setFormData({ ...formData, imageUrl: url })}
                    onImageRemove={() => setFormData({ ...formData, imageUrl: '' })}
                    maxImages={1}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Recommended size: {formData.requiredSize.width} x {formData.requiredSize.height}px
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alt Text
                  </label>
                  <input
                    type="text"
                    value={formData.altText}
                    onChange={(e) => setFormData({ ...formData, altText: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Image alt text for accessibility"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Link URL
                      <span className="ml-2 text-xs text-gray-500 font-normal">
                        (Optional)
                      </span>
                    </label>
                    <input
                      type="text"
                      value={formData.linkUrl}
                      onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="/shop or https://example.com"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Use relative paths (e.g., /shop) for internal links or full URLs for external
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Link Text
                      <span className="ml-2 text-xs text-gray-500 font-normal">
                        (Button text)
                      </span>
                    </label>
                    <input
                      type="text"
                      value={formData.linkText}
                      onChange={(e) => setFormData({ ...formData, linkText: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Shop Now"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Text displayed on the banner button (e.g., "Shop Now", "Learn More")
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                      <span className="ml-2 text-xs text-gray-500 font-normal">
                        (Optional - when banner becomes active)
                      </span>
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Leave empty to show immediately
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                      <span className="ml-2 text-xs text-gray-500 font-normal">
                        (Optional - when banner expires)
                      </span>
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Leave empty for no expiration
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enabled"
                    checked={formData.enabled}
                    onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="enabled" className="ml-2 block text-sm text-gray-900">
                    Enabled
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingBanner(null);
                      resetForm();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isLoading ? 'Saving...' : editingBanner ? 'Update Banner' : 'Create Banner'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Banners List */}
      {isLoading && banners.length === 0 ? (
        <LoadingSpinner />
      ) : banners.length === 0 ? (
        <div className="text-center py-12">
          <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No banners</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new banner.</p>
          <div className="mt-6">
            <button
              onClick={() => {
                setEditingBanner(null);
                resetForm();
                setShowForm(true);
              }}
              className="btn btn-primary"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add First Banner
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size Required
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {banners.map((banner) => (
                <tr key={banner._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={banner.imageUrl}
                      alt={banner.altText || banner.title}
                      className="h-16 w-32 object-cover rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-product.svg';
                      }}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{banner.title}</div>
                    {banner.subtitle && (
                      <div className="text-sm text-gray-500">{banner.subtitle}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {getPositionLabel(banner.position)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {banner.displayOrder}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleStatus(banner._id!, banner.enabled)}
                      className={`flex items-center ${
                        banner.enabled ? 'text-green-600' : 'text-gray-400'
                      }`}
                    >
                      {banner.enabled ? (
                        <CheckCircleIcon className="h-5 w-5" />
                      ) : (
                        <XCircleIcon className="h-5 w-5" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {banner.requiredSize?.width} x {banner.requiredSize?.height}px
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(banner)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(banner._id!)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BannersPage;

