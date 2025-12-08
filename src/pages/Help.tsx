import React, { useState } from 'react';
import {
  QuestionMarkCircleIcon,
  DocumentTextIcon,
  CubeIcon,
  TagIcon,
  UserGroupIcon,
  TruckIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  InformationCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

const Help: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['getting-started']));

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const isExpanded = (section: string) => expandedSections.has(section);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center gap-3">
          <QuestionMarkCircleIcon className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Help & Documentation</h1>
            <p className="text-gray-600 mt-1">
              Comprehensive guide to using the e-commerce dashboard
            </p>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <a
          href="#getting-started"
          className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
        >
          <DocumentTextIcon className="h-6 w-6 text-blue-600 mb-2" />
          <h3 className="font-semibold text-gray-900">Getting Started</h3>
          <p className="text-sm text-gray-600 mt-1">Learn the basics</p>
        </a>
        <a
          href="#products"
          className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
        >
          <CubeIcon className="h-6 w-6 text-green-600 mb-2" />
          <h3 className="font-semibold text-gray-900">Products</h3>
          <p className="text-sm text-gray-600 mt-1">Manage your inventory</p>
        </a>
        <a
          href="#orders"
          className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
        >
          <TruckIcon className="h-6 w-6 text-purple-600 mb-2" />
          <h3 className="font-semibold text-gray-900">Orders</h3>
          <p className="text-sm text-gray-600 mt-1">Process customer orders</p>
        </a>
        <a
          href="#forms"
          className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
        >
          <InformationCircleIcon className="h-6 w-6 text-orange-600 mb-2" />
          <h3 className="font-semibold text-gray-900">Form Fields</h3>
          <p className="text-sm text-gray-600 mt-1">Understand form fields</p>
        </a>
      </div>

      {/* Getting Started Section */}
      <div id="getting-started" className="bg-white shadow-sm rounded-lg">
        <button
          onClick={() => toggleSection('getting-started')}
          className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <DocumentTextIcon className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Getting Started</h2>
          </div>
          {isExpanded('getting-started') ? (
            <ChevronDownIcon className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronRightIcon className="h-5 w-5 text-gray-500" />
          )}
        </button>
        {isExpanded('getting-started') && (
          <div className="px-6 pb-6 space-y-4 border-t border-gray-200">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Welcome to the Dashboard</h3>
              <p className="text-gray-600">
                This dashboard helps you manage your e-commerce store efficiently. You can add products,
                manage inventory, process orders, and track customer information all from one place.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Navigation</h3>
              <p className="text-gray-600 mb-2">
                Use the sidebar on the left to navigate between different sections:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                <li><strong>Dashboard:</strong> Overview of your store's key metrics</li>
                <li><strong>Products:</strong> Manage your product catalog</li>
                <li><strong>Categories:</strong> Organize products into categories</li>
                <li><strong>Inventory:</strong> Track stock levels and manage inventory</li>
                <li><strong>Orders:</strong> View and process customer orders</li>
                <li><strong>Customers:</strong> Manage customer information</li>
                <li><strong>Brands:</strong> Manage product brands</li>
                <li><strong>Analytics:</strong> View sales and performance data</li>
                <li><strong>Settings:</strong> Configure store settings</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Info Icons</h3>
              <p className="text-gray-600">
                Throughout the dashboard, you'll see <InformationCircleIcon className="h-4 w-4 inline text-gray-400" /> icons
                next to form fields. Hover over or click these icons to see helpful explanations about each field.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Products Section */}
      <div id="products" className="bg-white shadow-sm rounded-lg">
        <button
          onClick={() => toggleSection('products')}
          className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <CubeIcon className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">Products</h2>
          </div>
          {isExpanded('products') ? (
            <ChevronDownIcon className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronRightIcon className="h-5 w-5 text-gray-500" />
          )}
        </button>
        {isExpanded('products') && (
          <div className="px-6 pb-6 space-y-4 border-t border-gray-200">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Adding a New Product</h3>
              <ol className="list-decimal list-inside text-gray-600 space-y-2 ml-4">
                <li>Navigate to <strong>Products</strong> from the sidebar</li>
                <li>Click the <strong>"Add New Product"</strong> button</li>
                <li>Fill in the required fields in the form tabs:
                  <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                    <li><strong>Basic Information:</strong> Name, description, category, brand, etc.</li>
                    <li><strong>Clothing Properties:</strong> Fabric, occasion, season, designer, etc.</li>
                    <li><strong>Measurements:</strong> Available sizes, size chart</li>
                    <li><strong>Features & Details:</strong> Features, colors, attributes, special options</li>
                    <li><strong>Images:</strong> Upload product images</li>
                    <li><strong>SEO:</strong> Search engine optimization settings</li>
                  </ul>
                </li>
                <li>Click <strong>"Create Product"</strong> to save</li>
              </ol>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Product Variants</h3>
              <p className="text-gray-600 mb-2">
                Products can have multiple variants (e.g., different sizes, colors). Each variant can have:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                <li>Unique SKU (Stock Keeping Unit)</li>
                <li>Different pricing (price, compare price, cost price)</li>
                <li>Individual stock quantities</li>
                <li>Variant-specific images</li>
                <li>Weight and dimensions</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Product Status</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                <li><strong>Draft:</strong> Product is saved but not visible to customers</li>
                <li><strong>Published:</strong> Product is live and visible on the store</li>
                <li><strong>Archived:</strong> Product is hidden but kept for records</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Product Types</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                <li><strong>Simple Product:</strong> Standard product with fixed price</li>
                <li><strong>Variable Product:</strong> Product with multiple variants (sizes, colors)</li>
                <li><strong>Grouped Product:</strong> Collection of related products</li>
                <li><strong>External Product:</strong> Product sold on another website</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Form Fields Section */}
      <div id="forms" className="bg-white shadow-sm rounded-lg">
        <button
          onClick={() => toggleSection('forms')}
          className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <InformationCircleIcon className="h-6 w-6 text-orange-600" />
            <h2 className="text-xl font-semibold text-gray-900">Understanding Form Fields</h2>
          </div>
          {isExpanded('forms') ? (
            <ChevronDownIcon className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronRightIcon className="h-5 w-5 text-gray-500" />
          )}
        </button>
        {isExpanded('forms') && (
          <div className="px-6 pb-6 space-y-4 border-t border-gray-200">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Basic Information Fields</h3>
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded">
                  <h4 className="font-medium text-gray-900 mb-1">Product Name *</h4>
                  <p className="text-sm text-gray-600">
                    Enter a clear, descriptive product name. This will be displayed to customers and used for SEO.
                    Minimum 3 characters required.
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <h4 className="font-medium text-gray-900 mb-1">Slug *</h4>
                  <p className="text-sm text-gray-600">
                    URL-friendly version of the product name. Used in the product URL (e.g., /products/product-slug).
                    Auto-generated from product name if left empty. Use lowercase letters, numbers, and hyphens only.
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <h4 className="font-medium text-gray-900 mb-1">SKU *</h4>
                  <p className="text-sm text-gray-600">
                    Stock Keeping Unit - unique identifier for inventory tracking. Use letters, numbers, dashes,
                    underscores, and dots only.
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <h4 className="font-medium text-gray-900 mb-1">Description *</h4>
                  <p className="text-sm text-gray-600">
                    Detailed product description. Include key features, materials, care instructions, and any
                    important details customers should know. Minimum 20 characters required.
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <h4 className="font-medium text-gray-900 mb-1">Short Description</h4>
                  <p className="text-sm text-gray-600">
                    Brief summary (max 200 characters) used in product cards, search results, and meta descriptions.
                    Should be concise and compelling.
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <h4 className="font-medium text-gray-900 mb-1">Category *</h4>
                  <p className="text-sm text-gray-600">
                    Select the main category for this product. Categories help organize products and improve navigation.
                    Products can appear in category listings and search results.
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <h4 className="font-medium text-gray-900 mb-1">Brand</h4>
                  <p className="text-sm text-gray-600">
                    Optional: Select the brand or manufacturer. Brands help customers filter and find products.
                    Useful for brand-aware shoppers.
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Variant Fields</h3>
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded">
                  <h4 className="font-medium text-gray-900 mb-1">Price *</h4>
                  <p className="text-sm text-gray-600">
                    Selling price for this variant. Must be greater than 0. This is the price customers will pay.
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <h4 className="font-medium text-gray-900 mb-1">Compare Price</h4>
                  <p className="text-sm text-gray-600">
                    Original or MSRP price. If set, will be shown crossed out next to the selling price to show savings.
                    Used for displaying discounts.
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <h4 className="font-medium text-gray-900 mb-1">Cost Price</h4>
                  <p className="text-sm text-gray-600">
                    Internal cost price for profit margin calculations. Not visible to customers. Used for inventory
                    and financial reporting.
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Clothing Properties</h3>
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded">
                  <h4 className="font-medium text-gray-900 mb-1">Fabric Type</h4>
                  <p className="text-sm text-gray-600">
                    Select the primary fabric or material used in this clothing item (e.g., Cotton, Silk, Linen).
                    Helps customers understand product quality and care requirements.
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <h4 className="font-medium text-gray-900 mb-1">Occasion</h4>
                  <p className="text-sm text-gray-600">
                    Select the occasion this clothing is suitable for (e.g., Casual, Formal, Wedding, Party).
                    Helps customers find appropriate clothing for their needs.
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <h4 className="font-medium text-gray-900 mb-1">Season</h4>
                  <p className="text-sm text-gray-600">
                    Select the season this clothing is designed for (e.g., Spring, Summer, Fall, Winter).
                    Helps with seasonal collections and recommendations.
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <h4 className="font-medium text-gray-900 mb-1">Collection</h4>
                  <p className="text-sm text-gray-600">
                    Optional collection name (e.g., 'Summer 2024', 'Eid Collection'). Used to group related products
                    for marketing and display purposes.
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">SEO Fields</h3>
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded">
                  <h4 className="font-medium text-gray-900 mb-1">SEO Title</h4>
                  <p className="text-sm text-gray-600">
                    Title shown in search engine results. Keep it 50-60 characters for optimal display. Should include
                    important keywords and be compelling. Defaults to product name if empty.
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <h4 className="font-medium text-gray-900 mb-1">Meta Description</h4>
                  <p className="text-sm text-gray-600">
                    Description shown in search engine results (150-160 characters recommended). Should be compelling
                    and include key product benefits. Defaults to short description if empty.
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <h4 className="font-medium text-gray-900 mb-1">Keywords</h4>
                  <p className="text-sm text-gray-600">
                    Relevant search keywords for this product. Used for SEO and internal search. Add keywords that
                    customers might use to find this product.
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <h4 className="font-medium text-gray-900 mb-1">Canonical URL</h4>
                  <p className="text-sm text-gray-600">
                    Preferred URL for this product page. Used to prevent duplicate content issues. Should be a full URL
                    starting with http:// or https://. Leave empty to use default product URL.
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <h4 className="font-medium text-gray-900 mb-1">Open Graph Image</h4>
                  <p className="text-sm text-gray-600">
                    Image shown when this product is shared on social media (Facebook, Twitter, etc.).
                    Recommended size: 1200x630px. If not set, uses the first product image.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Orders Section */}
      <div id="orders" className="bg-white shadow-sm rounded-lg">
        <button
          onClick={() => toggleSection('orders')}
          className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <TruckIcon className="h-6 w-6 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900">Orders</h2>
          </div>
          {isExpanded('orders') ? (
            <ChevronDownIcon className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronRightIcon className="h-5 w-5 text-gray-500" />
          )}
        </button>
        {isExpanded('orders') && (
          <div className="px-6 pb-6 space-y-4 border-t border-gray-200">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Viewing Orders</h3>
              <p className="text-gray-600">
                Navigate to <strong>Orders</strong> from the sidebar to view all customer orders. You can see order
                details, customer information, items ordered, and order status.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Order Status</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                <li><strong>Pending:</strong> Order is placed but not yet processed</li>
                <li><strong>Processing:</strong> Order is being prepared</li>
                <li><strong>Shipped:</strong> Order has been shipped to customer</li>
                <li><strong>Delivered:</strong> Order has been delivered</li>
                <li><strong>Cancelled:</strong> Order has been cancelled</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Categories Section */}
      <div id="categories" className="bg-white shadow-sm rounded-lg">
        <button
          onClick={() => toggleSection('categories')}
          className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <TagIcon className="h-6 w-6 text-indigo-600" />
            <h2 className="text-xl font-semibold text-gray-900">Categories & Master Data</h2>
          </div>
          {isExpanded('categories') ? (
            <ChevronDownIcon className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronRightIcon className="h-5 w-5 text-gray-500" />
          )}
        </button>
        {isExpanded('categories') && (
          <div className="px-6 pb-6 space-y-4 border-t border-gray-200">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Categories</h3>
              <p className="text-gray-600 mb-2">
                Categories help organize your products. Create categories to group related products together.
                Products can belong to one main category.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Master Data</h3>
              <p className="text-gray-600 mb-2">
                Master data includes predefined options that can be used across products:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                <li><strong>Colors:</strong> Available product colors</li>
                <li><strong>Materials/Fabrics:</strong> Fabric types (Cotton, Silk, etc.)</li>
                <li><strong>Occasions:</strong> When the clothing is suitable (Casual, Formal, etc.)</li>
                <li><strong>Seasons:</strong> Seasonal categories (Spring, Summer, etc.)</li>
                <li><strong>Sizes:</strong> Available sizes (S, M, L, XL, etc.)</li>
                <li><strong>Patterns:</strong> Design patterns</li>
                <li><strong>Sleeve Lengths:</strong> Sleeve length options</li>
                <li><strong>Color Families:</strong> Color groupings</li>
              </ul>
              <p className="text-gray-600 mt-2">
                You can add new master data items from the respective pages, or use the quick-add buttons
                when creating products.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Inventory Section */}
      <div id="inventory" className="bg-white shadow-sm rounded-lg">
        <button
          onClick={() => toggleSection('inventory')}
          className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <CubeIcon className="h-6 w-6 text-yellow-600" />
            <h2 className="text-xl font-semibold text-gray-900">Inventory Management</h2>
          </div>
          {isExpanded('inventory') ? (
            <ChevronDownIcon className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronRightIcon className="h-5 w-5 text-gray-500" />
          )}
        </button>
        {isExpanded('inventory') && (
          <div className="px-6 pb-6 space-y-4 border-t border-gray-200">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Stock Management</h3>
              <p className="text-gray-600">
                Track stock levels for each product variant. Set stock quantities when creating or editing products.
                The inventory page provides an overview of all stock levels and alerts for low stock items.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Stock Status</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                <li><strong>In Stock:</strong> Product is available for purchase</li>
                <li><strong>Out of Stock:</strong> Product is currently unavailable</li>
                <li><strong>Backorder:</strong> Product can be ordered but will ship later</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Tips & Best Practices */}
      <div id="tips" className="bg-white shadow-sm rounded-lg">
        <button
          onClick={() => toggleSection('tips')}
          className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <ChartBarIcon className="h-6 w-6 text-teal-600" />
            <h2 className="text-xl font-semibold text-gray-900">Tips & Best Practices</h2>
          </div>
          {isExpanded('tips') ? (
            <ChevronDownIcon className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronRightIcon className="h-5 w-5 text-gray-500" />
          )}
        </button>
        {isExpanded('tips') && (
          <div className="px-6 pb-6 space-y-4 border-t border-gray-200">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Product Images</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                <li>Upload high-quality images (recommended: 1000x1000px or larger)</li>
                <li>Use the first image as the main product image</li>
                <li>Show products from multiple angles</li>
                <li>Include lifestyle images when possible</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">SEO Optimization</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                <li>Use descriptive, keyword-rich product names</li>
                <li>Write compelling meta descriptions (150-160 characters)</li>
                <li>Include relevant keywords naturally</li>
                <li>Use hyphens in URLs for better readability</li>
                <li>Optimize images with descriptive alt text</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Product Descriptions</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                <li>Be detailed and specific about materials and features</li>
                <li>Include care instructions</li>
                <li>Mention sizing information</li>
                <li>Highlight unique selling points</li>
                <li>Use bullet points for easy scanning</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Inventory Management</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                <li>Keep stock levels updated regularly</li>
                <li>Set up low stock alerts</li>
                <li>Use accurate SKUs for tracking</li>
                <li>Update stock after each sale</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Support Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-2">Need More Help?</h3>
        <p className="text-gray-600 mb-4">
          If you have questions or need assistance, please refer to the info icons throughout the dashboard
          or contact your system administrator.
        </p>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <InformationCircleIcon className="h-5 w-5 text-blue-600" />
          <span>
            Remember: Hover over or click the <InformationCircleIcon className="h-4 w-4 inline text-gray-400" /> icon
            next to any form field for detailed explanations.
          </span>
        </div>
      </div>
    </div>
  );
};

export default Help;

