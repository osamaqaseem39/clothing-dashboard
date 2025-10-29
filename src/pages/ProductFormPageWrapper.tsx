import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { brandService } from '../services/brandService';
import { Product, Category, Brand } from '../types';
import ProductFormPage from './ProductFormPage';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';

const ProductFormPageWrapper: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch categories and brands
      const [categoriesResponse, brandsResponse] = await Promise.all([
        categoryService.getCategories(),
        brandService.getBrands(),
      ]);

      if (categoriesResponse.success && categoriesResponse.data) {
        setCategories(categoriesResponse.data);
      }

      if (brandsResponse.success && brandsResponse.data) {
        setBrands(brandsResponse.data);
      }

      // Fetch product if editing
      if (isEditing && id) {
        const productResponse = await productService.getProduct(id);
        if (productResponse.success && productResponse.data) {
          setProduct(productResponse.data);
        } else {
          setError('Product not found');
        }
      }
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (productData: Partial<Product>) => {
    try {
      let response;
      if (isEditing && id) {
        response = await productService.updateProduct(id, productData);
      } else {
        response = await productService.createProduct(productData);
      }

      if (response.success) {
        navigate('/products');
      } else {
        throw new Error(response.message || 'Failed to save product');
      }
    } catch (err: any) {
      console.error('Error saving product:', err);
      throw err;
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      const response = await productService.deleteProduct(productId);
      if (response.success) {
        navigate('/products');
      } else {
        throw new Error(response.message || 'Failed to delete product');
      }
    } catch (err: any) {
      console.error('Error deleting product:', err);
      throw err;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <ProductFormPage
      product={product || undefined}
      categories={categories}
      brands={brands}
      onSubmit={handleSubmit}
      onDelete={isEditing ? handleDelete : undefined}
      isLoading={false}
    />
  );
};

export default ProductFormPageWrapper;
