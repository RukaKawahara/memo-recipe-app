-- レシピアプリのためのSupabaseデータベース設定

-- recipesテーブルの作成
CREATE TABLE IF NOT EXISTS recipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  ingredients TEXT NOT NULL,
  instructions TEXT NOT NULL,
  image_url TEXT,
  genre TEXT NOT NULL DEFAULT 'メインディッシュ',
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

-- サンプルデータの挿入（オプション）
INSERT INTO recipes (title, description, ingredients, instructions, genre, memo) VALUES
(
  'カルボナーラ',
  'パスタとベーコンのクリームソース',
  'スパゲティ 500g
牛肉または豚肉のひき肉 500g
タマネギ 1個
ニンニク 1個
セロリ 2本
トマトソース 400g',
  'スパゲティを大量の沸騰の水で調理します。
フライパンにひき肉を入れ、色が変わるまで炒めます。
タマネギ、ニンジン、セロリを加え、透明になるまで炒めます。
トマトソースを加え、少し煮詰めさせます。
スパゲティをソースに加え、よく混ぜ合わせます。',
  'メインディッシュ',
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
  'メインディッシュ',
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
  'メインディッシュ',
  '野菜たっぷりでヘルシー！'
);