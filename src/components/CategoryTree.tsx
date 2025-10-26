import React, { useState } from 'react';
import { ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { Category } from '../types';

interface CategoryTreeProps {
  categories: Category[];
  onCategorySelect?: (category: Category) => void;
  onCategoryEdit?: (category: Category) => void;
  onCategoryDelete?: (category: Category) => void;
  selectedCategoryId?: string;
  showActions?: boolean;
}

const CategoryTree: React.FC<CategoryTreeProps> = ({
  categories,
  onCategorySelect,
  onCategoryEdit,
  onCategoryDelete,
  selectedCategoryId,
  showActions = true,
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const toggleExpanded = (categoryId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedNodes(newExpanded);
  };

  const buildTree = (parentId?: string): Category[] => {
    return categories
      .filter(cat => cat.parentId === parentId)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  };

  const renderCategoryNode = (category: Category, level: number = 0) => {
    const children = buildTree(category._id);
    const hasChildren = children.length > 0;
    const isExpanded = expandedNodes.has(category._id);
    const isSelected = selectedCategoryId === category._id;

    return (
      <div key={category._id} className="select-none">
        <div
          className={`flex items-center py-2 px-3 rounded-md cursor-pointer hover:bg-gray-50 ${
            isSelected ? 'bg-primary-50 text-primary-700' : 'text-gray-700'
          }`}
          style={{ paddingLeft: `${level * 20 + 12}px` }}
          onClick={() => onCategorySelect?.(category)}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(category._id);
              }}
              className="mr-2 p-1 hover:bg-gray-200 rounded"
            >
              {isExpanded ? (
                <ChevronDownIcon className="h-4 w-4" />
              ) : (
                <ChevronRightIcon className="h-4 w-4" />
              )}
            </button>
          )}
          
          {!hasChildren && <div className="w-6 mr-2" />}

          <div className="flex items-center flex-1 min-w-0">
            {category.icon && (
              <span className="mr-2 text-lg">{category.icon}</span>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center">
                <span className="font-medium truncate">{category.name}</span>
                {!category.isActive && (
                  <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                    Inactive
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-500 truncate">
                /{category.slug}
                {category.productCount !== undefined && (
                  <span className="ml-2">({category.productCount} products)</span>
                )}
              </div>
            </div>
          </div>

          {showActions && (
            <div className="flex items-center space-x-1 ml-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCategoryEdit?.(category);
                }}
                className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                title="Edit category"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCategoryDelete?.(category);
                }}
                className="p-1 text-red-600 hover:bg-red-100 rounded"
                title="Delete category"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div>
            {children.map(child => renderCategoryNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const rootCategories = buildTree();

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Category Tree</h3>
        <p className="text-sm text-gray-500">Hierarchical view of all categories</p>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {rootCategories.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <p className="mt-2">No categories found</p>
          </div>
        ) : (
          <div className="p-2">
            {rootCategories.map(category => renderCategoryNode(category))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryTree;
