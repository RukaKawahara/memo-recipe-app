# 🍝 レシピアプリ - Supabaseセットアップガイド

このガイドでは、レシピアプリでSupabaseを使用するための設定手順を説明します。

## 📋 事前準備

1. [Supabase](https://supabase.com/)でアカウントを作成
2. 新しいプロジェクトを作成

## 🔧 Supabaseの設定

### 1. データベースの設定

1. Supabaseダッシュボードで新しいプロジェクトを作成
2. **SQL Editor** に移動
3. `supabase-setup.sql` ファイルの内容をコピーして実行

または、手動で以下を実行：

#### テーブル作成

```sql
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
```

#### セキュリティ設定

```sql
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to recipes" ON recipes
  FOR ALL USING (true);
```

### 2. ストレージの設定

1. **Storage** セクションに移動
2. 新しいバケット `recipes` を作成
3. **Public bucket** にチェックを入れる

または、SQLで作成：

```sql
INSERT INTO storage.buckets (id, name, public) VALUES ('recipes', 'recipes', true);

CREATE POLICY "Allow all access to recipe images" ON storage.objects
  FOR ALL USING (bucket_id = 'recipes');
```

### 3. 環境変数の設定

1. プロジェクトの **Settings** → **API** に移動
2. 以下の値をコピー：
   - `Project URL`
   - `anon public key`

3. プロジェクトルートで環境ファイルを作成：

```bash
cp .env.local.example .env.local
```

4. `.env.local` ファイルを編集：

```env
NEXT_PUBLIC_SUPABASE_URL=あなたのプロジェクトURL
NEXT_PUBLIC_SUPABASE_ANON_KEY=あなたのアノンキー
```

## 🚀 アプリケーションの起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` (または `http://localhost:3001`) にアクセス

## 🔍 トラブルシューティング

### よくあるエラー

#### 1. "Invalid API key" エラー

- `.env.local` ファイルが正しく設定されているか確認
- Supabaseの API キーが正しくコピーされているか確認
- アプリを再起動 (`npm run dev`)

#### 2. "Table 'recipes' doesn't exist" エラー

- Supabase SQL Editor で `supabase-setup.sql` が正しく実行されているか確認
- テーブルが作成されているか **Table editor** で確認

#### 3. "Row Level Security" エラー

- RLS ポリシーが正しく設定されているか確認
- 必要に応じて一時的に RLS を無効にして動作確認

#### 4. 画像アップロードエラー

- Storage バケット `recipes` が作成されているか確認
- バケットが Public に設定されているか確認
- Storage ポリシーが正しく設定されているか確認

### デバッグ方法

1. **Network タブ**でSupabaseへのリクエストを確認
2. **Console**でエラーメッセージを確認
3. Supabase ダッシュボードの **Logs** でサーバー側のエラーを確認

## 🎉 動作確認

セットアップが完了したら：

1. レシピ一覧ページでサンプルデータが表示される
2. 新しいレシピを作成できる
3. レシピの編集・削除ができる
4. 画像のアップロードができる

## 📚 追加リソース

- [Supabase公式ドキュメント](https://supabase.com/docs)
- [Next.js + Supabaseガイド](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

問題が発生した場合は、上記のトラブルシューティングセクションを参照するか、Supabaseのドキュメントをご確認ください。
