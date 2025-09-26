import { supabase } from './supabase'

export interface Genre {
  id: string
  name: string
  created_at: string
  updated_at: string
}

// デフォルトジャンル（フォールバック用）
const DEFAULT_GENRES = [
  'メインディッシュ',
  'サイドディッシュ',
  'デザート',
  'スープ',
  'スナック',
  'ドリンク'
]

// すべてのジャンルを取得
export const getGenres = async (): Promise<Genre[]> => {
  try {
    const { data, error } = await supabase
      .from('genres')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.warn('Genres table not found or error fetching genres:', error)
      console.log('Using default genres as fallback')

      // デフォルトジャンルを返す（テーブルがない場合の対応）
      return DEFAULT_GENRES.map((name, index) => ({
        id: `default-${index}`,
        name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }))
    }

    // データが空の場合は空配列を返す（デフォルトジャンルを自動作成しない）
    return data || []
  } catch (error) {
    console.error('Error fetching genres:', error)
    // フォールバックとしてデフォルトジャンルを返す（テーブルアクセスエラーの場合のみ）
    return DEFAULT_GENRES.map((name, index) => ({
      id: `default-${index}`,
      name,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }))
  }
}

// デフォルトジャンルを初期化
const initializeDefaultGenres = async () => {
  try {
    const genresToInsert = DEFAULT_GENRES.map(name => ({
      name
    }))

    const { error } = await supabase
      .from('genres')
      .insert(genresToInsert)

    if (error) {
      console.error('Error initializing default genres:', error)
    }
  } catch (error) {
    console.error('Error in initializeDefaultGenres:', error)
  }
}

// ジャンル名のリストを取得
export const getGenreNames = async (): Promise<string[]> => {
  const genres = await getGenres()
  return genres.map(genre => genre.name)
}

// ジャンルを追加
export const addGenre = async (name: string): Promise<boolean> => {
  try {
    const trimmedName = name.trim()
    if (!trimmedName) {
      console.error('Genre name cannot be empty')
      return false
    }

    // まず既存のジャンルをチェック
    const existingGenres = await getGenres()
    const genreExists = existingGenres.some(genre =>
      genre.name.toLowerCase() === trimmedName.toLowerCase()
    )

    if (genreExists) {
      console.error('Genre already exists:', trimmedName)
      return false
    }

    const { error } = await supabase
      .from('genres')
      .insert({ name: trimmedName })

    if (error) {
      console.error('Error adding genre:', error)
      // テーブルが存在しない場合の処理
      if (error.message?.includes('relation "genres" does not exist')) {
        console.log('Genres table does not exist. Please run the database migration.')
        alert('ジャンルテーブルが存在しません。データベースの設定を確認してください。')
      }
      return false
    }

    return true
  } catch (error) {
    console.error('Error:', error)
    return false
  }
}

// ジャンルを更新
export const updateGenre = async (id: string, name: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('genres')
      .update({ name: name.trim() })
      .eq('id', id)

    if (error) {
      console.error('Error updating genre:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error:', error)
    return false
  }
}

// ジャンルを削除
export const deleteGenre = async (id: string): Promise<boolean> => {
  try {
    // フォールバック用のデフォルトジャンル（IDがdefault-で始まる）は削除不可
    if (id.startsWith('default-')) {
      console.warn('Cannot delete fallback default genre:', id)
      return false
    }

    const { error } = await supabase
      .from('genres')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting genre:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error:', error)
    return false
  }
}