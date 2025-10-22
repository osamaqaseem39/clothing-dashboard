import React from 'react';
import ArrayFieldModal from './ArrayFieldModal';

interface KeywordsModalProps {
  isOpen: boolean;
  onClose: () => void;
  keywords: string[];
  onKeywordsChange: (keywords: string[]) => void;
}

const KeywordsModal: React.FC<KeywordsModalProps> = ({
  isOpen,
  onClose,
  keywords,
  onKeywordsChange,
}) => {
  return (
    <ArrayFieldModal
      isOpen={isOpen}
      onClose={onClose}
      title="SEO Keywords"
      items={keywords}
      onItemsChange={onKeywordsChange}
      placeholder="Add a keyword (e.g., evening gown, silk dress)"
      description="Add SEO keywords to improve search engine visibility."
      color="indigo"
    />
  );
};

export default KeywordsModal;
