'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { uploadImages } from '@/lib/storage';
import { useGenres } from '@/hooks/useGenres';
import { useRecipeForm } from '@/hooks/useRecipeForm';
import Button from '@/components/atoms/Button';
import RecipeForm from '@/components/organisms/RecipeForm';
import LoadingState from '@/components/molecules/LoadingState';
import FormContainer from '@/components/templates/FormContainer';
import FormActions from '@/components/templates/FormActions';
import type { Recipe, RecipeInsertData } from '@/types/recipe';
import styles from './page.module.scss';

export default function EditRecipe({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [id, setId] = useState<string>('');
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const { availableGenres } = useGenres();
  const {
    title,
    setTitle,
    description,
    setDescription,
    ingredients,
    setIngredients,
    instructions,
    setInstructions,
    selectedGenres,
    setSelectedGenres,
    memo,
    setMemo,
    referenceUrl,
    setReferenceUrl,
    imageFiles,
    handleGenreToggle,
    handleImagesChange,
    handleImageDelete: baseHandleImageDelete,
  } = useRecipeForm();

  useEffect(() => {
    params.then((resolvedParams) => {
      setId(resolvedParams.id);
    });
  }, [params]);

  useEffect(() => {
    if (id) {
      fetchRecipe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchRecipe = async () => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching recipe:', error);
        router.push('/');
      } else {
        setRecipe(data);
        setTitle(data.title);
        setDescription(data.description || '');
        setIngredients(data.ingredients || '【○人前】\n• \n• \n• \n• ');
        setInstructions(data.instructions || '1. \n2. \n3. \n4. ');
        setSelectedGenres(data.genres || (data.genre ? [data.genre] : []));
        setMemo(data.memo || '');
        setReferenceUrl(data.reference_url || '');
        setExistingImageUrls(
          data.image_urls || (data.image_url ? [data.image_url] : [])
        );
      }
    } catch (error) {
      console.error('Error:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const handleImageDelete = (index: number) => {
    baseHandleImageDelete(index, existingImageUrls, setExistingImageUrls);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert('レシピ名を入力してください。');
      return;
    }

    setSaving(true);

    try {
      const newImageUrls = await uploadImages(imageFiles);
      const allImageUrls = [...existingImageUrls, ...newImageUrls];

      // Prepare update data
      const updateData: RecipeInsertData = {
        title: title.trim(),
        description: description.trim(),
        ingredients: ingredients.trim(),
        instructions: instructions.trim(),
        genres: selectedGenres,
        memo: memo.trim(),
        reference_url: referenceUrl.trim() || null,
        image_url: allImageUrls.length > 0 ? allImageUrls[0] : null,
      };

      // Only add image_urls if there are multiple images
      if (allImageUrls.length > 0) {
        updateData.image_urls = allImageUrls;
      }

      const { error } = await supabase
        .from('recipes')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Error updating recipe:', error);
        alert('レシピの更新に失敗しました。');
      } else {
        router.push(`/recipe/${id}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('レシピの更新に失敗しました。');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className={styles.main}>
        <LoadingState
          title="レシピを読み込み中..."
          subtitle="編集準備をしています"
        />
      </main>
    );
  }

  if (!recipe) {
    return (
      <main className={styles.main}>
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z"></path>
            </svg>
          </div>
          <div className={styles.errorText}>レシピが見つかりませんでした</div>
          <div className={styles.errorSubtext}>
            指定されたレシピは存在しないか、削除されています
          </div>
          <Link href="/" className={styles.backToHomeButton}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path d="M224,115.55V208a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-75.48.11-.11a16,16,0,0,1,21.53,0,1.14,1.14,0,0,0,.11.11l80,75.48A16,16,0,0,1,224,115.55Z"></path>
            </svg>
            ホームに戻る
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <FormContainer>
        <RecipeForm
          title={title}
          description={description}
          ingredients={ingredients}
          instructions={instructions}
          selectedGenres={selectedGenres}
          memo={memo}
          referenceUrl={referenceUrl}
          imageFiles={imageFiles}
          existingImageUrls={existingImageUrls}
          availableGenres={availableGenres}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
          onIngredientsChange={setIngredients}
          onInstructionsChange={setInstructions}
          onGenreToggle={handleGenreToggle}
          onMemoChange={setMemo}
          onReferenceUrlChange={setReferenceUrl}
          onImagesChange={handleImagesChange}
          onImageDelete={handleImageDelete}
        />
      </FormContainer>

      <FormActions>
        <Button variant="save" onClick={handleSave} disabled={saving}>
          <span>{saving ? '更新中...' : '更新'}</span>
        </Button>
      </FormActions>
    </main>
  );
}
