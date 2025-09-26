export interface Recipe {
  id: string
  title: string
  description: string
  ingredients: string
  instructions: string
  image_url?: string
  genre: string
  memo?: string
  created_at: string
  updated_at: string
  is_favorite?: boolean
}

export interface UserFavorite {
  id: string
  user_id: string
  recipe_id: string
  created_at: string
}