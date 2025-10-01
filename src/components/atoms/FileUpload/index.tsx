import React from 'react';
import Icon from '@/components/atoms/Icon';
import styles from './FileUpload.module.scss';

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
  accept?: string;
  id?: string;
  children?: React.ReactNode;
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileChange,
  accept = 'image/*',
  id = 'file-upload',
  children,
  className,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onFileChange(file);
  };

  return (
    <label htmlFor={id} className={`${styles.fileUpload} ${className || ''}`}>
      {children || (
        <>
          <Icon name="camera" size={24} />
          <span>ファイルを選択</span>
        </>
      )}
      <input
        id={id}
        type="file"
        accept={accept}
        onChange={handleChange}
        className={styles.fileInput}
      />
    </label>
  );
};

export default FileUpload;
