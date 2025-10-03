import React from 'react';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import type { Genre } from '@/lib/genres';
import styles from './GenreListItem.module.scss';

interface GenreListItemProps {
  genre: Genre;
  isEditing: boolean;
  editValue: string;
  isLoading: boolean;
  onStartEdit: () => void;
  onEditValueChange: (value: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onDelete: () => void;
}

const GenreListItem: React.FC<GenreListItemProps> = ({
  genre,
  isEditing,
  editValue,
  isLoading,
  onStartEdit,
  onEditValueChange,
  onSaveEdit,
  onCancelEdit,
  onDelete,
}) => {
  return (
    <div className={styles.genreItem}>
      <div className={styles.genreDisplay}>
        <div className={styles.genreInfo}>
          {isEditing ? (
            <Input
              type="text"
              value={editValue}
              onChange={(e) => onEditValueChange(e.target.value)}
              placeholder="ジャンル名"
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSaveEdit();
                if (e.key === 'Escape') onCancelEdit();
              }}
              autoFocus
              className={styles.editInput}
            />
          ) : (
            <>
              <span className={styles.genreName}>{genre.name}</span>
            </>
          )}
        </div>
        <div className={styles.genreActions}>
          {isEditing ? (
            <>
              <Button
                variant="primary"
                rounded
                onClick={onSaveEdit}
                disabled={isLoading}
              >
                {isLoading ? '保存中...' : '保存'}
              </Button>
              <Button
                variant="outline"
                rounded
                onClick={onCancelEdit}
                disabled={isLoading}
              >
                キャンセル
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                rounded
                onClick={onStartEdit}
                disabled={isLoading }
              >
                編集
              </Button>
              <Button
                variant="danger"
                rounded
                onClick={onDelete}
                disabled={isLoading}
              >
                {isLoading ? '削除中...' : '削除'}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenreListItem;
