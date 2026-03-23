const STORAGE_KEY = 'user_favorites';

const getFavoritesFromStorage = (): string[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveFavoritesToStorage = (favorites: string[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
};

export const getUserFavorites = async (): Promise<string[]> => {
  return getFavoritesFromStorage();
};

export const addToFavorites = async (recipeId: string): Promise<boolean> => {
  const favorites = getFavoritesFromStorage();
  if (!favorites.includes(recipeId)) {
    saveFavoritesToStorage([...favorites, recipeId]);
  }
  return true;
};

export const removeFromFavorites = async (recipeId: string): Promise<boolean> => {
  const favorites = getFavoritesFromStorage();
  saveFavoritesToStorage(favorites.filter((id) => id !== recipeId));
  return true;
};

export const toggleFavorite = async (
  recipeId: string,
  isFavorite: boolean
): Promise<boolean> => {
  if (isFavorite) {
    return removeFromFavorites(recipeId);
  } else {
    return addToFavorites(recipeId);
  }
};
