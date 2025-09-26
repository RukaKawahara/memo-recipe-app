'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { getUserId, getUserFavorites, toggleFavorite } from '@/lib/favorites'
import { getGenreNames } from '@/lib/genres'
import type { Recipe } from '@/types/recipe'
import styles from './page.module.scss'

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('すべて')
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState<string[]>([])
  const [favoritesLoading, setFavoritesLoading] = useState<string | null>(null)
  const [genres, setGenres] = useState<string[]>(['すべて'])

  useEffect(() => {
    fetchRecipes()
    fetchUserFavorites()
    fetchGenres()
  }, [])

  const fetchGenres = async () => {
    try {
      const genreNames = await getGenreNames()
      setGenres(['すべて', ...genreNames])
    } catch (error) {
      console.error('Error fetching genres:', error)
    }
  }

  // const fetchRecipes = async () => {
  //   try {
  //     // ダミーデータでUIをテスト（実際のSupabase設定前）
  //     if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('dummy')) {
  //       setTimeout(() => {
  //         setRecipes([
  //           {
  //             id: '1',
  //             title: 'カルボナーラ',
  //             description: 'パスタとベーコンのクリームソース',
  //             ingredients: 'スパゲティ、ベーコン、卵、パルメザンチーズ',
  //             instructions: '1. パスタを茹でる\n2. ベーコンを炒める\n3. 卵とチーズを混ぜる',
  //             image_url: '',
  //             genre: 'メインディッシュ',
  //             memo: '濃厚で美味しいクラシックなパスタ',
  //             created_at: '2024-01-01T00:00:00Z',
  //             updated_at: '2024-01-01T00:00:00Z'
  //           },
  //           {
  //             id: '2',
  //             title: 'アラビアータ',
  //             description: 'スパイシーなトマトソースとパーメザンチーズ',
  //             ingredients: 'スパゲティ、トマト缶、ニンニク、唐辛子',
  //             instructions: '1. ニンニクを炒める\n2. トマト缶を加える\n3. パスタと和える',
  //             image_url: '',
  //             genre: 'メインディッシュ',
  //             memo: 'ピリッと辛くて食欲をそそります',
  //             created_at: '2024-01-02T00:00:00Z',
  //             updated_at: '2024-01-02T00:00:00Z'
  //           }
  //         ])
  //         setLoading(false)
  //       }, 500)
  //       return
  //     }

  //     const { data, error } = await supabase
  //       .from('recipes')
  //       .select('*')
  //       .order('created_at', { ascending: false })

  //     if (error) {
  //       console.error('Error fetching recipes:', error)
  //       // エラーの場合もローディングを終了
  //       setLoading(false)
  //     } else {
  //       setRecipes(data || [])
  //       setLoading(false)
  //     }
  //   } catch (error) {
  //     console.error('Error:', error)
  //     setLoading(false)
  //   }
  // }

  const fetchRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
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
      const userId = getUserId()
      const userFavorites = await getUserFavorites(userId)
      setFavorites(userFavorites)
    } catch (error) {
      console.error('Error fetching user favorites:', error)
    }
  }

  const handleFavoriteToggle = async (recipeId: string, e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation to recipe detail
    e.stopPropagation()

    setFavoritesLoading(recipeId)
    try {
      const userId = getUserId()
      const isFavorite = favorites.includes(recipeId)
      const success = await toggleFavorite(userId, recipeId, isFavorite)

      if (success) {
        setFavorites(prev =>
          isFavorite
            ? prev.filter(id => id !== recipeId)
            : [...prev, recipeId]
        )
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    } finally {
      setFavoritesLoading(null)
    }
  }

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.ingredients.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesGenre = selectedGenre === 'すべて' ||
      (recipe.genres && recipe.genres.includes(selectedGenre))

    return matchesSearch && matchesGenre
  })

  if (loading) {
    return <div className={styles.loading}>読み込み中...</div>
  }

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h2 className={styles.title}>レシピ</h2>
        <div className={styles.addButton}>
          <Link href="/create">
            <button>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path>
              </svg>
            </button>
          </Link>
        </div>
      </header>

      <div className={styles.searchContainer}>
        <label className={styles.searchBox}>
          <input
            type="text"
            placeholder="レシピを検索"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </label>
      </div>

      <div className={styles.filters}>
        <div className={styles.selectWrapper}>
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className={styles.genreSelect}
          >
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
          <div className={styles.selectIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
              <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
            </svg>
          </div>
        </div>
      </div>

      <div className={styles.recipeList}>
        {filteredRecipes.length === 0 ? (
          <div className={styles.empty}>
            <p>レシピが見つかりませんでした。</p>
            <Link href="/create" className={styles.createLink}>
              新しいレシピを作成する
            </Link>
          </div>
        ) : (
          filteredRecipes.map((recipe) => (
            <div key={recipe.id} className={styles.recipeItemWrapper}>
              <Link href={`/recipe/${recipe.id}`} className={styles.recipeItem}>
                <div className={styles.recipeImage}>
                  {recipe.image_url ? (
                    <img src={recipe.image_url} alt={recipe.title} />
                  ) : (
                    <div className={styles.placeholderImage}>🍝</div>
                  )}
                </div>
                <div className={styles.recipeInfo}>
                  <h3 className={styles.recipeTitle}>{recipe.title}</h3>
                  <p className={styles.recipeDescription}>{recipe.description}</p>
                  <div className={styles.recipeGenres}>
                    {(recipe.genres || [recipe.genre]).filter(Boolean).map((genre, index) => (
                      <span key={genre} className={styles.genreTag}>
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
              <button
                onClick={(e) => handleFavoriteToggle(recipe.id, e)}
                disabled={favoritesLoading === recipe.id}
                className={`${styles.favoriteButton} ${favorites.includes(recipe.id) ? styles.favorite : ''}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                  <path d={favorites.includes(recipe.id)
                    ? "M240,94c0,70-103.79,126.66-108.21,129a8,8,0,0,1-7.58,0C119.79,220.66,16,164,16,94A62.07,62.07,0,0,1,78,32c20.65,0,38.73,8.88,50,23.89C139.27,40.88,157.35,32,178,32A62.07,62.07,0,0,1,240,94Z"
                    : "M178,32c-20.65,0-38.73,8.88-50,23.89C116.73,40.88,98.65,32,78,32A62.07,62.07,0,0,0,16,94c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,220.66,240,164,240,94A62.07,62.07,0,0,0,178,32ZM128,206.8C109.74,196.16,32,147.69,32,94A46.06,46.06,0,0,1,78,48c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,147.61,146.24,196.15,128,206.8Z"
                  } />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </main>
  )
}