import React, { useState } from 'react';
import { XMarkIcon, PlusIcon } from '@heroicons/react/outline';

interface ArrayFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  items: string[];
  onItemsChange: (items: string[]) => void;
  placeholder: string;
  description?: string;
  color?: 'blue' | 'green' | 'purple' | 'red' | 'yellow' | 'indigo';
}

const colorClasses = {
  blue: 'bg-blue-100 text-blue-800',
  green: 'bg-green-100 text-green-800',
  purple: 'bg-purple-100 text-purple-800',
  red: 'bg-red-100 text-red-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  indigo: 'bg-indigo-100 text-indigo-800',
};

const ArrayFieldModal: React.FC<ArrayFieldModalProps> = ({
  isOpen,
  onClose,
  title,
  items,
  onItemsChange,
  placeholder,
  description,
  color = 'blue',
}) => {
  const [newItem, setNewItem] = useState('');

  const addItem = () => {
    if (newItem.trim() && !items.includes(newItem.trim())) {
      onItemsChange([...items, newItem.trim()]);
      setNewItem('');
    }
  };

  const removeItem = (itemToRemove: string) => {
    onItemsChange(items.filter(item => item !== itemToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addItem();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-6 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {description && (
          <p className="text-sm text-gray-600 mb-4">{description}</p>
        )}

        <div className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyPress={handleKeyPress}
              className="input-field flex-1"
              placeholder={placeholder}
            />
            <button
              type="button"
              onClick={addItem}
              className="btn btn-primary"
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="max-h-60 overflow-y-auto">
          <div className="flex flex-wrap gap-2">
            {items.map((item, index) => (
              <span
                key={index}
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colorClasses[color]}`}
              >
                {item}
                <button
                  type="button"
                  onClick={() => removeItem(item)}
                  className="ml-1 hover:opacity-75"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArrayFieldModal;
