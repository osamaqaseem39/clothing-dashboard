import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  PlusIcon, 
  TrashIcon, 
  PencilIcon,
  CheckCircleIcon,
  XCircleIcon,
  PhotoIcon
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
      if (response.success && response.data) {
        setBanners(response.data);
      } else {
        setError(response.message || 'Failed to load banners');
      }
    } catch (err: any) {
      console.error('Error loading banners:', err);
      setError(err.response?.data?.message || 'Failed to load banners');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const submitData: CreateBannerDto = {
        ...formData,
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
      requiredSize: banner.requiredSize || { width: 1920, height: 800 },
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
                    <PhotoIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">
                        Required Image Size: {formData.requiredSize.width} x {formData.requiredSize.height} pixels
                      </p>
                      <p className="text-xs text-blue-700 mt-1">
                        Please ensure your banner image matches these dimensions for optimal display.
                      </p>
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
                    </label>
                    <select
                      required
                      value={formData.position}
                      onChange={(e) => handlePositionChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="hero">Hero (Homepage)</option>
                      <option value="collection">Collection</option>
                      <option value="promotional">Promotional</option>
                      <option value="sidebar">Sidebar</option>
                    </select>
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
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.displayOrder}
                      onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
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
                    </label>
                    <input
                      type="text"
                      value={formData.linkUrl}
                      onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="/shop or https://example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Link Text
                    </label>
                    <input
                      type="text"
                      value={formData.linkText}
                      onChange={(e) => setFormData({ ...formData, linkText: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Shop Now"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
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

