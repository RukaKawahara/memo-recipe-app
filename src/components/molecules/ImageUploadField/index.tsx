import React from 'react'
import FileUpload from '@/components/atoms/FileUpload'
import ImagePreview from '@/components/atoms/ImagePreview'
import styles from './ImageUploadField.module.scss'

interface ImageUploadFieldProps {
  imageFile?: File | null
  imageUrl?: string | null
  onFileChange: (file: File | null) => void
  onImageDelete: () => void
  className?: string
}

const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  imageFile,
  imageUrl,
  onFileChange,
  onImageDelete,
  className
}) => {
  const hasImage = imageFile || imageUrl

  return (
    <div className={`${styles.imageUploadField} ${className || ''}`}>
      {!hasImage && (
        <FileUpload onFileChange={onFileChange} id="image">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6ZM12 1l3.5 3.5H19a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6.5a2 2 0 0 1 2-2h3.5L12 1ZM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z"/>
          </svg>
          <span>写真を追加</span>
        </FileUpload>
      )}

      {imageFile && (
        <ImagePreview
          src={URL.createObjectURL(imageFile)}
          alt="プレビュー"
          onDelete={onImageDelete}
        />
      )}

      {imageUrl && !imageFile && (
        <ImagePreview
          src={imageUrl}
          alt="現在の写真"
          onDelete={onImageDelete}
        />
      )}
    </div>
  )
}

export default ImageUploadField