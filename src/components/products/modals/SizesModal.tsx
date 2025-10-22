import React from 'react';
import ArrayFieldModal from './ArrayFieldModal';

interface SizesModalProps {
  isOpen: boolean;
  onClose: () => void;
  sizes: string[];
  onSizesChange: (sizes: string[]) => void;
}

const SizesModal: React.FC<SizesModalProps> = ({
  isOpen,
  onClose,
  sizes,
  onSizesChange,
}) => {
  return (
    <ArrayFieldModal
      isOpen={isOpen}
      onClose={onClose}
      title="Available Sizes"
      items={sizes}
      onItemsChange={onSizesChange}
      placeholder="Add size (e.g., S, M, L, XL, 6, 8, 10)"
      description="Add all available sizes for this product."
      color="yellow"
    />
  );
};

export default SizesModal;
