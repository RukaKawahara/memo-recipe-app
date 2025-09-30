import { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/atoms/Button';
import Icon from '@/components/atoms/Icon';
import GenreTag from '@/components/atoms/GenreTag';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import type { Recipe } from '@/types/recipe';
import styles from './RecipeCard.module.scss';

export interface RecipeCardProps {
  recipe: Recipe;
  isFavorite?: boolean;
  isLoading?: boolean;
  onFavoriteToggle?: (e: React.MouseEvent) => void;
  className?: string;
}

export const RecipeCard = ({
  recipe,
  isFavorite = false,
  isLoading = false,
  onFavoriteToggle,
  className = '',
}: RecipeCardProps) => {
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <div className={`${styles.recipeCardWrapper} ${className}`.trim()}>
      <Link href={`/recipe/${recipe.id}`} className={styles.recipeCard}>
        <div className={styles.recipeImage}>
          {imageLoading && (
            <div className={styles.imageLoadingWrapper}>
              <LoadingSpinner size="medium" />
            </div>
          )}
          {recipe.image_url ? (
            <img
              src={recipe.image_url}
              alt={recipe.title}
              onLoad={() => setImageLoading(false)}
              className={imageLoading ? styles.imageLoading : ''}
            />
          ) : (
            <img
              src="/images/noimage.png"
              alt={recipe.title}
              onLoad={() => setImageLoading(false)}
              className={imageLoading ? styles.imageLoading : ''}
            />
          )}
        </div>
        <div className={styles.recipeInfo}>
          <h3 className={styles.recipeTitle}>{recipe.title}</h3>
          <p className={styles.recipeDescription}>{recipe.description}</p>
          <div className={styles.recipeGenres}>
            {(recipe.genres || []).filter(Boolean).map((genre) => (
              <GenreTag key={genre} size="small">
                {genre}
              </GenreTag>
            ))}
          </div>
        </div>
      </Link>
      {onFavoriteToggle && (
        <Button
          variant="icon"
          onClick={onFavoriteToggle}
          disabled={isLoading}
          className={`${styles.favoriteButton} ${isFavorite ? styles.favorite : ''}`}
        >
          <Icon name={isFavorite ? 'heart-filled' : 'heart'} size={20} />
        </Button>
      )}
    </div>
  );
};

export default RecipeCard;
