import React from 'react'
import FileUpload from '@/components/atoms/FileUpload'
import ImagePreview from '@/components/atoms/ImagePreview'
import styles from './ImageUploadField.module.scss'

interface ImageUploadFieldProps {
  imageFiles?: File[]
  imageUrls?: string[]
  onFilesChange: (files: File[]) => void
  onImageDelete: (index: number) => void
  maxImages?: number
  className?: string
}

const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  imageFiles = [],
  imageUrls = [],
  onFilesChange,
  onImageDelete,
  maxImages = 5,
  className
}) => {
  const totalImages = imageFiles.length + imageUrls.length
  const canAddMore = totalImages < maxImages

  const handleFileChange = (file: File | null) => {
    if (file && canAddMore) {
      onFilesChange([...imageFiles, file])
    }
  }

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
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6ZM12 1l3.5 3.5H19a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6.5a2 2 0 0 1 2-2h3.5L12 1ZM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z"/>
            </svg>
            <span>写真を追加</span>
            <span className={styles.imageCount}>{totalImages}/{maxImages}</span>
          </FileUpload>
        )}
      </div>
    </div>
  )
}

export default ImageUploadField