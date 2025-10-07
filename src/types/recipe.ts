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

// レシピをDBに新規作成・挿入する際のデータ型
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

// フォーム入力時に使われる型
export interface RecipeFormValues {
  title: string;
  description: string;
  ingredients: string;
  instructions: string;
  genres: string[];
  memo: string;
  reference_url: string | null;
}

export interface UserFavorite {
  id: string;
  user_id: string;
  recipe_id: string;
  created_at: string;
}