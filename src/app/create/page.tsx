'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { uploadImages } from '@/lib/storage';
import { useGenres } from '@/hooks/useGenres';
import { useRecipeForm } from '@/hooks/useRecipeForm';
import Button from '@/components/atoms/Button';
import RecipeForm from '@/components/organisms/RecipeForm';
import FormContainer from '@/components/templates/FormContainer';
import FormActions from '@/components/templates/FormActions';
import { RecipeInsertData } from '@/types/recipe';

export default function CreateRecipe() {
  const [saving, setSaving] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
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
    memo,
    setMemo,
    referenceUrl,
    setReferenceUrl,
    imageFiles,
    handleGenreToggle,
    handleImagesChange,
    handleImageDelete,
  } = useRecipeForm();

  const handleSave = async (asDraft: boolean = false) => {
    if (!title.trim()) {
      alert('レシピ名を入力してください。');
      return;
    }

    setSaving(true);
    setIsDraft(asDraft);

    try {
      const imageUrls = await uploadImages(imageFiles);

      // Prepare insert data
      const insertData: RecipeInsertData = {
        title: title.trim(),
        description: description.trim(),
        ingredients: ingredients.trim(),
        instructions: instructions.trim(),
        genres: selectedGenres,
        memo: memo.trim(),
        reference_url: referenceUrl.trim() || null,
        image_url: imageUrls.length > 0 ? imageUrls[0] : null,
      };

      // Only add image_urls if there are images
      if (imageUrls.length > 0) {
        insertData.image_urls = imageUrls;
      }

      const { error } = await supabase
        .from('recipes')
        .insert([insertData])
        .select();

      if (error) {
        console.error('Error saving recipe:', error);
        alert('レシピの保存に失敗しました。');
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('レシピの保存に失敗しました。');
    } finally {
      setSaving(false);
      setIsDraft(false);
    }
  };

  return (
    <main>
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
        <Button
          variant="save"
          onClick={() => handleSave(false)}
          disabled={saving}
        >
          <span>{saving && !isDraft ? '保存中...' : '保存'}</span>
        </Button>
      </FormActions>
    </main>
  );
}
