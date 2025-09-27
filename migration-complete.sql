-- レシピアプリの完全マイグレーション
-- 既存のrecipesテーブルを新しい構造に移行し、新機能を追加

-- ================================================
-- Part 1: ジャンル配列構造への移行
-- ================================================

-- Step 1: 新しいgenres配列カラムを追加
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS genres TEXT[] DEFAULT '{"メインディッシュ"}';

-- Step 2: 既存のgenreカラムから新しいgenresカラムにデータを移行
UPDATE recipes
SET genres = ARRAY[genre::TEXT]
WHERE genre IS NOT NULL AND genres IS NULL;

-- Step 3: 古いgenreカラムを削除（安全のため、まずは残しておく）
-- ALTER TABLE recipes DROP COLUMN IF EXISTS genre;

-- Step 4: genresテーブルを作成
CREATE TABLE IF NOT EXISTS genres (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 5: genresテーブルのRLS有効化
ALTER TABLE genres ENABLE ROW LEVEL SECURITY;

-- Step 6: genresテーブルのポリシー作成
CREATE POLICY "Allow all access to genres" ON genres
  FOR ALL USING (true);

-- Step 7: updated_at自動更新トリガーを追加
CREATE TRIGGER update_genres_updated_at BEFORE UPDATE ON genres
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Step 8: デフォルトジャンルを挿入
INSERT INTO genres (name, is_default) VALUES
('メインディッシュ', true),
('サイドディッシュ', true),
('デザート', true),
('スープ', true),
('スナック', true),
('ドリンク', true)
ON CONFLICT (name) DO NOTHING;

-- Step 9: user_favoritesテーブルを作成（お気に入り機能用）
CREATE TABLE IF NOT EXISTS user_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, recipe_id)
);

-- Step 10: user_favoritesテーブルのRLS有効化
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- Step 11: user_favoritesテーブルのポリシー作成
CREATE POLICY "Allow all access to user_favorites" ON user_favorites
  FOR ALL USING (true);

-- ================================================
-- Part 2: 参考リンク機能の追加
-- ================================================

-- Step 12: reference_urlカラムを追加
ALTER TABLE recipes
ADD COLUMN IF NOT EXISTS reference_url TEXT;

-- 既存のデータに影響を与えないよう、デフォルト値はNULL
-- TEXT型なので、有効なURLまたはNULLが格納される

-- Step 13: サンプルデータに参考リンクを追加（オプション）
UPDATE recipes
SET reference_url = 'https://example.com/recipe/carbonara'
WHERE title = 'カルボナーラ' AND reference_url IS NULL;

UPDATE recipes
SET reference_url = 'https://example.com/recipe/arrabbiata'
WHERE title = 'アラビアータ' AND reference_url IS NULL;

-- ================================================
-- マイグレーション完了
-- ================================================
-- このマイグレーションにより以下が追加されます：
-- 1. ジャンル配列サポート (genres TEXT[])
-- 2. カスタムジャンル管理 (genresテーブル)
-- 3. お気に入り機能 (user_favoritesテーブル)
-- 4. 参考リンク機能 (reference_url TEXT)