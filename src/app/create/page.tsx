'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { getGenreNames } from '@/lib/genres'
import styles from './page.module.scss'

export default function CreateRecipe() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [ingredients, setIngredients] = useState('【○人前】\n• \n• \n• \n• ')
  const [instructions, setInstructions] = useState('1. \n2. \n3. \n4. ')
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [memo, setMemo] = useState('')
  const [referenceUrl, setReferenceUrl] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [isDraft, setIsDraft] = useState(false)
  const [availableGenres, setAvailableGenres] = useState<string[]>([])

  const router = useRouter()

  useEffect(() => {
    fetchGenres()
  }, [])

  const fetchGenres = async () => {
    try {
      const genreNames = await getGenreNames()
      setAvailableGenres(genreNames)
    } catch (error) {
      console.error('Error fetching genres:', error)
      // フォールバック
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
    }
  }

  const handleImageDelete = () => {
    setImageFile(null)
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

  const handleSave = async (asDraft: boolean = false) => {
    if (!title.trim()) {
      alert('レシピ名を入力してください。')
      return
    }


    setSaving(true)
    setIsDraft(asDraft)

    try {
      let imageUrl = null
      if (imageFile) {
        imageUrl = await uploadImage(imageFile)
      }

      const { data, error } = await supabase
        .from('recipes')
        .insert([
          {
            title: title.trim(),
            description: description.trim(),
            ingredients: ingredients.trim(),
            instructions: instructions.trim(),
            genres: selectedGenres,
            memo: memo.trim(),
            reference_url: referenceUrl.trim() || null,
            image_url: imageUrl,
          }
        ])
        .select()

      if (error) {
        console.error('Error saving recipe:', error)
        alert('レシピの保存に失敗しました。')
      } else {
        router.push('/')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('レシピの保存に失敗しました。')
    } finally {
      setSaving(false)
      setIsDraft(false)
    }
  }

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <Link href="/" className={styles.closeButton}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
            <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
          </svg>
        </Link>
        <h2 className={styles.title}>新規レシピ</h2>
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
              placeholder="メモ（オプション）"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className={styles.textarea}
            />
          </label>
        </div>

        <div className={styles.field}>
          <label>
            <input
              type="url"
              placeholder="参考リンク（オプション）"
              value={referenceUrl}
              onChange={(e) => setReferenceUrl(e.target.value)}
              className={styles.input}
            />
          </label>
        </div>

        <div className={styles.field}>
          {!imageFile && (
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
            onClick={() => handleSave(false)}
            disabled={saving}
            className={styles.saveButton}
          >
            <span>{saving && !isDraft ? '保存中...' : '保存'}</span>
          </button>
        </div>
      </div>
    </main>
  )
}