'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { getUserId, getUserFavorites, toggleFavorite } from '@/lib/favorites';
import { getGenreNames } from '@/lib/genres';
import type { Recipe } from '@/types/recipe';
import SearchAndFilters from '@/components/organisms/SearchAndFilters';
import RecipeList from '@/components/organisms/RecipeList';
import Pagination from '@/components/organisms/Pagination';
import LoadingState from '@/components/molecules/LoadingState';
import styles from './page.module.scss';

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('すべて');
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoritesLoading, setFavoritesLoading] = useState<string | null>(null);
  const [genres, setGenres] = useState<string[]>(['すべて']);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchRecipes();
    fetchUserFavorites();
  }, []);

  useEffect(() => {
    fetchGenres();
  }, []);

  // ページがフォーカスされた時にジャンルを再読み込み（設定画面から戻った時など）
  useEffect(() => {
    const handleFocus = () => {
      fetchGenres();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const fetchGenres = async () => {
    try {
      // ジャンル管理で登録されているジャンルのみを取得
      const managedGenres = await getGenreNames();
      setGenres(['すべて', ...managedGenres.sort()]);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const fetchRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('last_viewed_at', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching recipes:', error);
      } else {
        setRecipes(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserFavorites = async () => {
    try {
      const userId = getUserId();
      const userFavorites = await getUserFavorites(userId);
      setFavorites(userFavorites);
    } catch (error) {
      console.error('Error fetching user favorites:', error);
    }
  };

  const handleFavoriteToggle = async (
    recipeId: string,
    e: React.MouseEvent
  ) => {
    e.preventDefault(); // Prevent navigation to recipe detail
    e.stopPropagation();

    setFavoritesLoading(recipeId);
    try {
      const userId = getUserId();
      const isFavorite = favorites.includes(recipeId);
      const success = await toggleFavorite(userId, recipeId, isFavorite);

      if (success) {
        setFavorites((prev) =>
          isFavorite
            ? prev.filter((id) => id !== recipeId)
            : [...prev, recipeId]
        );
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setFavoritesLoading(null);
    }
  };

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch =
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.ingredients.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGenre =
      selectedGenre === 'すべて' ||
      (recipe.genres && recipe.genres.includes(selectedGenre));

    return matchesSearch && matchesGenre;
  });

  // ページネーション計算
  const totalPages = Math.ceil(filteredRecipes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRecipes = filteredRecipes.slice(startIndex, endIndex);

  // 検索やフィルタが変更された時にページを1に戻す
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedGenre]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <main className={styles.main}>
        <LoadingState title="レシピを読み込み中..." />
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <SearchAndFilters
        searchTerm={searchTerm}
        selectedGenre={selectedGenre}
        genres={genres}
        onSearchChange={setSearchTerm}
        onGenreChange={setSelectedGenre}
        className={styles.searchAndFilters}
      />

      <RecipeList
        recipes={currentRecipes}
        favorites={favorites}
        favoritesLoading={favoritesLoading}
        onFavoriteToggle={handleFavoriteToggle}
        loading={loading}
        className={styles.recipeList}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        startIndex={startIndex}
        endIndex={endIndex}
        totalItems={filteredRecipes.length}
      />
    </main>
  );
}
