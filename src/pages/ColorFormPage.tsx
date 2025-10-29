import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, PlusIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { colorService, Color } from '../services/masterDataService';

const ColorFormPage: React.FC = () => {
  const navigate = useNavigate();
  const [colors, setColors] = useState<Color[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingColor, setEditingColor] = useState<Color | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    hexCode: '#000000',
    isActive: true,
  });

  // Fetch colors on component mount
  useEffect(() => {
    fetchColors();
  }, []);

  const fetchColors = async () => {
    try {
      setIsLoading(true);
      const response = await colorService.getAll();
      if (response.success && response.data) {
        setColors(response.data);
      }
    } catch (error) {
      console.error('Error fetching colors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const colorData = {
        name: formData.name.trim(),
        hexCode: formData.hexCode,
        isActive: formData.isActive,
      };

      if (editingColor) {
        await colorService.update(editingColor._id!, colorData);
      } else {
        await colorService.create(colorData);
      }

      setShowForm(false);
      setEditingColor(null);
      resetForm();
      fetchColors(); // Refresh the list
    } catch (error) {
      console.error('Error saving color:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (color: Color) => {
    setEditingColor(color);
    setFormData({
      name: color.name,
      hexCode: color.hexCode || '#000000',
      isActive: color.isActive ?? true,
    });
    setShowForm(true);
  };

  const handleDelete = async (colorId: string) => {
    if (window.confirm('Are you sure you want to delete this color?')) {
      try {
        await colorService.delete(colorId);
        fetchColors(); // Refresh the list
      } catch (error) {
        console.error('Error deleting color:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      hexCode: '#000000',
      isActive: true,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/dashboard/settings')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Settings
          </button>
          <div className="h-6 w-px bg-gray-300" />
          <h1 className="text-2xl font-bold text-gray-900">Color Management</h1>
        </div>
        <button
          onClick={() => {
            setEditingColor(null);
            resetForm();
            setShowForm(true);
          }}
          className="btn btn-primary"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Color
        </button>
      </div>

      {/* Colors List */}
      <div className="card">
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Color
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hex Code
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
              {colors.map((color) => (
                <tr key={color._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div
                        className="h-8 w-8 rounded-full border border-gray-300 mr-3"
                        style={{ backgroundColor: color.hexCode || '#000000' }}
                      />
                      <span className="text-sm font-medium text-gray-900">{color.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {color.hexCode || '#000000'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      color.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {color.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(color)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(color._id!)}
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
          <div className="relative top-20 mx-auto p-6 border w-full max-w-md shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingColor ? 'Edit Color' : 'Add New Color'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="input-field"
                  placeholder="e.g., Red, Blue, Green"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hex Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.hexCode}
                    onChange={(e) => setFormData({...formData, hexCode: e.target.value})}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.hexCode}
                    onChange={(e) => setFormData({...formData, hexCode: e.target.value})}
                    className="input-field flex-1"
                    placeholder="#000000"
                  />
                </div>
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
                    setEditingColor(null);
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
                  {isLoading ? 'Saving...' : (editingColor ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorFormPage;
