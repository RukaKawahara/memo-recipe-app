'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { getGenreNames } from '@/lib/genres'
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
          <div className={styles.fieldLabel}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
              <path d="M243.31,136,144,36.69A15.86,15.86,0,0,0,132.69,32H40A8,8,0,0,0,32,40v92.69A15.86,15.86,0,0,0,36.69,144L136,243.31a16,16,0,0,0,22.63,0l84.68-84.68a16,16,0,0,0,0-22.63ZM84,96A12,12,0,1,1,96,84,12,12,0,0,1,84,96Z"></path>
            </svg>
            ジャンル（複数選択可）
          </div>
          {availableGenres.length > 0 ? (
            <div className={styles.genreGrid}>
              {availableGenres.map((genre) => (
                <button
                  key={genre}
                  type="button"
                  onClick={() => handleGenreToggle(genre)}
                  className={`${styles.genreButton} ${selectedGenres.includes(genre) ? styles.selected : ''}`}
                >
                  <div className={styles.checkbox}>
                    {selectedGenres.includes(genre) && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path>
                      </svg>
                    )}
                  </div>
                  <span>{genre}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className={styles.noGenresMessage}>
              <p>ジャンルが設定されていません。</p>
              <Link href="/settings" className={styles.settingsLink}>
                設定画面でジャンルを追加
              </Link>
            </div>
          )}
        </div>

        <div className={styles.field}>
          <label>
            <textarea
              placeholder="メモ（任意）"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className={styles.textarea}
            />
          </label>
        </div>

        <div className={styles.field}>
          <label className={styles.referenceUrlLabel}>
            <span className={styles.referenceUrlLabelText}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                <path d="M137.54,186.36a8,8,0,0,1,0,11.31l-9.94,10A56,56,0,0,1,48.38,128.4L74.05,102.73a56,56,0,0,1,79.2,0,8,8,0,0,1-11.31,11.31,40,40,0,0,0-56.57,0L59.69,139.71a40,40,0,0,0,56.57,56.57l9.94-9.94A8,8,0,0,1,137.54,186.36Zm70.08-138a56,56,0,0,0-79.21,0l-9.94,9.95a8,8,0,0,0,11.32,11.31l9.94-9.94a40,40,0,0,1,56.57,56.56L170.63,141.9a40,40,0,0,1-56.57,0,8,8,0,0,0-11.31,11.32,56,56,0,0,0,79.2,0l25.67-25.67A56,56,0,0,0,207.62,48.38Z"></path>
              </svg>
              参考リンク（任意）
            </span>
            <input
              type="url"
              placeholder="https://example.com/recipe"
              value={referenceUrl}
              onChange={(e) => setReferenceUrl(e.target.value)}
              className={styles.referenceUrlInput}
            />
          </label>
        </div>

        <div className={styles.field}>
          {!recipe.image_url && !imageFile && (
            <label htmlFor="image" className={styles.imageUpload}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6ZM12 1l3.5 3.5H19a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6.5a2 2 0 0 1 2-2h3.5L12 1ZM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z"/>
              </svg>
              <span>写真を追加</span>
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className={styles.fileInput}
              />
            </label>
          )}

          {(recipe.image_url && !imageFile) && (
            <div className={styles.imagePreview}>
              <img
                src={recipe.image_url}
                alt="現在の写真"
                className={styles.previewImage}
              />
              <button
                type="button"
                onClick={handleImageDelete}
                className={styles.deleteImageButton}
                aria-label="写真を削除"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
                </svg>
              </button>
            </div>
          )}

          {imageFile && (
            <div className={styles.imagePreview}>
              <img
                src={URL.createObjectURL(imageFile)}
                alt="プレビュー"
                className={styles.previewImage}
              />
              <button
                type="button"
                onClick={handleImageDelete}
                className={styles.deleteImageButton}
                aria-label="写真を削除"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
                </svg>
              </button>
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