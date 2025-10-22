import React, { useState } from 'react';
import { XMarkIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { ProductFilters as ProductFiltersType } from '../../types';

interface ProductFiltersProps {
  filters: ProductFiltersType;
  onFiltersChange: (filters: ProductFiltersType) => void;
  onClose?: () => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFiltersChange,
  onClose,
}) => {
  const [localFilters, setLocalFilters] = useState<ProductFiltersType>(filters);

  const handleFilterChange = (key: keyof ProductFiltersType, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const handleArrayFilterChange = (key: keyof ProductFiltersType, value: string, checked: boolean) => {
    const currentValue = localFilters[key];
    const currentArray = Array.isArray(currentValue) ? currentValue as string[] : [];
    const newArray = checked 
      ? [...currentArray, value]
      : currentArray.filter(item => item !== value);
    
    handleFilterChange(key, newArray.length > 0 ? newArray : undefined);
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
    onClose?.();
  };

  const clearFilters = () => {
    const clearedFilters: ProductFiltersType = {
      search: localFilters.search,
      page: localFilters.page || 1,
      limit: localFilters.limit || 10,
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const filterOptions = {
    fabrics: ['Cotton', 'Silk', 'Lawn', 'Chiffon', 'Linen', 'Georgette', 'Organza', 'Velvet'],
    occasions: ['Formal', 'Casual', 'Wedding', 'Party', 'Office', 'Traditional', 'Festive'],
    seasons: ['Summer', 'Winter', 'Spring', 'Fall', 'All Season'],
    colorFamilies: ['Pastels', 'Brights', 'Neutrals', 'Dark', 'Earthy', 'Jewel Tones'],
    patterns: ['Solid', 'Floral', 'Geometric', 'Abstract', 'Striped', 'Polka Dot', 'Embroidered'],
    sleeveLengths: ['Sleeveless', 'Short', '3/4', 'Long', 'Full'],
    necklines: ['Round', 'V-neck', 'Boat', 'High', 'Off-shoulder', 'Halter', 'Sweetheart'],
    lengths: ['Short', 'Medium', 'Long', 'Floor Length', 'Ankle Length'],
    fits: ['Loose', 'Fitted', 'Semi-fitted', 'Oversized', 'A-line', 'Straight'],
    ageGroups: ['Young Adult', 'Adult', 'Mature'],
    bodyTypes: ['Apple', 'Pear', 'Hourglass', 'Rectangle', 'Inverted Triangle', 'Diamond'],
    handwork: ['Embroidery', 'Zari', 'Sequins', 'Beadwork', 'Applique', 'Cutwork', 'Mirror Work'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '6', '8', '10', '12', '14', '16', '18', '20'],
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-4 mx-auto p-6 border w-full max-w-6xl shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Filter Products</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Fabric */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Fabric</h3>
              <div className="grid grid-cols-2 gap-2">
                {filterOptions.fabrics.map((fabric) => (
                  <label key={fabric} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={(localFilters.fabrics || []).includes(fabric)}
                      onChange={(e) => handleArrayFilterChange('fabrics', fabric, e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{fabric}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Occasion */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Occasion</h3>
              <div className="grid grid-cols-2 gap-2">
                {filterOptions.occasions.map((occasion) => (
                  <label key={occasion} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={(localFilters.occasions || []).includes(occasion)}
                      onChange={(e) => handleArrayFilterChange('occasions', occasion, e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{occasion}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Season */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Season</h3>
              <div className="grid grid-cols-2 gap-2">
                {filterOptions.seasons.map((season) => (
                  <label key={season} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={(localFilters.seasons || []).includes(season)}
                      onChange={(e) => handleArrayFilterChange('seasons', season, e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{season}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Color Family */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Color Family</h3>
              <div className="grid grid-cols-2 gap-2">
                {filterOptions.colorFamilies.map((color) => (
                  <label key={color} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={(localFilters.colorFamilies || []).includes(color)}
                      onChange={(e) => handleArrayFilterChange('colorFamilies', color, e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{color}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Pattern */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Pattern</h3>
              <div className="grid grid-cols-2 gap-2">
                {filterOptions.patterns.map((pattern) => (
                  <label key={pattern} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={(localFilters.patterns || []).includes(pattern)}
                      onChange={(e) => handleArrayFilterChange('patterns', pattern, e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{pattern}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Sleeve Length */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Sleeve Length</h3>
              <div className="grid grid-cols-2 gap-2">
                {filterOptions.sleeveLengths.map((length) => (
                  <label key={length} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={(localFilters.sleeveLengths || []).includes(length)}
                      onChange={(e) => handleArrayFilterChange('sleeveLengths', length, e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{length}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Neckline */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Neckline</h3>
              <div className="grid grid-cols-2 gap-2">
                {filterOptions.necklines.map((neckline) => (
                  <label key={neckline} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={(localFilters.necklines || []).includes(neckline)}
                      onChange={(e) => handleArrayFilterChange('necklines', neckline, e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{neckline}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Length */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Garment Length</h3>
              <div className="grid grid-cols-2 gap-2">
                {filterOptions.lengths.map((length) => (
                  <label key={length} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={(localFilters.lengths || []).includes(length)}
                      onChange={(e) => handleArrayFilterChange('lengths', length, e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{length}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Fit */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Fit</h3>
              <div className="grid grid-cols-2 gap-2">
                {filterOptions.fits.map((fit) => (
                  <label key={fit} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={(localFilters.fits || []).includes(fit)}
                      onChange={(e) => handleArrayFilterChange('fits', fit, e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{fit}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Age Group */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Age Group</h3>
              <div className="grid grid-cols-2 gap-2">
                {filterOptions.ageGroups.map((age) => (
                  <label key={age} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={(localFilters.ageGroups || []).includes(age)}
                      onChange={(e) => handleArrayFilterChange('ageGroups', age, e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{age}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Body Type */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Body Type</h3>
              <div className="grid grid-cols-2 gap-2">
                {filterOptions.bodyTypes.map((bodyType) => (
                  <label key={bodyType} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={(localFilters.bodyTypes || []).includes(bodyType)}
                      onChange={(e) => handleArrayFilterChange('bodyTypes', bodyType, e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{bodyType}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Handwork */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Handwork</h3>
              <div className="grid grid-cols-2 gap-2">
                {filterOptions.handwork.map((work) => (
                  <label key={work} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={(localFilters.handwork || []).includes(work)}
                      onChange={(e) => handleArrayFilterChange('handwork', work, e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{work}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Available Sizes</h3>
              <div className="grid grid-cols-4 gap-2">
                {filterOptions.sizes.map((size) => (
                  <label key={size} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={(localFilters.sizes || []).includes(size)}
                      onChange={(e) => handleArrayFilterChange('sizes', size, e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{size}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Special Features */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Special Features</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={localFilters.isLimitedEdition || false}
                    onChange={(e) => handleFilterChange('isLimitedEdition', e.target.checked || undefined)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Limited Edition</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={localFilters.isCustomMade || false}
                    onChange={(e) => handleFilterChange('isCustomMade', e.target.checked || undefined)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Custom Made</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-6 border-t mt-8">
          <button
            onClick={clearFilters}
            className="btn btn-secondary"
          >
            Clear All
          </button>
          <button
            onClick={applyFilters}
            className="btn btn-primary"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;