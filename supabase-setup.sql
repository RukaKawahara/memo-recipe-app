-- レシピアプリのためのSupabaseデータベース設定

-- recipesテーブルの作成
CREATE TABLE IF NOT EXISTS recipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  ingredients TEXT NOT NULL,
  instructions TEXT NOT NULL,
  image_url TEXT,
  genres TEXT[] NOT NULL DEFAULT '{"メインディッシュ"}',
  memo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS（Row Level Security）の有効化
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- すべてのユーザーがrecipesテーブルを読み書きできるポリシーを作成
-- 注意: 本番環境では認証ユーザーのみに制限することを推奨
CREATE POLICY "Allow all access to recipes" ON recipes
  FOR ALL USING (true);

-- updated_atを自動更新するトリガー関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- recipesテーブルにupdated_at自動更新トリガーを追加
CREATE TRIGGER update_recipes_updated_at BEFORE UPDATE ON recipes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ストレージバケットの作成（画像保存用）
INSERT INTO storage.buckets (id, name, public) VALUES ('recipes', 'recipes', true);

-- ストレージポリシーの作成（すべてのユーザーが画像をアップロード・閲覧可能）
CREATE POLICY "Allow all access to recipe images" ON storage.objects
  FOR ALL USING (bucket_id = 'recipes');

-- user_favoritesテーブルの作成（お気に入り機能用）
CREATE TABLE IF NOT EXISTS user_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, recipe_id)
);

-- user_favoritesテーブルのRLS有効化
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- すべてのユーザーがuser_favoritesテーブルを読み書きできるポリシーを作成
CREATE POLICY "Allow all access to user_favorites" ON user_favorites
  FOR ALL USING (true);

-- genresテーブルの作成（カスタムジャンル管理用）
CREATE TABLE IF NOT EXISTS genres (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- genresテーブルのRLS有効化
ALTER TABLE genres ENABLE ROW LEVEL SECURITY;

-- すべてのユーザーがgenresテーブルを読み書きできるポリシーを作成
CREATE POLICY "Allow all access to genres" ON genres
  FOR ALL USING (true);

-- genresテーブルにupdated_at自動更新トリガーを追加
CREATE TRIGGER update_genres_updated_at BEFORE UPDATE ON genres
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- デフォルトジャンルの挿入
INSERT INTO genres (name, is_default) VALUES
('メインディッシュ', true),
('サイドディッシュ', true),
('デザート', true),
('スープ', true),
('スナック', true),
('ドリンク', true);

-- サンプルデータの挿入（オプション）
INSERT INTO recipes (title, description, ingredients, instructions, genres, memo) VALUES
(
  'カルボナーラ',
  'パスタとベーコンのクリームソース',
  'スパゲティ 500g
ベーコン 150g
卵 2個
パルメザンチーズ 適量
塩・黒胡椒 適量',
  'スパゲティを大量の沸騰した塩水で茹でる。
フライパンでベーコンを炒める。
ボウルで卵とパルメザンチーズを混ぜる。
茹で上がったパスタを加えてよく混ぜる。
チーズをかけて完成。',
  '{"メインディッシュ"}',
  'クリーミーで美味しいパスタ料理です。'
),
(
  'アラビアータ',
  'スパイシーなトマトソースとパーメザンチーズ',
  'スパゲティ 400g
トマト缶 400g
ニンニク 3片
唐辛子 2本
オリーブオイル 大さじ3
塩・黒胡椒 適量
パーメザンチーズ 適量',
  'スパゲティを茹でる。
フライパンにオリーブオイル、ニンニク、唐辛子を入れて弱火で炒める。
トマト缶を加えて煮詰める。
茹で上がったスパゲティを加えて和える。
パーメザンチーズをかけて完成。',
  '{"メインディッシュ"}',
  'ピリ辛で食欲をそそります！'
),
(
  'プリマヴェーラ',
  'パスタとベジタブルのプリマヴェーラソース',
  'ペンネ 300g
ズッキーニ 1本
パプリカ 1個
ブロッコリー 100g
オリーブオイル 大さじ2
ニンニク 2片
塩・胡椒 適量
パルメザンチーズ 適量',
  '野菜を一口大に切る。
ペンネを茹でる。
フライパンで野菜を炒める。
茹で上がったペンネを加えて混ぜる。
チーズをかけて完成。',
  '{"メインディッシュ", "サイドディッシュ"}',
  '野菜たっぷりでヘルシー！'
);