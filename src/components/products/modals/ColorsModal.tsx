import React, { useState, useEffect } from 'react';
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import { Color } from '../../../services/masterDataService';
import { colorService } from '../../../services/masterDataService';

interface ColorSelection {
  colorId: string;
  imageUrl?: string;
}

interface ColorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  colors: ColorSelection[]; // Array of { colorId, imageUrl }
  onColorsChange: (colors: ColorSelection[]) => void;
}

const ColorsModal: React.FC<ColorsModalProps> = ({
  isOpen,
  onClose,
  colors,
  onColorsChange,
}) => {
  const [availableColors, setAvailableColors] = useState<Color[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  // We no longer upload per-product images for colors.

  useEffect(() => {
    if (isOpen) {
      fetchColors();
      // nothing else to init
    }
  }, [isOpen]);

  const fetchColors = async () => {
    try {
      setIsLoading(true);
      const response = await colorService.getAll();
      if (response.success && response.data) {
        setAvailableColors(response.data);
      }
    } catch (error) {
      console.error('Error fetching colors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleColor = (colorId: string) => {
    const existingColor = colors.find(c => c.colorId === colorId);
    if (existingColor) {
      onColorsChange(colors.filter(c => c.colorId !== colorId));
    } else {
      // attach the master color imageUrl for reference if present
      const master = availableColors.find(c => c._id === colorId);
      onColorsChange([...colors, { colorId, imageUrl: master?.imageUrl }]);
    }
  };
 

  const filteredColors = availableColors.filter(color =>
    color.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-6 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Select Product Colors</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Select colors from master data. Each color's swatch image (if any) comes from the color itself.
        </p>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Search colors..."
          />
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading colors...</p>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-md p-4">
            {filteredColors.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                {searchTerm ? 'No colors found matching your search' : 'No colors available'}
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredColors.map((color) => {
                  const isSelected = colors.some(c => c.colorId === color._id);
                  const colorImage = color.imageUrl;
                  
                  return (
                    <div
                      key={color._id}
                      className={`relative border-2 rounded-lg overflow-hidden transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleColor(color._id)}
                        className="w-full text-left"
                      >
                        {/* Color Image or Swatch */}
                        <div className="h-32 w-full relative">
                          {colorImage ? (
                            <img
                              src={colorImage}
                              alt={color.name}
                              className="w-full h-full object-cover"
                            />
                          ) : color.hexCode ? (
                            <div
                              className="w-full h-full"
                              style={{ backgroundColor: color.hexCode }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-400 text-sm">No image</span>
                            </div>
                          )}
                          {isSelected && (
                            <div className="absolute top-2 right-2">
                              <div className="bg-blue-500 rounded-full p-1">
                                <CheckIcon className="h-4 w-4 text-white" />
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Color Info */}
                        <div className="p-3">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900">{color.name}</span>
                          </div>
                          {color.hexCode && (
                            <p className="text-xs text-gray-500 mt-1">{color.hexCode}</p>
                          )}
                          {!colorImage && (
                            <p className="text-xs text-orange-600 mt-1">No swatch image</p>
                          )}
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* No per-product color image upload */}

        {/* Selected Count */}
        {colors.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>{colors.length}</strong> color{colors.length !== 1 ? 's' : ''} selected
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
      </div>
    </div>
  );
};

export default ColorsModal;
