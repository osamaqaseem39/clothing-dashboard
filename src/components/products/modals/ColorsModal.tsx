import React from 'react';
import ArrayFieldModal from './ArrayFieldModal';

interface ColorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  colors: string[];
  onColorsChange: (colors: string[]) => void;
}

const ColorsModal: React.FC<ColorsModalProps> = ({
  isOpen,
  onClose,
  colors,
  onColorsChange,
}) => {
  return (
    <ArrayFieldModal
      isOpen={isOpen}
      onClose={onClose}
      title="Available Colors"
      items={colors}
      onItemsChange={onColorsChange}
      placeholder="Add a color (e.g., Black, Navy, Burgundy)"
      description="Add all available colors for this product."
      color="indigo"
    />
  );
};

export default ColorsModal;
