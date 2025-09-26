'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Recipe } from '@/types/recipe'
import styles from './page.module.scss'

export default function EditRecipe({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string>('')
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [ingredients, setIngredients] = useState('')
  const [instructions, setInstructions] = useState('')
  const [genre, setGenre] = useState('メインディッシュ')
  const [memo, setMemo] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  const router = useRouter()

  const genres = ['メインディッシュ', 'サイドディッシュ', 'デザート', 'スープ']

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
        setTitle(data.title)
        setDescription(data.description)
        setIngredients(data.ingredients)
        setInstructions(data.instructions)
        setGenre(data.genre)
        setMemo(data.memo || '')
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
      }

      const { error } = await supabase
        .from('recipes')
        .update({
          title: title.trim(),
          description: description.trim(),
          ingredients: ingredients.trim(),
          instructions: instructions.trim(),
          genre,
          memo: memo.trim(),
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
    return <div className={styles.loading}>読み込み中...</div>
  }

  if (!recipe) {
    return <div className={styles.error}>レシピが見つかりませんでした。</div>
  }

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <Link href={`/recipe/${id}`} className={styles.closeButton}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
            <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
          </svg>
        </Link>
        <h2 className={styles.title}>レシピ編集</h2>
      </header>

      <div className={styles.form}>
        <div className={styles.field}>
          <label>
            <input
              type="text"
              placeholder="レシピ名"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.input}
            />
          </label>
        </div>

        <div className={styles.field}>
          <label>
            <textarea
              placeholder="説明"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={styles.textarea}
            />
          </label>
        </div>

        <div className={styles.field}>
          <label>
            <textarea
              placeholder="材料"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              className={styles.textarea}
            />
          </label>
        </div>

        <div className={styles.field}>
          <label>
            <textarea
              placeholder="手順"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className={styles.textarea}
            />
          </label>
        </div>

        <div className={styles.field}>
          <label htmlFor="image" className={styles.imageUpload}>
            <span>写真を変更</span>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className={styles.fileInput}
            />
          </label>

          {(recipe.image_url && !imageFile) && (
            <div className={styles.imagePreview}>
              <img
                src={recipe.image_url}
                alt="現在の写真"
                className={styles.previewImage}
              />
            </div>
          )}

          {imageFile && (
            <div className={styles.imagePreview}>
              <img
                src={URL.createObjectURL(imageFile)}
                alt="プレビュー"
                className={styles.previewImage}
              />
            </div>
          )}
        </div>
      </div>

      <div className={styles.actions}>
        <div className={styles.buttonsWrapper}>
          <button
            onClick={handleSave}
            disabled={saving}
            className={styles.updateButton}
          >
            <span>{saving ? '更新中...' : '更新'}</span>
          </button>
        </div>
      </div>
    </main>
  )
}