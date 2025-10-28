import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CategoryForm from '../components/products/CategoryForm';
import type { Category } from '../types';
import { categoryService } from '../services/categoryService';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const CategoryFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [category, setCategory] = useState<Category | null>(null);
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [catsRes, catRes] = await Promise.all([
          categoryService.getCategories(),
          id ? categoryService.getCategory(id) : Promise.resolve({ success: true, data: null }),
        ]);
        if (catsRes.success && catsRes.data) setParentCategories(catsRes.data);
        if (id && catRes.success && catRes.data) setCategory(catRes.data);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleSubmit = async (categoryData: Partial<Category>) => {
    if (isEdit && id) {
      const res = await categoryService.updateCategory(id, categoryData);
      if (res.success) navigate('/dashboard/categories');
    } else {
      const res = await categoryService.createCategory(categoryData);
      if (res.success) navigate('/dashboard/categories');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Category' : 'Create Category'}</h1>
        <p className="mt-1 text-sm text-gray-500">{isEdit ? 'Update category details' : 'Add a new category'}</p>
      </div>
      <CategoryForm
        category={category || undefined}
        parentCategories={parentCategories}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/dashboard/categories')}
      />
    </div>
  );
};

export default CategoryFormPage;


