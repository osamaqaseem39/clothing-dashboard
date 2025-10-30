import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface MasterDataServiceType<T> {
  create: (data: Partial<T>) => Promise<{ success: boolean; data?: T; message?: string }>; 
}

interface QuickAddMasterDataModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  service: MasterDataServiceType<T>;
  onCreated: (created: T) => void;
  showDescription?: boolean;
}

function QuickAddMasterDataModal<T>({
  isOpen,
  onClose,
  title,
  service,
  onCreated,
  showDescription = true,
}: QuickAddMasterDataModalProps<T>) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    try {
      setIsSaving(true);
      setError(null);
      const payload: any = { name: name.trim(), isActive };
      if (showDescription && description.trim()) payload.description = description.trim();
      const res = await service.create(payload);
      if (res.success && res.data) {
        onCreated(res.data);
        onClose();
      } else {
        setError(res.message || 'Failed to create');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to create');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-6 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Add New {title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`Enter ${title.toLowerCase()} name`}
            />
          </div>

          {showDescription && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Describe the ${title.toLowerCase()} (optional)`}
              />
            </div>
          )}

          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Active</span>
          </label>

          <div className="flex justify-end space-x-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-md">
              Cancel
            </button>
            <button type="submit" disabled={isSaving} className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md disabled:opacity-50">
              {isSaving ? 'Saving...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default QuickAddMasterDataModal;


