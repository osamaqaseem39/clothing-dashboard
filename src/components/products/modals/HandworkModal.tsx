import React from 'react';
import ArrayFieldModal from './ArrayFieldModal';

interface HandworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  handwork: string[];
  onHandworkChange: (handwork: string[]) => void;
}

const HandworkModal: React.FC<HandworkModalProps> = ({
  isOpen,
  onClose,
  handwork,
  onHandworkChange,
}) => {
  return (
    <ArrayFieldModal
      isOpen={isOpen}
      onClose={onClose}
      title="Handwork Details"
      items={handwork}
      onItemsChange={onHandworkChange}
      placeholder="Add handwork type (e.g., Embroidery, Zari, Sequins)"
      description="Add details about the handwork and embellishments on this product."
      color="purple"
    />
  );
};

export default HandworkModal;
