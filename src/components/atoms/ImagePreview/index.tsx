import React from 'react'
import Button from '../Button'
import styles from './ImagePreview.module.scss'

interface ImagePreviewProps {
  src: string
  alt?: string
  onDelete?: () => void
  className?: string
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  src,
  alt = "プレビュー",
  onDelete,
  className
}) => {
  return (
    <div className={`${styles.imagePreview} ${className || ''}`}>
      <img
        src={src}
        alt={alt}
        className={styles.previewImage}
      />
      {onDelete && (
        <Button
          type="button"
          variant="deleteImage"
          onClick={onDelete}
          aria-label="画像を削除"
          className={styles.deleteButton}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
            <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
          </svg>
        </Button>
      )}
    </div>
  )
}

export default ImagePreview