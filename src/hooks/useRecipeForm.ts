import {  RecipeFormValues } from '@/types/recipe';
import { useState } from 'react';

export const useRecipeForm = (initialValues?: RecipeFormValues) => {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [description, setDescription] = useState(
    initialValues?.description || ''
  );
  const [ingredients, setIngredients] = useState(
    initialValues?.ingredients || '【○人前】\n• \n• \n• \n• '
  );
  const [instructions, setInstructions] = useState(
    initialValues?.instructions || '1. \n2. \n3. \n4. '
  );
  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    initialValues?.genres || []
  );
  const [memo, setMemo] = useState(initialValues?.memo || '');
  const [referenceUrl, setReferenceUrl] = useState(
    initialValues?.reference_url || ''
  );
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleImagesChange = (files: File[]) => {
    setImageFiles(files);
  };

  const handleImageDelete = (
    index: number,
    existingImageUrls?: string[],
    setExistingImageUrls?: (urls: string[]) => void
  ) => {
    if (
      existingImageUrls &&
      setExistingImageUrls &&
      index < existingImageUrls.length
    ) {
      setExistingImageUrls(existingImageUrls.filter((_, i) => i !== index));
    } else {
      const adjustedIndex = existingImageUrls
        ? index - existingImageUrls.length
        : index;
      setImageFiles((prev) => prev.filter((_, i) => i !== adjustedIndex));
    }
  };

  return {
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
    setImageFiles,
    handleGenreToggle,
    handleImagesChange,
    handleImageDelete,
  };
};
