import { supabase } from './supabase';

// Generate a simple user ID for demo purposes (in real app, use authentication)
export const getUserId = (): string => {
  let userId = localStorage.getItem('demo_user_id');
  if (!userId) {
    userId = `demo_user_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    localStorage.setItem('demo_user_id', userId);
  }
  return userId;
};

// Get user's favorite recipes
export const getUserFavorites = async (userId: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('user_favorites')
      .select('recipe_id')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching favorites:', error);
      return [];
    }

    return data?.map((item) => item.recipe_id) || [];
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

// Add recipe to favorites
export const addToFavorites = async (
  userId: string,
  recipeId: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_favorites')
      .insert({ user_id: userId, recipe_id: recipeId });

    if (error) {
      console.error('Error adding to favorites:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
};

// Remove recipe from favorites
export const removeFromFavorites = async (
  userId: string,
  recipeId: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', userId)
      .eq('recipe_id', recipeId);

    if (error) {
      console.error('Error removing from favorites:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
};

// Toggle favorite status
export const toggleFavorite = async (
  userId: string,
  recipeId: string,
  isFavorite: boolean
): Promise<boolean> => {
  if (isFavorite) {
    return await removeFromFavorites(userId, recipeId);
  } else {
    return await addToFavorites(userId, recipeId);
  }
};
