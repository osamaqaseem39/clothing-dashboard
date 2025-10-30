import React, { useEffect, useState } from 'react';
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import { MasterDataItem } from '../../../services/masterDataService';
import { featureService } from '../../../services/masterDataService';
import QuickAddMasterDataModal from '../../master-data/QuickAddMasterDataModal';

interface FeaturesModalProps {
  isOpen: boolean;
  onClose: () => void;
  features: string[]; // we store feature names in product schema
  onFeaturesChange: (features: string[]) => void;
}

const FeaturesModal: React.FC<FeaturesModalProps> = ({
  isOpen,
  onClose,
  features,
  onFeaturesChange,
}) => {
  const [availableFeatures, setAvailableFeatures] = useState<MasterDataItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchFeatures();
    }
  }, [isOpen]);

  const fetchFeatures = async () => {
    try {
      setIsLoading(true);
      const response = await featureService.getAll();
      if (response.success && response.data) {
        setAvailableFeatures(response.data);
      }
    } catch (error) {
      console.error('Error fetching features:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFeature = (featureName: string) => {
    if (features.includes(featureName)) {
      onFeaturesChange(features.filter(name => name !== featureName));
    } else {
      onFeaturesChange([...(features || []), featureName]);
    }
  };

  const filteredFeatures = availableFeatures.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-6 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Select Product Features</h3>
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
          Choose features from master data to attach to this product.
        </p>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Search features..."
          />
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading features...</p>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-md p-4">
            {filteredFeatures.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                {searchTerm ? 'No features found matching your search' : 'No features available'}
              </p>
            ) : (
              <div className="space-y-2">
                {filteredFeatures.map((feature) => {
                  const isSelected = features.includes(feature.name);
                  return (
                    <button
                      key={feature._id}
                      type="button"
                      onClick={() => toggleFeature(feature.name)}
                      className={`w-full text-left px-4 py-3 rounded-md border-2 transition-colors ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{feature.name}</span>
                        {isSelected && (
                          <CheckIcon className="h-5 w-5 text-blue-500" />
                        )}
                      </div>
                      {feature.description && (
                        <p className="text-sm text-gray-500 mt-1">{feature.description}</p>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Selected Count */}
        {features && features.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>{features.length}</strong> feature{features.length !== 1 ? 's' : ''} selected
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
          title="Feature"
          service={featureService as any}
          onCreated={(created: any) => {
            setAvailableFeatures(prev => [...prev, created]);
            onFeaturesChange([...(features || []), created.name]);
          }}
        />
      </div>
    </div>
  );
};

export default FeaturesModal;
