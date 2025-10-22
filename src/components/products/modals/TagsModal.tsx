import React from 'react';
import ArrayFieldModal from './ArrayFieldModal';

interface TagsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}

const TagsModal: React.FC<TagsModalProps> = ({
  isOpen,
  onClose,
  tags,
  onTagsChange,
}) => {
  return (
    <ArrayFieldModal
      isOpen={isOpen}
      onClose={onClose}
      title="Product Tags"
      items={tags}
      onItemsChange={onTagsChange}
      placeholder="Add a tag (e.g., summer, casual, formal)"
      description="Add tags to help categorize and search for this product."
      color="blue"
    />
  );
};

export default TagsModal;
