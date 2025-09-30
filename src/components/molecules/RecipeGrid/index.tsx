import RecipeCard from '@/components/molecules/RecipeCard';
import type { Recipe } from '@/types/recipe';
import styles from './RecipeGrid.module.scss';

export interface RecipeGridProps {
  recipes: Recipe[];
  favorites: string[];
  favoritesLoading: string | null;
  onFavoriteToggle: (recipeId: string, e: React.MouseEvent) => void;
  className?: string;
}

export const RecipeGrid = ({
  recipes,
  favorites,
  favoritesLoading,
  onFavoriteToggle,
  className = '',
}: RecipeGridProps) => {
  return (
    <div className={`${styles.recipeGrid} ${className}`.trim()}>
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          isFavorite={favorites.includes(recipe.id)}
          isLoading={favoritesLoading === recipe.id}
          onFavoriteToggle={(e) => onFavoriteToggle(recipe.id, e)}
        />
      ))}
    </div>
  );
};

export default RecipeGrid;
