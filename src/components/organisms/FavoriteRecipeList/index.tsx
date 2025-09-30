import RecipeGrid from '@/components/molecules/RecipeGrid';
import EmptyState from '@/components/molecules/EmptyState';
import LoadingState from '@/components/molecules/LoadingState';
import type { Recipe } from '@/types/recipe';

export interface FavoriteRecipeListProps {
  recipes: Recipe[];
  favorites: string[];
  favoritesLoading: string | null;
  onFavoriteToggle: (recipeId: string, e: React.MouseEvent) => void;
  loading?: boolean;
  className?: string;
}

export const FavoriteRecipeList = ({
  recipes,
  favorites,
  favoritesLoading,
  onFavoriteToggle,
  loading = false,
  className = '',
}: FavoriteRecipeListProps) => {
  if (loading) {
    return (
      <LoadingState
        title="お気に入りを読み込み中..."
        subtitle="あなたのお気に入りレシピを準備しています"
        className={className}
      />
    );
  }

  if (recipes.length === 0) {
    return (
      <EmptyState
        icon="❤️"
        title="お気に入りのレシピがありません"
        actionText="レシピを探す"
        actionHref="/"
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

export default FavoriteRecipeList;
