import React, { useState, useRef } from 'react';
import { CloudArrowUpIcon, XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { productService } from '../../services/productService';

interface ImageUploadProps {
  onImageUpload: (url: string) => void;
  onImageRemove?: (index: number) => void;
  existingImages?: string[];
  maxImages?: number;
  className?: string;
  productId?: string; // For uploading to existing product
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUpload,
  onImageRemove,
  existingImages = [],
  maxImages = 10,
  className = '',
  productId,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (files: FileList) => {
    if (files.length === 0) return;

    setIsUploading(true);
    
    try {
      // Convert FileList to Array
      const fileArray = Array.from(files);
      
      for (const file of fileArray) {
        if (existingImages.length >= maxImages) {
          alert(`Maximum ${maxImages} images allowed`);
          break;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
          alert(`${file.name} is not an image file`);
          continue;
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          alert(`${file.name} is too large. Maximum size is 5MB`);
          continue;
        }

        // If we have a productId, upload to the existing product
        if (productId) {
          try {
            const response = await productService.uploadProductImages(productId, [file]);
            if (response.success && response.data?.images?.length > 0) {
              onImageUpload(response.data.images[0]);
            } else {
              throw new Error('Upload failed');
            }
          } catch (error) {
            console.error('Error uploading to product:', error);
            alert(`Failed to upload ${file.name}. Please try again.`);
            continue;
          }
        } else {
          // For new products or standalone uploads, create a temporary URL
          // In a real implementation, you might upload to a temporary storage
          // and then move the files when the product is saved
          const imageUrl = URL.createObjectURL(file);
          
          // Simulate upload delay for better UX
          await new Promise(resolve => setTimeout(resolve, 500));
          
          onImageUpload(imageUrl);
        }
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Error uploading images. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />
        
        <div className="text-center">
          <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <button
              type="button"
              onClick={openFileDialog}
              disabled={isUploading || existingImages.length >= maxImages}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Uploading...' : 'Choose Images'}
            </button>
            <p className="mt-2 text-sm text-gray-600">
              or drag and drop images here
            </p>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            PNG, JPG, WebP up to 5MB each. Max {maxImages} images.
          </p>
        </div>
      </div>

      {/* Images Grid */}
      {existingImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {existingImages.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square relative overflow-hidden rounded-lg border border-gray-200">
                <img
                  src={image}
                  alt={`Uploaded image ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="hidden absolute inset-0 bg-gray-100 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <PhotoIcon className="h-8 w-8 mx-auto mb-2" />
                    <div className="text-sm">Failed to load</div>
                  </div>
                </div>
                
                {/* Remove Button */}
                {onImageRemove && (
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => onImageRemove(index)}
                      className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                      title="Remove image"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {/* Image Position Badge */}
                <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                  {index + 1}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
