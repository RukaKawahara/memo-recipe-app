import { createClient } from '@supabase/supabase-js'
import type { Recipe } from '@/types/recipe'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Database = {
  public: {
    Tables: {
      recipes: {
        Row: Recipe
        Insert: Omit<Recipe, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Recipe, 'id' | 'created_at' | 'updated_at'>>
      }
    }
  }
}