import React, { useState, useEffect } from 'react';
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import { Attribute } from '../../../types';
import { attributeService, sizeService, Size } from '../../../services/masterDataService';
import QuickAddMasterDataModal from '../../master-data/QuickAddMasterDataModal';

interface AttributesModalProps {
  isOpen: boolean;
  onClose: () => void;
  attributes: string[]; // Array of attribute IDs
  onAttributesChange: (attributes: string[]) => void;
}

const AttributesModal: React.FC<AttributesModalProps> = ({
  isOpen,
  onClose,
  attributes,
  onAttributesChange,
}) => {
  const [availableAttributes, setAvailableAttributes] = useState<Attribute[]>([]);
  const [availableSizes, setAvailableSizes] = useState<Size[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'attributes' | 'sizes'>('attributes');

  useEffect(() => {
    if (isOpen) {
      fetchAttributes();
    }
  }, [isOpen]);

  const fetchAttributes = async () => {
    try {
      setIsLoading(true);
      const [attrResponse, sizesResponse] = await Promise.all([
        attributeService.getAll(),
        sizeService.getAll(),
      ]);
      
      if (attrResponse.success && attrResponse.data) {
        setAvailableAttributes(attrResponse.data);
      }
      
      if (sizesResponse.success && sizesResponse.data) {
        setAvailableSizes(sizesResponse.data);
      }
    } catch (error) {
      console.error('Error fetching attributes/sizes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAttribute = (attributeId: string) => {
    if (attributes.includes(attributeId)) {
      onAttributesChange(attributes.filter(id => id !== attributeId));
    } else {
      onAttributesChange([...attributes, attributeId]);
    }
  };

  const filteredAttributes = availableAttributes.filter(attr =>
    attr.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredSizes = availableSizes.filter(size =>
    size.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-6 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Select Product Attributes</h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsQuickAddOpen(true)}
              className="text-sm px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Add New
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
          Select attributes from the database that describe this product. Attributes and sizes are stored in the database and can be reused across products.
        </p>

        {/* Tabs */}
        <div className="mb-4 border-b border-gray-200">
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setActiveTab('attributes')}
              className={`pb-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'attributes'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Attributes
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('sizes')}
              className={`pb-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'sizes'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Sizes
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={`Search ${activeTab}...`}
          />
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading {activeTab}...</p>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-md p-4">
            {activeTab === 'attributes' ? (
              filteredAttributes.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  {searchTerm ? 'No attributes found matching your search' : 'No attributes available'}
                </p>
              ) : (
                <div className="space-y-2">
                  {filteredAttributes.map((attribute) => {
                    const isSelected = attributes.includes(attribute._id);
                    return (
                      <button
                        key={attribute._id}
                        type="button"
                        onClick={() => toggleAttribute(attribute._id)}
                        className={`w-full text-left px-4 py-3 rounded-md border-2 transition-colors ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900">{attribute.name}</span>
                          {isSelected && (
                            <CheckIcon className="h-5 w-5 text-blue-500" />
                          )}
                        </div>
                        {attribute.description && (
                          <p className="text-sm text-gray-500 mt-1">{attribute.description}</p>
                        )}
                      </button>
                    );
                  })}
                </div>
              )
            ) : (
              filteredSizes.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  {searchTerm ? 'No sizes found matching your search' : 'No sizes available'}
                </p>
              ) : (
                <div className="space-y-2">
                  {filteredSizes.map((size) => {
                    const isSelected = attributes.includes(size._id);
                    return (
                      <button
                        key={size._id}
                        type="button"
                        onClick={() => toggleAttribute(size._id)}
                        className={`w-full text-left px-4 py-3 rounded-md border-2 transition-colors ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900">{size.name}</span>
                          {isSelected && (
                            <CheckIcon className="h-5 w-5 text-blue-500" />
                          )}
                        </div>
                        {size.description && (
                          <p className="text-sm text-gray-500 mt-1">{size.description}</p>
                        )}
                      </button>
                    );
                  })}
                </div>
              )
            )}
          </div>
        )}

        {/* Selected Count */}
        {attributes.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>{attributes.length}</strong> attribute{attributes.length !== 1 ? 's' : ''} selected
            </p>
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
        <QuickAddMasterDataModal
          isOpen={isQuickAddOpen}
          onClose={() => setIsQuickAddOpen(false)}
          title={activeTab === 'attributes' ? 'Attribute' : 'Size'}
          service={activeTab === 'attributes' ? attributeService as any : sizeService as any}
          onCreated={(created: any) => {
            if (activeTab === 'attributes') {
              setAvailableAttributes(prev => [...prev, created]);
            } else {
              setAvailableSizes(prev => [...prev, created]);
            }
            onAttributesChange([...attributes, created._id]);
          }}
        />
      </div>
    </div>
  );
};

export default AttributesModal;
