import React from 'react';
import ArrayFieldModal from './ArrayFieldModal';

interface FeaturesModalProps {
  isOpen: boolean;
  onClose: () => void;
  features: string[];
  onFeaturesChange: (features: string[]) => void;
}

const FeaturesModal: React.FC<FeaturesModalProps> = ({
  isOpen,
  onClose,
  features,
  onFeaturesChange,
}) => {
  return (
    <ArrayFieldModal
      isOpen={isOpen}
      onClose={onClose}
      title="Product Features"
      items={features}
      onItemsChange={onFeaturesChange}
      placeholder="Add a feature (e.g., Machine washable, Breathable fabric)"
      description="Add key features and benefits of this product."
      color="red"
    />
  );
};

export default FeaturesModal;
