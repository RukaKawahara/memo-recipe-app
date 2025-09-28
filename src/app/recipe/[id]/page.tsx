'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { getUserId, getUserFavorites, toggleFavorite } from '@/lib/favorites'
import type { Recipe } from '@/types/recipe'
import GenreTag from '@/components/atoms/GenreTag'
import styles from './page.module.scss'

export default function RecipeDetail({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string>('')
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [favoritesLoading, setFavoritesLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    params.then(resolvedParams => {
      setId(resolvedParams.id)
    })
  }, [params])

  useEffect(() => {
    if (id) {
      fetchRecipe()
      fetchFavoriteStatus()
    }
  }, [id])

  const fetchRecipe = async () => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching recipe:', error)
        router.push('/')
      } else {
        setRecipe(data)
      }
    } catch (error) {
      console.error('Error:', error)
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  const fetchFavoriteStatus = async () => {
    try {
      const userId = getUserId()
      const favorites = await getUserFavorites(userId)
      setIsFavorite(favorites.includes(id))
    } catch (error) {
      console.error('Error fetching favorite status:', error)
    }
  }

  const handleFavoriteToggle = async () => {
    if (!recipe) return

    setFavoritesLoading(true)
    try {
      const userId = getUserId()
      const success = await toggleFavorite(userId, recipe.id, isFavorite)
      if (success) {
        setIsFavorite(!isFavorite)
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    } finally {
      setFavoritesLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!recipe) return

    const confirmed = confirm('このレシピを削除しますか？')
    if (!confirmed) return

    try {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', recipe.id)

      if (error) {
        console.error('Error deleting recipe:', error)
      } else {
        router.push('/')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  if (loading) {
    return <div className={styles.loading}>読み込み中...</div>
  }

  if (!recipe) {
    return <div className={styles.error}>レシピが見つかりませんでした。</div>
  }

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <Link href="/" className={styles.backButton}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
            <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
          </svg>
        </Link>
        <h1 className={styles.title}>{recipe.title}</h1>
        <div className={styles.actions}>
          <button
            onClick={handleFavoriteToggle}
            disabled={favoritesLoading}
            className={`${styles.favoriteButton} ${isFavorite ? styles.favorite : ''}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
              <path d={isFavorite
                ? "M240,94c0,70-103.79,126.66-108.21,129a8,8,0,0,1-7.58,0C119.79,220.66,16,164,16,94A62.07,62.07,0,0,1,78,32c20.65,0,38.73,8.88,50,23.89C139.27,40.88,157.35,32,178,32A62.07,62.07,0,0,1,240,94Z"
                : "M178,32c-20.65,0-38.73,8.88-50,23.89C116.73,40.88,98.65,32,78,32A62.07,62.07,0,0,0,16,94c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,220.66,240,164,240,94A62.07,62.07,0,0,0,178,32ZM128,206.8C109.74,196.16,32,147.69,32,94A46.06,46.06,0,0,1,78,48c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,147.61,146.24,196.15,128,206.8Z"
              } />
            </svg>
          </button>
          <Link href={`/edit/${recipe.id}`} className={styles.editButton}>
            編集
          </Link>
          <button onClick={handleDelete} className={styles.deleteButton}>
            削除
          </button>
        </div>
      </header>

      <div className={styles.content}>
        <div className={styles.topSection}>
          {recipe.image_url ? (
            <div className={styles.imageContainer}>
              <img src={recipe.image_url} alt={recipe.title} className={styles.image} />
            </div>
          ) : (
            <div className={styles.imageContainer}>
              <img src='/images/noimage.png' alt='画像がありません' className={styles.image} />
            </div>
          )}

          <div className={`${styles.section} ${styles.infoSection}`}>
            <h2 className={styles.infoTitle}>{recipe.title}</h2>
            <p className={styles.description}>{recipe.description}</p>
          </div>
        </div>

        {recipe.genres && recipe.genres.length > 0 && (
          <div className={`${styles.section} ${styles.genresSection}`}>
            <h3 className={styles.genresTitle}>ジャンル</h3>
            <div className={styles.genres}>
              {recipe.genres.filter(Boolean).map((genre) => (
                <GenreTag key={genre} size="medium">
                  {genre}
                </GenreTag>
              ))}
            </div>
          </div>
        )}

        <div className={styles.bottomSection}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>材料</h2>
            <div className={styles.ingredients}>
              {recipe.ingredients.split('\n').filter(ingredient => ingredient.trim()).map((ingredient, index) => (
                <div key={index} className={styles.ingredient}>
                  <span>{ingredient.trim()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>手順</h2>
            <div className={styles.instructions}>
              {recipe.instructions.split('\n').filter(instruction => instruction.trim()).map((instruction, index) => (
                <div key={index} className={styles.instruction}>
                  <span>{instruction.trim()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {recipe.memo && (
          <div className={`${styles.section} ${styles.memoSection}`}>
            <h2 className={styles.sectionTitle}>メモ</h2>
            <p className={styles.memo}>{recipe.memo}</p>
          </div>
        )}

        {recipe.reference_url && (
          <div className={`${styles.section} ${styles.referenceSection}`}>
            <h2 className={styles.sectionTitle}>参考リンク</h2>
            <a
              href={recipe.reference_url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.referenceLink}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                <path d="M137.54,186.36a8,8,0,0,1,0,11.31l-9.94,10A56,56,0,0,1,48.38,128.4L74.05,102.73a56,56,0,0,1,79.2,0,8,8,0,0,1-11.31,11.31,40,40,0,0,0-56.57,0L59.69,139.71a40,40,0,0,0,56.57,56.57l9.94-9.94A8,8,0,0,1,137.54,186.36Zm70.08-138a56,56,0,0,0-79.21,0l-9.94,9.95a8,8,0,0,0,11.32,11.31l9.94-9.94a40,40,0,0,1,56.57,56.56L170.63,141.9a40,40,0,0,1-56.57,0,8,8,0,0,0-11.31,11.32,56,56,0,0,0,79.2,0l25.67-25.67A56,56,0,0,0,207.62,48.38Z"></path>
              </svg>
              {recipe.reference_url}
            </a>
          </div>
        )}
      </div>
    </main>
  )
}