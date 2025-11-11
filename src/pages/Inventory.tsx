import React, { useState, useEffect } from 'react';
import { PlusIcon, ExclamationTriangleIcon, XCircleIcon, CheckCircleIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { inventoryService } from '../services/inventoryService';
import type { Inventory as InventoryType } from '../types';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import Table from '../components/ui/Table';
import SearchInput from '../components/ui/SearchInput';
import Modal from '../components/ui/Modal';

const Inventory: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryType[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<InventoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryType | null>(null);
  const [selectedItem, setSelectedItem] = useState<InventoryType | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<InventoryType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    productName: '',
    sku: '',
    productId: '',
    size: '',
    currentStock: 0,
    availableStock: 0,
    reorderPoint: 0,
    reorderQuantity: 0,
    costPrice: 0,
    sellingPrice: 0,
    warehouse: 'main',
    status: 'in_stock' as 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued',
  });

  useEffect(() => {
    loadInventory();
  }, []);

  useEffect(() => {
    filterInventory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inventory, searchQuery, statusFilter]);

  const loadInventory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await inventoryService.getInventory();
      setInventory(response.data || []);
    } catch (err) {
      setError('Failed to load inventory');
      console.error('Error loading inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const response = await inventoryService.createInventory(formData);
      if (response.success && response.data) {
        setInventory([response.data, ...inventory]);
        setShowForm(false);
        resetForm();
      }
    } catch (err) {
      setError('Failed to create inventory item');
      console.error('Error creating inventory item:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      setIsSubmitting(true);
      const response = await inventoryService.updateInventory(editingItem._id, formData);
      if (response.success && response.data) {
        setInventory(inventory.map(item => 
          item._id === editingItem._id ? response.data! : item
        ));
        setShowForm(false);
        setEditingItem(null);
        resetForm();
      }
    } catch (err) {
      setError('Failed to update inventory item');
      console.error('Error updating inventory item:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItem = async (item: InventoryType) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      setIsDeleting(true);
      const response = await inventoryService.deleteInventory(itemToDelete._id);
      if (response.success) {
        setInventory(inventory.filter(item => item._id !== itemToDelete._id));
        setShowDeleteModal(false);
        setItemToDelete(null);
        setSuccessMessage('Inventory record deleted successfully');
        // Refresh from server for accuracy
        loadInventory();
      }
    } catch (err) {
      setError('Failed to delete inventory item');
      console.error('Error deleting inventory item:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditItem = (item: InventoryType) => {
    setEditingItem(item);
    setFormData({
      productName: item.productName || '',
      sku: item.sku || '',
      productId: item.productId || '',
      size: item.size || '',
      currentStock: item.currentStock || 0,
      availableStock: item.availableStock || 0,
      reorderPoint: item.reorderPoint || 0,
      reorderQuantity: item.reorderQuantity || 0,
      costPrice: item.costPrice || 0,
      sellingPrice: item.sellingPrice || 0,
      warehouse: item.warehouse || 'main',
      status: item.status || 'in_stock',
    });
    setShowForm(true);
  };

  const handleViewItem = (item: InventoryType) => {
    setSelectedItem(item);
    setShowDetails(true);
  };

  const handleAddItem = () => {
    setEditingItem(null);
    resetForm();
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      productName: '',
      sku: '',
      productId: '',
      size: '',
      currentStock: 0,
      availableStock: 0,
      reorderPoint: 0,
      reorderQuantity: 0,
      costPrice: 0,
      sellingPrice: 0,
      warehouse: 'main',
      status: 'in_stock' as 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued',
    });
  };

  const filterInventory = () => {
    let filtered = inventory;

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(item =>
        item.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    setFilteredInventory(filtered);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in_stock':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'low_stock':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case 'out_of_stock':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <XCircleIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock':
        return 'bg-green-100 text-green-800';
      case 'low_stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'out_of_stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const columns = [
    {
      key: 'product',
      header: 'Product',
      render: (item: InventoryType) => (
        <div className="flex items-center space-x-3">
          {item.productImage && (
            <img
              src={item.productImage}
              alt={item.productName}
              className="h-10 w-10 rounded object-cover"
            />
          )}
          <div>
            <div className="font-medium text-gray-900">{item.productName}</div>
            <div className="text-sm text-gray-500">SKU: {item.sku}</div>
            {item.size && (
              <div className="text-xs text-amber-600 font-medium mt-1">
                Size: {item.size}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'stock',
      header: 'Stock',
      render: (item: InventoryType) => (
        <div className="text-center">
          <div className="font-medium text-gray-900">{item.currentStock}</div>
          <div className="text-sm text-gray-500">Available: {item.availableStock}</div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: InventoryType) => (
        <div className="flex items-center space-x-2">
          {getStatusIcon(item.status)}
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
            {item.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      ),
    },
    {
      key: 'pricing',
      header: 'Pricing',
      render: (item: InventoryType) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900">${item.sellingPrice}</div>
          <div className="text-gray-500">Cost: ${item.costPrice}</div>
        </div>
      ),
    },
    {
      key: 'reorder',
      header: 'Reorder',
      render: (item: InventoryType) => (
        <div className="text-sm">
          <div className="text-gray-900">Point: {item.reorderPoint}</div>
          <div className="text-gray-500">Qty: {item.reorderQuantity}</div>
        </div>
      ),
    },
    {
      key: 'warehouse',
      header: 'Warehouse',
      render: (item: InventoryType) => (
        <span className="text-sm text-gray-600 capitalize">{item.warehouse}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: InventoryType) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleViewItem(item)}
            className="text-primary-600 hover:text-primary-900"
            title="View Details"
          >
            <EyeIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleEditItem(item)}
            className="text-indigo-600 hover:text-indigo-900"
            title="Edit"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteItem(item)}
            className="text-red-600 hover:text-red-900"
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
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600">Track stock levels and manage inventory</p>
        </div>
        <Button 
          onClick={handleAddItem}
          className="flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Stock</span>
        </Button>
      </div>

      {/* Success message */}
      {successMessage && (
        <div className="rounded-md bg-green-50 p-4 border border-green-200">
          <div className="flex">
            <div className="ml-0">
              <h3 className="text-sm font-medium text-green-800">{successMessage}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <ErrorMessage message={error} onRetry={() => setError(null)} />
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Stock</p>
                <p className="text-2xl font-bold text-gray-900">
                  {inventory.filter(item => item.status === 'in_stock').length}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-gray-900">
                  {inventory.filter(item => item.status === 'low_stock').length}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircleIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold text-gray-900">
                  {inventory.filter(item => item.status === 'out_of_stock').length}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <PlusIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-gray-900">{inventory.length}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search inventory..."
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Status:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field"
              >
                <option value="all">All</option>
                <option value="in_stock">In Stock</option>
                <option value="low_stock">Low Stock</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>
            <div className="text-sm text-gray-500">
              {filteredInventory.length} of {inventory.length} items
            </div>
          </div>
        </div>
      </Card>

      {/* Inventory Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table
            data={filteredInventory}
            columns={columns}
            emptyMessage="No inventory items found"
          />
        </div>
      </Card>

      {/* Inventory Form Modal */}
      {showForm && (
        <Modal
          isOpen={true}
          onClose={() => {
            setShowForm(false);
            setEditingItem(null);
            resetForm();
          }}
          title={editingItem ? 'Edit Inventory Item' : 'Add Inventory Item'}
        >
          <form onSubmit={editingItem ? handleUpdateItem : handleCreateItem} className="p-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.productName}
                    onChange={(e) => setFormData({...formData, productName: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    SKU *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({...formData, sku: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Product ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.productId}
                    onChange={(e) => setFormData({...formData, productId: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Product MongoDB ID"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Size
                  </label>
                  <input
                    type="text"
                    value={formData.size}
                    onChange={(e) => setFormData({...formData, size: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g., S, M, L, XL (optional)"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Leave empty if product has no size variations
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Current Stock *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.currentStock}
                    onChange={(e) => setFormData({...formData, currentStock: Number(e.target.value)})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Available Stock *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.availableStock}
                    onChange={(e) => setFormData({...formData, availableStock: Number(e.target.value)})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Cost Price *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.costPrice}
                    onChange={(e) => setFormData({...formData, costPrice: Number(e.target.value)})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Selling Price *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({...formData, sellingPrice: Number(e.target.value)})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Reorder Point
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.reorderPoint}
                    onChange={(e) => setFormData({...formData, reorderPoint: Number(e.target.value)})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Reorder Quantity
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.reorderQuantity}
                    onChange={(e) => setFormData({...formData, reorderQuantity: Number(e.target.value)})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Warehouse *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.warehouse}
                    onChange={(e) => setFormData({...formData, warehouse: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued'})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="in_stock">In Stock</option>
                    <option value="low_stock">Low Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingItem(null);
                  resetForm();
                }}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary"
              >
                {isSubmitting ? 'Saving...' : (editingItem ? 'Update Item' : 'Create Item')}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Inventory Details Modal */}
      {showDetails && selectedItem && (
        <Modal
          isOpen={true}
          onClose={() => setShowDetails(false)}
          title={`Inventory Details - ${selectedItem.productName}`}
        >
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Product Information</h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Product Name:</span> {selectedItem.productName}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">SKU:</span> {selectedItem.sku}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Warehouse:</span> {selectedItem.warehouse}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Status:</span> 
                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedItem.status)}`}>
                      {selectedItem.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Stock Information</h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Current Stock:</span> {selectedItem.currentStock}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Available Stock:</span> {selectedItem.availableStock}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Reorder Point:</span> {selectedItem.reorderPoint}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Reorder Quantity:</span> {selectedItem.reorderQuantity}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-2">Pricing Information</h4>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Cost Price:</span> ${selectedItem.costPrice}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Selling Price:</span> ${selectedItem.sellingPrice}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && itemToDelete && (
        <Modal
          isOpen={true}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Inventory Item"
        >
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete "{itemToDelete.productName}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className={`btn btn-danger ${isDeleting ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Inventory;
