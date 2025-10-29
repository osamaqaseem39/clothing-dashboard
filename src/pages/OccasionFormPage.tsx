import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, PlusIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { occasionService, MasterDataItem } from '../services/masterDataService';

const OccasionFormPage: React.FC = () => {
  const navigate = useNavigate();
  const [occasions, setOccasions] = useState<MasterDataItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingOccasion, setEditingOccasion] = useState<MasterDataItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true,
  });

  // Fetch occasions on component mount
  useEffect(() => {
    fetchOccasions();
  }, []);

  const fetchOccasions = async () => {
    try {
      setIsLoading(true);
      const response = await occasionService.getAll();
      if (response.success && response.data) {
        setOccasions(response.data);
      }
    } catch (error) {
      console.error('Error fetching occasions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const occasionData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        isActive: formData.isActive,
      };

      if (editingOccasion) {
        await occasionService.update(editingOccasion._id!, occasionData);
      } else {
        await occasionService.create(occasionData);
      }

      setShowForm(false);
      setEditingOccasion(null);
      resetForm();
      fetchOccasions(); // Refresh the list
    } catch (error) {
      console.error('Error saving occasion:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (occasion: MasterDataItem) => {
    setEditingOccasion(occasion);
    setFormData({
      name: occasion.name,
      description: occasion.description || '',
      isActive: occasion.isActive ?? true,
    });
    setShowForm(true);
  };

  const handleDelete = async (occasionId: string) => {
    if (window.confirm('Are you sure you want to delete this occasion?')) {
      try {
        await occasionService.delete(occasionId);
        fetchOccasions(); // Refresh the list
      } catch (error) {
        console.error('Error deleting occasion:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      isActive: true,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/dashboard/products')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Products
          </button>
          <div className="h-6 w-px bg-gray-300" />
          <h1 className="text-2xl font-bold text-gray-900">Occasion Management</h1>
        </div>
        <button
          onClick={() => {
            setEditingOccasion(null);
            resetForm();
            setShowForm(true);
          }}
          className="btn btn-primary"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Occasion
        </button>
      </div>

      {/* Occasions List */}
      <div className="card">
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {occasions.map((occasion) => (
                <tr key={occasion._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{occasion.name}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {occasion.description || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      occasion.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {occasion.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(occasion)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(occasion._id!)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-6 border w-full max-w-lg shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingOccasion ? 'Edit Occasion' : 'Add New Occasion'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="input-field"
                  placeholder="e.g., Formal, Casual, Wedding"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="input-field"
                  rows={3}
                  placeholder="Optional description..."
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">Active</label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingOccasion(null);
                    resetForm();
                  }}
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
                  {isLoading ? 'Saving...' : (editingOccasion ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OccasionFormPage;
