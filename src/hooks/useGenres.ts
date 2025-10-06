import { useState, useEffect } from 'react';
import { getGenreNames } from '@/lib/genres';

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
    }
  };

  return { availableGenres };
};
