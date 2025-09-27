import Link from 'next/link'
import RecipeCard from '@/components/molecules/RecipeCard'
import LoadingSpinner from '@/components/atoms/LoadingSpinner'
import type { Recipe } from '@/types/recipe'
import styles from './RecipeList.module.scss'

export interface RecipeListProps {
  recipes: Recipe[]
  favorites: string[]
  favoritesLoading: string | null
  onFavoriteToggle: (recipeId: string, e: React.MouseEvent) => void
  loading?: boolean
  className?: string
}

export const RecipeList = ({
  recipes,
  favorites,
  favoritesLoading,
  onFavoriteToggle,
  loading = false,
  className = ''
}: RecipeListProps) => {
  if (loading) {
    return (
      <div className={`${styles.loadingContainer} ${className}`.trim()}>
        <div className={styles.loadingSpinner}>
          <LoadingSpinner size="large" />
        </div>
        <div className={styles.loadingText}>レシピを読み込み中...</div>
      </div>
    )
  }

  if (recipes.length === 0) {
    return (
      <div className={`${styles.empty} ${className}`.trim()}>
        <p>レシピが登録されていません</p>
        <Link href="/create" className={styles.createLink}>
          新しいレシピを作成する
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

export default RecipeList