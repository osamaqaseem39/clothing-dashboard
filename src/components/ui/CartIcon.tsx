import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import { useCart } from '../contexts/CartContext';

interface CartIconProps {
  className?: string;
}

const CartIcon: React.FC<CartIconProps> = ({ className = '' }) => {
  const { getCartItemCount } = useCart();
  const itemCount = getCartItemCount();

  return (
    <Link
      to="/cart"
      className={`relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors ${className}`}
      title="Shopping Cart"
    >
      <ShoppingBagIcon className="h-6 w-6" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </Link>
  );
};

export default CartIcon;
