'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { getGenreNames } from '@/lib/genres'
import Button from '@/components/atoms/Button'
import RecipeForm from '@/components/organisms/RecipeForm'
import type { Recipe } from '@/types/recipe'
import styles from './page.module.scss'

export default function EditRecipe({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string>('')
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [ingredients, setIngredients] = useState('')
  const [instructions, setInstructions] = useState('')
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [memo, setMemo] = useState('')
  const [referenceUrl, setReferenceUrl] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [availableGenres, setAvailableGenres] = useState<string[]>([])

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

  useEffect(() => {
    loadGenres()
  }, [])

  const loadGenres = async () => {
    try {
      const genreNames = await getGenreNames()
      setAvailableGenres(genreNames)
    } catch (error) {
      console.error('Error loading genres:', error)
      setAvailableGenres(['メインディッシュ', 'サイドディッシュ', 'デザート', 'スープ'])
    }
  }

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    )
  }

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
        setTitle(data.title)
        setDescription(data.description || '')
        setIngredients(data.ingredients || '【○人前】\n• \n• \n• \n• ')
        setInstructions(data.instructions || '1. \n2. \n3. \n4. ')
        setSelectedGenres(data.genres || (data.genre ? [data.genre] : []))
        setMemo(data.memo || '')
        setReferenceUrl(data.reference_url || '')
      }
    } catch (error) {
      console.error('Error:', error)
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
    }
  }

  const handleImageDelete = () => {
    setImageFile(null)
    // 既存の画像も削除する場合は、レシピのimage_urlをnullに設定
    if (recipe) {
      setRecipe({ ...recipe, image_url: null })
    }
  }

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `recipe-images/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('recipes')
        .upload(filePath, file)

      if (uploadError) {
        console.error('Error uploading image:', uploadError)
        return null
      }

      const { data } = supabase.storage
        .from('recipes')
        .getPublicUrl(filePath)

      return data.publicUrl
    } catch (error) {
      console.error('Error uploading image:', error)
      return null
    }
  }

  const handleSave = async () => {
    if (!title.trim()) {
      alert('レシピ名を入力してください。')
      return
    }


    setSaving(true)

    try {
      let imageUrl = recipe?.image_url
      if (imageFile) {
        const newImageUrl = await uploadImage(imageFile)
        if (newImageUrl) {
          imageUrl = newImageUrl
        }
      } else if (!recipe?.image_url) {
        // 画像が削除された場合
        imageUrl = null
      }

      const { error } = await supabase
        .from('recipes')
        .update({
          title: title.trim(),
          description: description.trim(),
          ingredients: ingredients.trim(),
          instructions: instructions.trim(),
          genres: selectedGenres,
          memo: memo.trim(),
          reference_url: referenceUrl.trim() || null,
          image_url: imageUrl,
        })
        .eq('id', id)

      if (error) {
        console.error('Error updating recipe:', error)
        alert('レシピの更新に失敗しました。')
      } else {
        router.push(`/recipe/${id}`)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('レシピの更新に失敗しました。')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main className={styles.main}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}>
            <div className={styles.spinner}></div>
          </div>
          <div className={styles.loadingText}>レシピを読み込み中...</div>
          <div className={styles.loadingSubtext}>編集準備をしています</div>
        </div>
      </main>
    )
  }

  if (!recipe) {
    return (
      <main className={styles.main}>
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 256 256">
              <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z"></path>
            </svg>
          </div>
          <div className={styles.errorText}>レシピが見つかりませんでした</div>
          <div className={styles.errorSubtext}>指定されたレシピは存在しないか、削除されています</div>
          <Link href="/" className={styles.backToHomeButton}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
              <path d="M224,115.55V208a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-75.48.11-.11a16,16,0,0,1,21.53,0,1.14,1.14,0,0,0,.11.11l80,75.48A16,16,0,0,1,224,115.55Z"></path>
            </svg>
            ホームに戻る
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className={styles.main}>
      <div className={styles.formContainer}>
        <RecipeForm
          title={title}
          description={description}
          ingredients={ingredients}
          instructions={instructions}
          selectedGenres={selectedGenres}
          memo={memo}
          referenceUrl={referenceUrl}
          imageFile={imageFile}
          existingImageUrl={recipe?.image_url}
          availableGenres={availableGenres}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
          onIngredientsChange={setIngredients}
          onInstructionsChange={setInstructions}
          onGenreToggle={handleGenreToggle}
          onMemoChange={setMemo}
          onReferenceUrlChange={setReferenceUrl}
          onImageChange={setImageFile}
          onImageDelete={handleImageDelete}
        />
      </div>

      <div className={styles.actions}>
        <div className={styles.buttonsWrapper}>
          <Button
            variant="save"
            onClick={handleSave}
            disabled={saving}
          >
            <span>{saving ? '更新中...' : '更新'}</span>
          </Button>
        </div>
      </div>
    </main>
  )
}