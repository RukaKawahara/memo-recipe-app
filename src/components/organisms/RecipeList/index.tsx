import RecipeGrid from '@/components/molecules/RecipeGrid';
import EmptyState from '@/components/molecules/EmptyState';
import LoadingState from '@/components/molecules/LoadingState';
import type { Recipe } from '@/types/recipe';

export interface RecipeListProps {
  recipes: Recipe[];
  favorites: string[];
  favoritesLoading: string | null;
  onFavoriteToggle: (recipeId: string, e: React.MouseEvent) => void;
  loading?: boolean;
  className?: string;
}

export const RecipeList = ({
  recipes,
  favorites,
  favoritesLoading,
  onFavoriteToggle,
  loading = false,
  className = '',
}: RecipeListProps) => {
  if (loading) {
    return <LoadingState title="レシピを読み込み中..." className={className} />;
  }

  if (recipes.length === 0) {
    return (
      <EmptyState
        title="レシピが登録されていません"
        actionText="新しいレシピを作成する"
        actionHref="/create"
        className={className}
      />
    );
  }

  return (
    <RecipeGrid
      recipes={recipes}
      favorites={favorites}
      favoritesLoading={favoritesLoading}
      onFavoriteToggle={onFavoriteToggle}
      className={className}
    />
  );
};

export default RecipeList;
