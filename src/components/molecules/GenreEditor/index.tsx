import React from 'react';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import styles from './GenreEditor.module.scss';

interface GenreEditorProps {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
}

const GenreEditor: React.FC<GenreEditorProps> = ({
  value,
  onChange,
  onSave,
  onCancel,
  isLoading = false,
  placeholder = 'ジャンル名',
  autoFocus = false,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') onSave();
    if (e.key === 'Escape') onCancel();
  };

  return (
    <div className={styles.editingForm}>
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onKeyDown={handleKeyDown}
        autoFocus={autoFocus}
        className={styles.editInput}
      />
      <div className={styles.editActions}>
        <Button variant="primary" rounded onClick={onSave} disabled={isLoading}>
          {isLoading ? '保存中...' : '保存'}
        </Button>
        <Button
          variant="outline"
          rounded
          onClick={onCancel}
          disabled={isLoading}
        >
          キャンセル
        </Button>
      </div>
    </div>
  );
};

export default GenreEditor;
