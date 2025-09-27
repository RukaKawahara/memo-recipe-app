'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { getUserId, getUserFavorites, toggleFavorite } from '@/lib/favorites'
import { getGenreNames } from '@/lib/genres'
import type { Recipe } from '@/types/recipe'
import Button from '@/components/atoms/Button'
import Icon from '@/components/atoms/Icon'
import SearchAndFilters from '@/components/organisms/SearchAndFilters'
import FavoriteRecipeList from '@/components/organisms/FavoriteRecipeList'
import Pagination from '@/components/organisms/Pagination'
import styles from './page.module.scss'

export default function Favorites() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [favoritesLoading, setFavoritesLoading] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('すべて')
  const [genres, setGenres] = useState<string[]>(['すべて'])

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    fetchGenres()
  }, [favoriteRecipes])

  const fetchGenres = async () => {
    try {
      // ジャンル管理で登録されているジャンルを取得
      const managedGenres = await getGenreNames()

      // お気に入りレシピで実際に使用されているジャンルを取得
      const usedGenres = new Set<string>()
      favoriteRecipes.forEach(recipe => {
        if (recipe.genres && Array.isArray(recipe.genres)) {
          recipe.genres.forEach(genre => {
            if (genre && genre.trim()) {
              usedGenres.add(genre.trim())
            }
          })
        }
      })

      // 両方を合わせて重複を除去
      const allGenres = Array.from(new Set([...managedGenres, ...Array.from(usedGenres)]))
      setGenres(['すべて', ...allGenres.sort()])
    } catch (error) {
      console.error('Error fetching genres:', error)
    }
  }

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

  // フィルタリング機能
  const filteredRecipes = favoriteRecipes.filter((recipe) => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.ingredients.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesGenre = selectedGenre === 'すべて' ||
      (recipe.genres && recipe.genres.includes(selectedGenre))

    return matchesSearch && matchesGenre
  })

  // ページネーション計算
  const totalPages = Math.ceil(filteredRecipes.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentRecipes = filteredRecipes.slice(startIndex, endIndex)

  // お気に入りが変更された時にページを適切に調整
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages)
    }
  }, [favoriteRecipes.length, currentPage, totalPages])

  // 検索やフィルタが変更された時にページを1に戻す
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedGenre])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading) {
    return (
      <main className={styles.main}>
        <FavoriteRecipeList
          recipes={[]}
          favorites={[]}
          favoritesLoading={null}
          onFavoriteToggle={() => {}}
          loading={true}
          className={styles.recipeList}
        />
      </main>
    )
  }

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h2 className={styles.title}>お気に入り</h2>
      </header>

      <SearchAndFilters
        searchTerm={searchTerm}
        selectedGenre={selectedGenre}
        genres={genres}
        onSearchChange={setSearchTerm}
        onGenreChange={setSelectedGenre}
        className={styles.searchAndFilters}
      />

      <FavoriteRecipeList
        recipes={currentRecipes}
        favorites={favorites}
        favoritesLoading={favoritesLoading}
        onFavoriteToggle={handleFavoriteToggle}
        loading={false}
        className={styles.recipeList}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        startIndex={startIndex}
        endIndex={endIndex}
        totalItems={filteredRecipes.length}
      />
    </main>
  )
}