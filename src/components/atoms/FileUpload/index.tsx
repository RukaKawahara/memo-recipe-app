import React from 'react';
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
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6ZM12 1l3.5 3.5H19a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6.5a2 2 0 0 1 2-2h3.5L12 1ZM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z" />
          </svg>
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
