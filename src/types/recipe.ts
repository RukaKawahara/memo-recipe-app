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
}