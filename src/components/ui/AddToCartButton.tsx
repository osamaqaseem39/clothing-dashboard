import React, { useState } from 'react';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import { useCart } from '../../contexts/CartContext';
import { Product } from '../../types';
import LoadingSpinner from './LoadingSpinner';

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
  variationId?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  disabled?: boolean;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  quantity = 1,
  variationId,
  className = '',
  size = 'md',
  showText = true,
  disabled = false,
}) => {
  const { addToCart, state } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (disabled || isAdding) return;

    setIsAdding(true);
    try {
      await addToCart(product, quantity, variationId);
      // You could add a toast notification here
    } catch (error) {
      console.error('Error adding to cart:', error);
      // You could add an error toast here
    } finally {
      setIsAdding(false);
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'lg':
        return 'px-6 py-3 text-lg';
      default:
        return 'px-4 py-2 text-base';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'h-4 w-4';
      case 'lg':
        return 'h-6 w-6';
      default:
        return 'h-5 w-5';
    }
  };

  const isOutOfStock = product.stockStatus === 'outofstock' || product.stockQuantity <= 0;

  return (
    <button
      onClick={handleAddToCart}
      disabled={disabled || isAdding || isOutOfStock || state.isLoading}
      className={`
        inline-flex items-center justify-center gap-2 font-medium rounded-md transition-colors duration-200
        ${getSizeClasses()}
        ${isOutOfStock || disabled
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
        }
        ${className}
      `}
    >
      {isAdding || state.isLoading ? (
        <>
          <LoadingSpinner size="sm" />
          {showText && 'Adding...'}
        </>
      ) : (
        <>
          <ShoppingBagIcon className={getIconSize()} />
          {showText && (isOutOfStock ? 'Out of Stock' : 'Add to Cart')}
        </>
      )}
    </button>
  );
};

export default AddToCartButton;
