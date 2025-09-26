'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { getUserId, getUserFavorites, toggleFavorite } from '@/lib/favorites'
import type { Recipe } from '@/types/recipe'
import styles from './page.module.scss'

export default function Favorites() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [favoritesLoading, setFavoritesLoading] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Get all recipes
      const { data: recipesData, error: recipesError } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false })

      if (recipesError) {
        console.error('Error fetching recipes:', recipesError)
        return
      }

      // Get user favorites
      const userId = getUserId()
      const userFavorites = await getUserFavorites(userId)

      // Filter favorite recipes
      const favoriteRecipesList = recipesData?.filter(recipe =>
        userFavorites.includes(recipe.id)
      ) || []

      setRecipes(recipesData || [])
      setFavorites(userFavorites)
      setFavoriteRecipes(favoriteRecipesList)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFavoriteToggle = async (recipeId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setFavoritesLoading(recipeId)
    try {
      const userId = getUserId()
      const isFavorite = favorites.includes(recipeId)
      const success = await toggleFavorite(userId, recipeId, isFavorite)

      if (success) {
        const newFavorites = isFavorite
          ? favorites.filter(id => id !== recipeId)
          : [...favorites, recipeId]

        setFavorites(newFavorites)

        // Update favorite recipes list
        const newFavoriteRecipes = recipes.filter(recipe =>
          newFavorites.includes(recipe.id)
        )
        setFavoriteRecipes(newFavoriteRecipes)
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    } finally {
      setFavoritesLoading(null)
    }
  }

  // ページネーション計算
  const totalPages = Math.ceil(favoriteRecipes.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentRecipes = favoriteRecipes.slice(startIndex, endIndex)

  // お気に入りが変更された時にページを適切に調整
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages)
    }
  }, [favoriteRecipes.length, currentPage, totalPages])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading) {
    return (
      <main className={styles.main}>
        <div className={styles.loading}>読み込み中...</div>
      </main>
    )
  }

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h2 className={styles.title}>お気に入り</h2>
      </header>

      <div className={styles.recipeList}>
        {favoriteRecipes.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>❤️</div>
            <p>お気に入りのレシピがありません</p>
            <Link href="/" className={styles.browseLink}>
              レシピを探す
            </Link>
          </div>
        ) : (
          currentRecipes.map((recipe) => (
            <div key={recipe.id} className={styles.recipeItemWrapper}>
              <Link href={`/recipe/${recipe.id}`} className={styles.recipeItem}>
                <div className={styles.recipeImage}>
                  {recipe.image_url ? (
                    <img src={recipe.image_url} alt={recipe.title} />
                  ) : (
                    <div className={styles.placeholderImage}>🍝</div>
                  )}
                </div>
                <div className={styles.recipeInfo}>
                  <h3 className={styles.recipeTitle}>{recipe.title}</h3>
                  <p className={styles.recipeDescription}>{recipe.description}</p>
                  <div className={styles.recipeGenres}>
                    {(recipe.genres || []).filter(Boolean).map((genre) => (
                      <span key={genre} className={styles.genreTag}>
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
              <button
                onClick={(e) => handleFavoriteToggle(recipe.id, e)}
                disabled={favoritesLoading === recipe.id}
                className={`${styles.favoriteButton} ${favorites.includes(recipe.id) ? styles.favorite : ''}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                  <path d={favorites.includes(recipe.id)
                    ? "M240,94c0,70-103.79,126.66-108.21,129a8,8,0,0,1-7.58,0C119.79,220.66,16,164,16,94A62.07,62.07,0,0,1,78,32c20.65,0,38.73,8.88,50,23.89C139.27,40.88,157.35,32,178,32A62.07,62.07,0,0,1,240,94Z"
                    : "M178,32c-20.65,0-38.73,8.88-50,23.89C116.73,40.88,98.65,32,78,32A62.07,62.07,0,0,0,16,94c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,220.66,240,164,240,94A62.07,62.07,0,0,0,178,32ZM128,206.8C109.74,196.16,32,147.69,32,94A46.06,46.06,0,0,1,78,48c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,147.61,146.24,196.15,128,206.8Z"
                  } />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>

      {/* ページネーション */}
      {favoriteRecipes.length > itemsPerPage && (
        <div className={styles.pagination}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`${styles.paginationButton} ${currentPage === 1 ? styles.disabled : ''}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
              <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path>
            </svg>
            前へ
          </button>

          <div className={styles.pageNumbers}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`${styles.pageNumber} ${currentPage === page ? styles.active : ''}`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`${styles.paginationButton} ${currentPage === totalPages ? styles.disabled : ''}`}
          >
            次へ
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
              <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
            </svg>
          </button>
        </div>
      )}

      {/* ページネーション情報 */}
      {favoriteRecipes.length > 0 && (
        <div className={styles.paginationInfo}>
          {favoriteRecipes.length}件中 {startIndex + 1}-{Math.min(endIndex, favoriteRecipes.length)}件を表示
        </div>
      )}
    </main>
  )
}