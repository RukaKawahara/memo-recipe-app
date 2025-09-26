import { supabase } from './supabase'

export interface Genre {
  id: string
  name: string
  is_default: boolean
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
    // まずテーブルが存在するかチェック
    const { data, error } = await supabase
      .from('genres')
      .select('*')
      .order('is_default', { ascending: false })
      .order('name', { ascending: true })

    if (error) {
      console.warn('Genres table not found or error fetching genres:', error)
      console.log('Using default genres as fallback')

      // デフォルトジャンルを返す（テーブルがない場合の対応）
      return DEFAULT_GENRES.map((name, index) => ({
        id: `default-${index}`,
        name,
        is_default: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }))
    }

    // データが空の場合もデフォルトジャンルを初期化
    if (!data || data.length === 0) {
      console.log('No genres found, initializing default genres')
      await initializeDefaultGenres()
      return DEFAULT_GENRES.map((name, index) => ({
        id: `default-${index}`,
        name,
        is_default: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }))
    }

    return data
  } catch (error) {
    console.error('Error fetching genres:', error)
    // フォールバックとしてデフォルトジャンルを返す
    return DEFAULT_GENRES.map((name, index) => ({
      id: `default-${index}`,
      name,
      is_default: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }))
  }
}

// デフォルトジャンルを初期化
const initializeDefaultGenres = async () => {
  try {
    const genresToInsert = DEFAULT_GENRES.map(name => ({
      name,
      is_default: true
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
      .insert({ name: trimmedName, is_default: false })

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

// ジャンルを削除（デフォルトジャンルは削除不可）
export const deleteGenre = async (id: string): Promise<boolean> => {
  try {
    // デフォルトジャンルかどうかを確認
    const { data: genre, error: fetchError } = await supabase
      .from('genres')
      .select('is_default')
      .eq('id', id)
      .single()

    if (fetchError) {
      console.error('Error fetching genre:', fetchError)
      return false
    }

    if (genre.is_default) {
      console.error('Cannot delete default genre')
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