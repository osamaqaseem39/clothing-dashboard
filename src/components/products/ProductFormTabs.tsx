import React from 'react';

interface Tab {
  id: string;
  name: string;
  icon: string;
}

interface ProductFormTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const ProductFormTabs: React.FC<ProductFormTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="bg-white shadow-sm rounded-lg p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Product Settings</h3>
      <nav className="space-y-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <span className="mr-3 text-lg">{tab.icon}</span>
            {tab.name}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default ProductFormTabs;
