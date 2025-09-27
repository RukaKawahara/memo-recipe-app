import Link from 'next/link'
import RecipeCard from '@/components/molecules/RecipeCard'
import LoadingSpinner from '@/components/atoms/LoadingSpinner'
import type { Recipe } from '@/types/recipe'
import styles from './FavoriteRecipeList.module.scss'

export interface FavoriteRecipeListProps {
  recipes: Recipe[]
  favorites: string[]
  favoritesLoading: string | null
  onFavoriteToggle: (recipeId: string, e: React.MouseEvent) => void
  loading?: boolean
  className?: string
}

export const FavoriteRecipeList = ({
  recipes,
  favorites,
  favoritesLoading,
  onFavoriteToggle,
  loading = false,
  className = ''
}: FavoriteRecipeListProps) => {
  if (loading) {
    return (
      <div className={`${styles.loadingContainer} ${className}`.trim()}>
        <div className={styles.loadingSpinner}>
          <LoadingSpinner size="large" />
        </div>
        <div className={styles.loadingText}>お気に入りを読み込み中...</div>
        <div className={styles.loadingSubtext}>あなたのお気に入りレシピを準備しています</div>
      </div>
    )
  }

  if (recipes.length === 0) {
    return (
      <div className={`${styles.empty} ${className}`.trim()}>
        <div className={styles.emptyIcon}>❤️</div>
        <p>お気に入りのレシピがありません</p>
        <Link href="/" className={styles.browseLink}>
          レシピを探す
        </Link>
      </div>
    )
  }

  return (
    <div className={`${styles.recipeList} ${className}`.trim()}>
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
  )
}

export default FavoriteRecipeList