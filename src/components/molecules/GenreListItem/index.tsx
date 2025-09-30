import React from 'react';
import Button from '@/components/atoms/Button';
import GenreEditor from '../GenreEditor';
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
  if (isEditing) {
    return (
      <div className={styles.genreItem}>
        <GenreEditor
          value={editValue}
          onChange={onEditValueChange}
          onSave={onSaveEdit}
          onCancel={onCancelEdit}
          isLoading={isLoading}
          autoFocus
        />
      </div>
    );
  }

  return (
    <div className={styles.genreItem}>
      <div className={styles.genreDisplay}>
        <div className={styles.genreInfo}>
          <span className={styles.genreName}>{genre.name}</span>
          {genre.id.startsWith('default-') && (
            <span className={styles.fallbackBadge}>システム</span>
          )}
        </div>
        <div className={styles.genreActions}>
          <Button
            variant="edit"
            onClick={onStartEdit}
            disabled={isLoading || genre.id.startsWith('default-')}
          >
            編集
          </Button>
          {!genre.id.startsWith('default-') && (
            <Button
              variant="delete"
              onClick={onDelete}
              disabled={isLoading}
            >
              {isLoading ? '削除中...' : '削除'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenreListItem;
