import React from 'react';
import Button from '../Button';
import Icon from '../Icon';
import styles from './ImagePreview.module.scss';

interface ImagePreviewProps {
  src: string;
  alt?: string;
  onDelete?: () => void;
  className?: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  src,
  alt = 'プレビュー',
  onDelete,
  className,
}) => {
  return (
    <div className={`${styles.imagePreview} ${className || ''}`}>
      <img src={src} alt={alt} className={styles.previewImage} />
      {onDelete && (
        <Button
          type="button"
          variant="deleteImage"
          onClick={onDelete}
          aria-label="画像を削除"
          className={styles.deleteButton}
        >
          <Icon name="close" size={16} />
        </Button>
      )}
    </div>
  );
};

export default ImagePreview;
