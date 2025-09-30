import { useState, useEffect } from 'react';
import { getGenreNames } from '@/lib/genres';

const DEFAULT_GENRES = [
  'メインディッシュ',
  'サイドディッシュ',
  'デザート',
  'スープ',
];

export const useGenres = () => {
  const [availableGenres, setAvailableGenres] = useState<string[]>([]);

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      const genreNames = await getGenreNames();
      setAvailableGenres(genreNames);
    } catch (error) {
      console.error('Error fetching genres:', error);
      setAvailableGenres(DEFAULT_GENRES);
    }
  };

  return { availableGenres };
};
