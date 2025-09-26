'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Recipe } from '@/types/recipe'
import styles from './page.module.scss'

export default function RecipeDetail({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string>('')
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    params.then(resolvedParams => {
      setId(resolvedParams.id)
    })
  }, [params])

  useEffect(() => {
    if (id) {
      fetchRecipe()
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
          {recipe.image_url && (
            <div className={styles.imageContainer}>
              <img src={recipe.image_url} alt={recipe.title} className={styles.image} />
            </div>
          )}

          <div className={`${styles.section} ${styles.infoSection}`}>
            <h2 className={styles.infoTitle}>{recipe.title}</h2>
            <p className={styles.description}>{recipe.description}</p>
          </div>
        </div>

        <div className={styles.bottomSection}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>材料</h2>
            <div className={styles.ingredients}>
              {recipe.ingredients.split('\n').filter(ingredient => ingredient.trim()).map((ingredient, index) => (
                <div key={index} className={styles.ingredient}>
                  <div className={styles.checkbox}></div>
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
                  <div className={styles.checkbox}></div>
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
      </div>
    </main>
  )
}