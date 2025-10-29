import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, TrashIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../ui/LoadingSpinner';
import { MasterDataItem, ApiResponse } from '../../services/masterDataService';

interface MasterDataServiceType {
  getAll: () => Promise<ApiResponse<MasterDataItem[]>>;
  getById: (id: string) => Promise<ApiResponse<MasterDataItem>>;
  create: (data: Partial<MasterDataItem>) => Promise<ApiResponse<MasterDataItem>>;
  update: (id: string, data: Partial<MasterDataItem>) => Promise<ApiResponse<MasterDataItem>>;
  delete: (id: string) => Promise<ApiResponse<void>>;
}

interface MasterDataFormPageProps {
  service: MasterDataServiceType;
  title: string;
  description: string;
  singularTitle: string;
  routePrefix: string;
  examples?: string[];
}

const MasterDataFormPage: React.FC<MasterDataFormPageProps> = ({
  service,
  title,
  description,
  singularTitle,
  routePrefix,
  examples = [],
}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [item, setItem] = useState<MasterDataItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (id) {
        const response = await service.getById(id);
        if (response.success && response.data) {
          setItem(response.data);
          setFormData({
            name: response.data.name,
            description: response.data.description || '',
            isActive: response.data.isActive ?? true,
          });
        } else {
          setError(`${singularTitle} not found`);
        }
      } else {
        // Not editing - initialize form for new item
        setItem(null);
        setFormData({
          name: '',
          description: '',
          isActive: true,
        });
      }
    } catch (err: any) {
      console.error(`Error fetching ${singularTitle.toLowerCase()}:`, err);
      setError(err.response?.data?.message || `Failed to load ${singularTitle.toLowerCase()}`);
    } finally {
      setIsLoading(false);
    }
  }, [id, service, singularTitle]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = `${singularTitle} name is required`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      const itemData = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        isActive: formData.isActive,
      };

      let response: ApiResponse<MasterDataItem>;
      if (isEditing && id) {
        response = await service.update(id, itemData);
      } else {
        response = await service.create(itemData);
      }

      if (response.success) {
        navigate(routePrefix);
      } else {
        throw new Error(response.message || `Failed to save ${singularTitle.toLowerCase()}`);
      }
    } catch (err: any) {
      console.error(`Error saving ${singularTitle.toLowerCase()}:`, err);
      setError(err.response?.data?.message || `Failed to save ${singularTitle.toLowerCase()}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!item?._id) return;

    if (window.confirm(`Are you sure you want to delete this ${singularTitle.toLowerCase()}? This action cannot be undone.`)) {
      try {
        setIsSaving(true);
        const response = await service.delete(item._id);
        if (response.success) {
          navigate(routePrefix);
        } else {
          throw new Error(response.message || `Failed to delete ${singularTitle.toLowerCase()}`);
        }
      } catch (err: any) {
        console.error(`Error deleting ${singularTitle.toLowerCase()}:`, err);
        setError(err.response?.data?.message || `Failed to delete ${singularTitle.toLowerCase()}`);
      } finally {
        setIsSaving(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error && !item && isEditing) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-600">{error}</p>
          <button
            onClick={() => navigate(routePrefix)}
            className="mt-4 text-sm text-red-700 underline"
          >
            Go back to {title}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(routePrefix)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to {title}
        </button>
        {isEditing && item && (
          <button
            onClick={handleDelete}
            className="flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700"
          >
            <TrashIcon className="h-5 w-5 mr-2" />
            Delete
          </button>
        )}
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white shadow-sm rounded-lg">
          <div className="p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {singularTitle} Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder={`Enter ${singularTitle.toLowerCase()} name`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={`Describe the ${singularTitle.toLowerCase()}...`}
                />
                <p className="mt-1 text-sm text-gray-500">
                  {description}
                </p>
              </div>

              {/* Active Status */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => handleFieldChange('isActive', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Active (this {singularTitle.toLowerCase()} will be available for selection)
                  </span>
                </label>
              </div>

              {/* Examples */}
              {examples.length > 0 && (
                <div className="bg-gray-50 rounded-md p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    Common {title} Examples
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {examples.map((example) => (
                      <span
                        key={example}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {isEditing ? `Update ${singularTitle.toLowerCase()} information` : `Create a new ${singularTitle.toLowerCase()} for your products`}
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => navigate(routePrefix)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isSaving ? 'Saving...' : (isEditing ? 'Update' : 'Create')} {singularTitle}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasterDataFormPage;

