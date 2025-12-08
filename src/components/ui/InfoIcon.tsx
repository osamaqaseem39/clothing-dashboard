import React from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import Tooltip from './Tooltip';

interface InfoIconProps {
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

const InfoIcon: React.FC<InfoIconProps> = ({ 
  content, 
  position = 'top',
  className = '' 
}) => {
  return (
    <Tooltip content={content} position={position} delay={200}>
      <button
        type="button"
        className={`inline-flex items-center justify-center text-gray-400 hover:text-gray-600 focus:outline-none ${className}`}
        aria-label="More information"
      >
        <InformationCircleIcon className="h-4 w-4" />
      </button>
    </Tooltip>
  );
};

export default InfoIcon;


