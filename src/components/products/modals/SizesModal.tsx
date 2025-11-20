import React, { useState, useEffect } from 'react';
import { XMarkIcon, CheckIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { sizeService, Size } from '../../../services/masterDataService';

interface SizesModalProps {
  isOpen: boolean;
  onClose: () => void;
  sizes: string[]; // Array of size IDs
  onSizesChange: (sizes: string[]) => void;
}

const SIZE_UNITS = [
  { value: 'none', label: 'None' },
  { value: 'cm', label: 'Centimeters (cm)' },
  { value: 'inch', label: 'Inches (inch)' },
  { value: 'US', label: 'US Size' },
  { value: 'UK', label: 'UK Size' },
  { value: 'EU', label: 'EU Size' },
];

const SizesModal: React.FC<SizesModalProps> = ({
  isOpen,
  onClose,
  sizes,
  onSizesChange,
}) => {
  const [availableSizes, setAvailableSizes] = useState<Size[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [sizeMap, setSizeMap] = useState<Record<string, Size>>({});
  const [newSizeName, setNewSizeName] = useState('');
  const [newSizeDescription, setNewSizeDescription] = useState('');
  const [newSizeUnit, setNewSizeUnit] = useState<'cm' | 'inch' | 'US' | 'UK' | 'EU' | 'none'>('none');
  const [newSizeType, setNewSizeType] = useState<'numeric' | 'alphabetic' | 'custom'>('numeric');
  const [isSaving, setIsSaving] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchSizes();
    }
  }, [isOpen]);

  const fetchSizes = async () => {
    try {
      setIsLoading(true);
      const response = await sizeService.getAll();
      
      if (response.success && response.data) {
        setAvailableSizes(response.data);
        // Create a map for quick lookup
        const map: Record<string, Size> = {};
        response.data.forEach((size: Size) => {
          map[size._id] = size;
        });
        setSizeMap(map);
      }
    } catch (error) {
      console.error('Error fetching sizes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSize = (sizeId: string) => {
    if (sizes.includes(sizeId)) {
      onSizesChange(sizes.filter(id => id !== sizeId));
    } else {
      onSizesChange([...sizes, sizeId]);
    }
  };

  const removeSize = (sizeId: string) => {
    onSizesChange(sizes.filter(id => id !== sizeId));
  };

  const handleAddNewSize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSizeName.trim()) {
      setAddError('Size name is required');
      return;
    }
    try {
      setIsSaving(true);
      setAddError(null);
      const response = await sizeService.create({
        name: newSizeName.trim(),
        description: newSizeDescription.trim() || undefined,
        unit: newSizeUnit,
        sizeType: newSizeType,
        isActive: true,
      });
      if (response.success && response.data) {
        const newSize = response.data;
        setAvailableSizes(prev => [...prev, newSize]);
        setSizeMap(prev => ({ ...prev, [newSize._id]: newSize }));
        onSizesChange([...sizes, newSize._id]);
        setNewSizeName('');
        setNewSizeDescription('');
        setNewSizeUnit('none');
        setNewSizeType('numeric');
        setIsQuickAddOpen(false);
      } else {
        setAddError(response.message || 'Failed to create size');
      }
    } catch (error: any) {
      setAddError(error?.message || 'Failed to create size');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredSizes = availableSizes.filter(size =>
    size.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-6 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Select Available Sizes</h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsQuickAddOpen(true)}
              className="text-sm px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-1"
            >
              <PlusIcon className="h-4 w-4" />
              Add New Size
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Select sizes from the database to avoid duplication. Sizes are stored in the database and can be reused across products.
        </p>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Search sizes..."
          />
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading sizes...</p>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-md p-4">
            {filteredSizes.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                {searchTerm ? 'No sizes found matching your search' : 'No sizes available'}
              </p>
            ) : (
              <div className="space-y-2">
                {filteredSizes.map((size) => {
                  const isSelected = sizes.includes(size._id);
                  return (
                    <button
                      key={size._id}
                      type="button"
                      onClick={() => toggleSize(size._id)}
                      className={`w-full text-left px-4 py-3 rounded-md border-2 transition-colors ${
                        isSelected
                          ? 'border-yellow-500 bg-yellow-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{size.name}</span>
                        {isSelected && (
                          <CheckIcon className="h-5 w-5 text-yellow-600" />
                        )}
                      </div>
                      {size.description && (
                        <p className="text-sm text-gray-500 mt-1">{size.description}</p>
                      )}
                      <div className="flex gap-2 mt-1">
                        {size.sizeType && (
                          <span className="inline-block text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                            {size.sizeType}
                          </span>
                        )}
                        {size.unit && size.unit !== 'none' && (
                          <span className="inline-block text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-600">
                            {size.unit}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Selected Sizes */}
        {sizes.length > 0 && (
          <div className="mt-4 p-3 bg-yellow-50 rounded-md">
            <p className="text-sm font-medium text-yellow-900 mb-2">
              Selected Sizes ({sizes.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {sizes.map((sizeId) => {
                const size = sizeMap[sizeId];
                if (!size) return null;
                return (
                  <div
                    key={sizeId}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200"
                  >
                    <span>
                      {size.name}
                      {size.unit && size.unit !== 'none' && (
                        <span className="text-xs text-yellow-600 ml-1">({size.unit})</span>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeSize(sizeId)}
                      className="ml-1 text-yellow-600 hover:text-yellow-800"
                      title="Remove size"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="btn btn-secondary"
          >
            Done
          </button>
        </div>
        {/* Custom Add Size Modal */}
        {isQuickAddOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-[60]">
            <div className="relative top-20 mx-auto p-6 border w-full max-w-md shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Add New Size</h3>
                <button 
                  onClick={() => {
                    setIsQuickAddOpen(false);
                    setAddError(null);
                    setNewSizeName('');
                    setNewSizeDescription('');
                    setNewSizeUnit('none');
                    setNewSizeType('numeric');
                  }} 
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {addError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
                  <p className="text-sm text-red-700">{addError}</p>
                </div>
              )}

              <form onSubmit={handleAddNewSize} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Size Name *</label>
                  <input
                    type="text"
                    value={newSizeName}
                    onChange={(e) => setNewSizeName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Small, Medium, Large, 10, 12, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit *</label>
                  <select
                    value={newSizeUnit}
                    onChange={(e) => setNewSizeUnit(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {SIZE_UNITS.map(unit => (
                      <option key={unit.value} value={unit.value}>
                        {unit.label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    Select a standard unit to ensure consistency across products
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Size Type</label>
                  <select
                    value={newSizeType}
                    onChange={(e) => setNewSizeType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="numeric">Numeric</option>
                    <option value="alphabetic">Alphabetic</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newSizeDescription}
                    onChange={(e) => setNewSizeDescription(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Optional description"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => {
                      setIsQuickAddOpen(false);
                      setAddError(null);
                      setNewSizeName('');
                      setNewSizeDescription('');
                      setNewSizeUnit('none');
                      setNewSizeType('numeric');
                    }} 
                    className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-md"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSaving} 
                    className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Create Size'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SizesModal;
