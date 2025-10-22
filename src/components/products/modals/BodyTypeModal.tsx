import React from 'react';
import ArrayFieldModal from './ArrayFieldModal';

interface BodyTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  bodyTypes: string[];
  onBodyTypesChange: (bodyTypes: string[]) => void;
}

const BodyTypeModal: React.FC<BodyTypeModalProps> = ({
  isOpen,
  onClose,
  bodyTypes,
  onBodyTypesChange,
}) => {
  return (
    <ArrayFieldModal
      isOpen={isOpen}
      onClose={onClose}
      title="Body Type Suitability"
      items={bodyTypes}
      onItemsChange={onBodyTypesChange}
      placeholder="Add body type (e.g., Apple, Pear, Hourglass)"
      description="Specify which body types this product is suitable for."
      color="green"
    />
  );
};

export default BodyTypeModal;
