import { supabase } from '@/lib/supabase';

export const uploadImage = async (file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `recipe-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('recipes')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      return null;
    }

    const { data } = supabase.storage.from('recipes').getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
};

export const uploadImages = async (files: File[]): Promise<string[]> => {
  const imageUrls: string[] = [];
  for (const file of files) {
    const url = await uploadImage(file);
    if (url) {
      imageUrls.push(url);
    }
  }
  return imageUrls;
};
