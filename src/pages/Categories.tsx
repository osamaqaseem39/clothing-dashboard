import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon, EyeSlashIcon, Squares2X2Icon, ListBulletIcon } from '@heroicons/react/24/outline';
import { categoryService } from '../services/categoryService';
import type { Category } from '../types';
import CategoryTree from '../components/CategoryTree';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import Modal from '../components/ui/Modal';
import Table from '../components/ui/Table';
import SearchInput from '../components/ui/SearchInput';

const Categories: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<Category | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'tree'>('table');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    filterCategories();
  }, [categories, searchQuery]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await categoryService.getCategories();
      setCategories(response.data || []);
    } catch (err) {
      setError('Failed to load categories');
      console.error('Error loading categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterCategories = () => {
    if (!searchQuery.trim()) {
      setFilteredCategories(categories);
      return;
    }

    const filtered = categories.filter(category =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredCategories(filtered);
  };

  const handleDeleteCategory = async (category: Category) => {
    try {
      await categoryService.deleteCategory(category._id);
      await loadCategories();
      setDeleteConfirm(null);
    } catch (err) {
      setError('Failed to delete category');
      console.error('Error deleting category:', err);
    }
  };

  const handleToggleStatus = async (category: Category) => {
    try {
      await categoryService.updateCategory(category._id, { isActive: !category.isActive });
      await loadCategories();
    } catch (err) {
      setError('Failed to update category status');
      console.error('Error updating category status:', err);
    }
  };

  const handleAddCategory = () => {
    navigate('/categories/new');
  };

  const handleEditCategory = (category: Category) => {
    navigate(`/categories/${category._id}/edit`);
  };

  const getParentCategoryName = (parentId: string | undefined) => {
    if (!parentId) return 'Root Category';
    const parent = categories.find(cat => cat._id === parentId);
    return parent ? parent.name : 'Unknown Parent';
  };

  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (category: Category) => (
        <div className="flex items-center space-x-3">
          {category.icon && (
            <span className="text-lg">{category.icon}</span>
          )}
          <div>
            <div className="font-medium text-gray-900">{category.name}</div>
            <div className="text-sm text-gray-500">/{category.slug}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'parent',
      header: 'Parent',
      render: (category: Category) => (
        <span className="text-sm text-gray-600">
          {getParentCategoryName(category.parentId)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (category: Category) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          category.isActive 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {category.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'products',
      header: 'Products',
      render: (category: Category) => (
        <span className="text-sm text-gray-600">
          {category.productCount || 0}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (category: Category) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleToggleStatus(category)}
            className="text-gray-400 hover:text-gray-600"
            title={category.isActive ? 'Deactivate' : 'Activate'}
          >
            {category.isActive ? (
              <EyeSlashIcon className="h-4 w-4" />
            ) : (
              <EyeIcon className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={() => handleEditCategory(category)}
            className="text-blue-600 hover:text-blue-800"
            title="Edit"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => setDeleteConfirm(category)}
            className="text-red-600 hover:text-red-800"
            title="Delete"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600">Manage product categories and subcategories</p>
        </div>
        <Button
          onClick={handleAddCategory}
          className="flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Category</span>
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <ErrorMessage message={error} onRetry={() => setError(null)} />
      )}

      {/* Search and Filters */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              <div className="flex-1">
                <SearchInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search categories..."
                />
              </div>
              <div className="text-sm text-gray-500">
                {filteredCategories.length} of {categories.length} categories
              </div>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">View:</span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'table'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <ListBulletIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('tree')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'tree'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Squares2X2Icon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Categories Content */}
      {viewMode === 'table' ? (
        <Card>
          <div className="overflow-x-auto">
            <Table
              data={filteredCategories}
              columns={columns}
              emptyMessage="No categories found"
            />
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CategoryTree
            categories={filteredCategories}
            onCategorySelect={setSelectedCategory}
            onCategoryEdit={handleEditCategory}
            onCategoryDelete={setDeleteConfirm}
            selectedCategoryId={selectedCategory?._id}
            showActions={true}
          />
          
          {selectedCategory && (
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Category Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Name</label>
                    <p className="text-gray-900">{selectedCategory.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Slug</label>
                    <p className="text-gray-900">/{selectedCategory.slug}</p>
                  </div>
                  {selectedCategory.description && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Description</label>
                      <p className="text-gray-900">{selectedCategory.description}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedCategory.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedCategory.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  {selectedCategory.productCount !== undefined && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Products</label>
                      <p className="text-gray-900">{selectedCategory.productCount}</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 flex space-x-3">
                  <Button
                    variant="secondary"
                    onClick={() => handleEditCategory(selectedCategory)}
                    className="flex-1"
                  >
                    Edit Category
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => setDeleteConfirm(selectedCategory)}
                    className="flex-1"
                  >
                    Delete Category
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <Modal
          isOpen={true}
          onClose={() => setDeleteConfirm(null)}
          title="Delete Category"
        >
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete the category "{deleteConfirm.name}"?
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="secondary"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDeleteCategory(deleteConfirm)}
              >
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Categories;
