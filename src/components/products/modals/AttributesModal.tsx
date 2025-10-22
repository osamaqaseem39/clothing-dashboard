import React from 'react';
import ArrayFieldModal from './ArrayFieldModal';

interface AttributesModalProps {
  isOpen: boolean;
  onClose: () => void;
  attributes: string[];
  onAttributesChange: (attributes: string[]) => void;
}

const AttributesModal: React.FC<AttributesModalProps> = ({
  isOpen,
  onClose,
  attributes,
  onAttributesChange,
}) => {
  return (
    <ArrayFieldModal
      isOpen={isOpen}
      onClose={onClose}
      title="Product Attributes"
      items={attributes}
      onItemsChange={onAttributesChange}
      placeholder="Add an attribute (e.g., Silk, Beadwork, A-line, Floor Length)"
      description="Add specific attributes that describe this product."
      color="blue"
    />
  );
};

export default AttributesModal;
