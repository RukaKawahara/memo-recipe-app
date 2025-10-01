import React from 'react';
import Input from '@/components/atoms/Input';
import Textarea from '@/components/atoms/Textarea';
import FormField from '@/components/molecules/FormField';
import GenreToggleGroup from '@/components/molecules/GenreToggleGroup';
import ImageUploadField from '@/components/molecules/ImageUploadField';
import Icon from '@/components/atoms/Icon';
import Link from 'next/link';
import styles from './RecipeForm.module.scss';

interface RecipeFormProps {
  title: string;
  description: string;
  ingredients: string;
  instructions: string;
  selectedGenres: string[];
  memo: string;
  referenceUrl: string;
  imageFiles: File[];
  existingImageUrls?: string[];
  availableGenres: string[];
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onIngredientsChange: (value: string) => void;
  onInstructionsChange: (value: string) => void;
  onGenreToggle: (genre: string) => void;
  onMemoChange: (value: string) => void;
  onReferenceUrlChange: (value: string) => void;
  onImagesChange: (files: File[]) => void;
  onImageDelete: (index: number) => void;
  className?: string;
}

const RecipeForm: React.FC<RecipeFormProps> = ({
  title,
  description,
  ingredients,
  instructions,
  selectedGenres,
  memo,
  referenceUrl,
  imageFiles,
  existingImageUrls,
  availableGenres,
  onTitleChange,
  onDescriptionChange,
  onIngredientsChange,
  onInstructionsChange,
  onGenreToggle,
  onMemoChange,
  onReferenceUrlChange,
  onImagesChange,
  onImageDelete,
  className,
}) => {
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

      <FormField label="ジャンル（複数選択可）" icon={<Icon name="tag" size={16} />}>
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

      <FormField label="参考リンク（オプション）" icon={<Icon name="link" size={16} />}>
        <Input
          type="url"
          placeholder="https://example.com/recipe"
          value={referenceUrl}
          onChange={(e) => onReferenceUrlChange(e.target.value)}
        />
      </FormField>

      <FormField>
        <ImageUploadField
          imageFiles={imageFiles}
          imageUrls={existingImageUrls}
          onFilesChange={onImagesChange}
          onImageDelete={onImageDelete}
          maxImages={5}
        />
      </FormField>
    </div>
  );
};

export default RecipeForm;
