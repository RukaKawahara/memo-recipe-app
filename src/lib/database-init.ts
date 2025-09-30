import { supabase } from './supabase';

// データベースの初期化
export const initializeDatabase = async (): Promise<boolean> => {
  try {
    // genresテーブルが存在するかチェック
    const { error } = await supabase.from('genres').select('count').limit(1);

    if (!error) {
      console.log('Genres table already exists');
      return true;
    }

    // テーブルが存在しない場合は手動で初期データを作成
    console.warn('Genres table does not exist. Using fallback initialization.');
    console.warn(
      'Please run the SQL migration script to create the proper database structure.'
    );

    return false;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
};

// デフォルトジャンルのみでの動作用の関数
export const getDefaultGenres = () => {
  return [
    { id: 'default-0', name: 'メインディッシュ', is_default: true },
    { id: 'default-1', name: 'サイドディッシュ', is_default: true },
    { id: 'default-2', name: 'デザート', is_default: true },
    { id: 'default-3', name: 'スープ', is_default: true },
    { id: 'default-4', name: 'スナック', is_default: true },
    { id: 'default-5', name: 'ドリンク', is_default: true },
  ];
};
