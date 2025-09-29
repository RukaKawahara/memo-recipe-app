'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getGenreNames } from '@/lib/genres'
import Button from '@/components/atoms/Button'
import RecipeForm from '@/components/organisms/RecipeForm'
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
            onClick={() => handleSave(false)}
            disabled={saving}
          >
            <span>{saving && !isDraft ? '保存中...' : '保存'}</span>
          </Button>
        </div>
      </div>
    </main>
  )
}