import { GENRE_LIMIT } from '@/constants';
import { supabase } from './supabase';

export interface Genre {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

// デフォルトジャンル（フォールバック用）
const DEFAULT_GENRES = [
  'メインディッシュ',
  'サイドディッシュ',
  'デザート',
  'スープ',
  'スナック',
  'ドリンク',
];

// すべてのジャンルを取得
export const getGenres = async (): Promise<Genre[]> => {
  try {
    const { data, error } = await supabase
      .from('genres')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.warn('Genres table not found or error fetching genres:', error);
    }
    return data || [];

  } catch (error) {
    console.error('Error fetching genres:', error);
  }
};

// ジャンル名のリストを取得
export const getGenreNames = async (): Promise<string[]> => {
  const genres = await getGenres();
  return genres.map((genre) => genre.name);
};

// ジャンル上限チェック用のヘルパー関数
export const isGenreLimitReached = async (): Promise<boolean> => {
  const existingGenres = await getGenres();
  return existingGenres.length >= GENRE_LIMIT;
};

// 残り追加可能なジャンル数を取得
export const getRemainingGenreCount = async (): Promise<number> => {
  const existingGenres = await getGenres();
  return Math.max(0, GENRE_LIMIT - existingGenres.length);
};

// ジャンルを追加
export const addGenre = async (name: string): Promise<boolean> => {
  try {
    const trimmedName = name.trim();
    if (!trimmedName) {
      console.error('Genre name cannot be empty');
      return false;
    }

    // まず既存のジャンルをチェック
    const existingGenres = await getGenres();

    // ジャンル数の上限チェック
    if (existingGenres.length >= GENRE_LIMIT) {
      console.error(
        `Genre limit reached. Maximum ${GENRE_LIMIT} genres allowed.`
      );
      alert(
        `ジャンルの登録上限（${GENRE_LIMIT}個）に達しています。これ以上ジャンルを追加できません。`
      );
      return false;
    }

    const genreExists = existingGenres.some(
      (genre) => genre.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (genreExists) {
      console.error('Genre already exists:', trimmedName);
      return false;
    }

    const { error } = await supabase
      .from('genres')
      .insert({ name: trimmedName });

    if (error) {
      console.error('Error adding genre:', error);
      // テーブルが存在しない場合の処理
      if (error.message?.includes('relation "genres" does not exist')) {
        console.log(
          'Genres table does not exist. Please run the database migration.'
        );
        alert(
          'ジャンルテーブルが存在しません。データベースの設定を確認してください。'
        );
      }
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
};

// ジャンルを更新
export const updateGenre = async (
  id: string,
  name: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('genres')
      .update({ name: name.trim() })
      .eq('id', id);

    if (error) {
      console.error('Error updating genre:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
};

// ジャンルを削除
export const deleteGenre = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase.from('genres').delete().eq('id', id);

    if (error) {
      console.error('Error deleting genre:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
};
