export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string;
  instructions: string;
  image_url?: string | null;
  image_urls?: string[];
  genres: string[];
  memo?: string;
  reference_url?: string | null;
  created_at: string;
  updated_at: string;
  is_favorite?: boolean;
}

export interface UserFavorite {
  id: string;
  user_id: string;
  recipe_id: string;
  created_at: string;
}

// レシピを新規作成・挿入する際のデータ型
// `created_at`や`updated_at`はサーバーが自動で付与するため除外
export interface RecipeInsertData {
  title: string;
  description: string;
  ingredients: string;
  instructions: string;
  genres: string[];
  memo: string;
  reference_url: string | null;
  image_url: string | null;
  image_urls?: string[];
}
