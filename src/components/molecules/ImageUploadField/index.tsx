import React from 'react';
import FileUpload from '@/components/atoms/FileUpload';
import ImagePreview from '@/components/atoms/ImagePreview';
import Icon from '@/components/atoms/Icon';
import styles from './ImageUploadField.module.scss';

interface ImageUploadFieldProps {
  imageFiles?: File[];
  imageUrls?: string[];
  onFilesChange: (files: File[]) => void;
  onImageDelete: (index: number) => void;
  maxImages?: number;
  className?: string;
}

const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  imageFiles = [],
  imageUrls = [],
  onFilesChange,
  onImageDelete,
  maxImages = 5,
  className,
}) => {
  const totalImages = imageFiles.length + imageUrls.length;
  const canAddMore = totalImages < maxImages;

  const handleFileChange = (file: File | null) => {
    if (file && canAddMore) {
      onFilesChange([...imageFiles, file]);
    }
  };

  return (
    <div className={`${styles.imageUploadField} ${className || ''}`}>
      <div className={styles.imagesGrid}>
        {imageUrls.map((url, index) => (
          <ImagePreview
            key={`url-${index}`}
            src={url}
            alt={`画像 ${index + 1}`}
            onDelete={() => onImageDelete(index)}
          />
        ))}

        {imageFiles.map((file, index) => (
          <ImagePreview
            key={`file-${index}`}
            src={URL.createObjectURL(file)}
            alt={`プレビュー ${imageUrls.length + index + 1}`}
            onDelete={() => onImageDelete(imageUrls.length + index)}
          />
        ))}

        {canAddMore && (
          <FileUpload onFileChange={handleFileChange} id="images">
            <Icon name="camera" size={24} />
            <span>写真を追加</span>
            <span className={styles.imageCount}>
              {totalImages}/{maxImages}
            </span>
          </FileUpload>
        )}
      </div>
    </div>
  );
};

export default ImageUploadField;
