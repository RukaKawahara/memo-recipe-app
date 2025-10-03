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
