import React from 'react'
import Input from '@/components/atoms/Input'
import Textarea from '@/components/atoms/Textarea'
import FormField from '@/components/molecules/FormField'
import GenreToggleGroup from '@/components/molecules/GenreToggleGroup'
import ImageUploadField from '@/components/molecules/ImageUploadField'
import Link from 'next/link'
import styles from './RecipeForm.module.scss'

interface RecipeFormProps {
  title: string
  description: string
  ingredients: string
  instructions: string
  selectedGenres: string[]
  memo: string
  referenceUrl: string
  imageFile: File | null
  existingImageUrl?: string | null
  availableGenres: string[]
  onTitleChange: (value: string) => void
  onDescriptionChange: (value: string) => void
  onIngredientsChange: (value: string) => void
  onInstructionsChange: (value: string) => void
  onGenreToggle: (genre: string) => void
  onMemoChange: (value: string) => void
  onReferenceUrlChange: (value: string) => void
  onImageChange: (file: File | null) => void
  onImageDelete: () => void
  className?: string
}

const RecipeForm: React.FC<RecipeFormProps> = ({
  title,
  description,
  ingredients,
  instructions,
  selectedGenres,
  memo,
  referenceUrl,
  imageFile,
  existingImageUrl,
  availableGenres,
  onTitleChange,
  onDescriptionChange,
  onIngredientsChange,
  onInstructionsChange,
  onGenreToggle,
  onMemoChange,
  onReferenceUrlChange,
  onImageChange,
  onImageDelete,
  className
}) => {
  const genreIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
      <path d="M243.31,136,144,36.69A15.86,15.86,0,0,0,132.69,32H40A8,8,0,0,0,32,40v92.69A15.86,15.86,0,0,0,36.69,144L136,243.31a16,16,0,0,0,22.63,0l84.68-84.68a16,16,0,0,0,0-22.63ZM84,96A12,12,0,1,1,96,84,12,12,0,0,1,84,96Z"></path>
    </svg>
  )

  const linkIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
      <path d="M137.54,186.36a8,8,0,0,1,0,11.31l-9.94,10A56,56,0,0,1,48.38,128.4L74.05,102.73a56,56,0,0,1,79.2,0,8,8,0,0,1-11.31,11.31,40,40,0,0,0-56.57,0L59.69,139.71a40,40,0,0,0,56.57,56.57l9.94-9.94A8,8,0,0,1,137.54,186.36Zm70.08-138a56,56,0,0,0-79.21,0l-9.94,9.95a8,8,0,0,0,11.32,11.31l9.94-9.94a40,40,0,0,1,56.57,56.56L170.63,141.9a40,40,0,0,1-56.57,0,8,8,0,0,0-11.31,11.32,56,56,0,0,0,79.2,0l25.67-25.67A56,56,0,0,0,207.62,48.38Z"></path>
    </svg>
  )

  return (
    <div className={`${styles.form} ${className || ''}`}>
      <FormField>
        <Input
          type="text"
          placeholder="レシピ名"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
        />
      </FormField>

      <FormField>
        <Textarea
          placeholder="説明"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
        />
      </FormField>

      <FormField>
        <Textarea
          placeholder="材料"
          value={ingredients}
          onChange={(e) => onIngredientsChange(e.target.value)}
        />
      </FormField>

      <FormField>
        <Textarea
          placeholder="手順"
          value={instructions}
          onChange={(e) => onInstructionsChange(e.target.value)}
        />
      </FormField>

      <FormField label="ジャンル（複数選択可）" icon={genreIcon}>
        {availableGenres.length > 0 ? (
          <GenreToggleGroup
            genres={availableGenres}
            selectedGenres={selectedGenres}
            onGenreToggle={onGenreToggle}
          />
        ) : (
          <div className={styles.noGenresMessage}>
            <p>ジャンルが設定されていません。</p>
            <Link href="/settings" className={styles.settingsLink}>
              設定画面でジャンルを追加
            </Link>
          </div>
        )}
      </FormField>

      <FormField>
        <Textarea
          placeholder="メモ（オプション）"
          value={memo}
          onChange={(e) => onMemoChange(e.target.value)}
        />
      </FormField>

      <FormField label="参考リンク（オプション）" icon={linkIcon}>
        <Input
          type="url"
          placeholder="https://example.com/recipe"
          value={referenceUrl}
          onChange={(e) => onReferenceUrlChange(e.target.value)}
        />
      </FormField>

      <FormField>
        <ImageUploadField
          imageFile={imageFile}
          imageUrl={existingImageUrl}
          onFileChange={onImageChange}
          onImageDelete={onImageDelete}
        />
      </FormField>
    </div>
  )
}

export default RecipeForm