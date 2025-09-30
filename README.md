# claude-recipe-app

レシピ管理アプリケーション（Next.js + Supabase）

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local.example`を`.env.local`にコピーし、Supabaseの設定を入力してください。

### 3. データベースの初期化

#### 新規プロジェクトの場合：

Supabaseプロジェクトで`supabase-setup.sql`を実行してデータベーステーブルを作成してください：

```sql
-- supabase-setup.sql ファイルの内容をSupabaseのSQL Editorで実行
```

#### 既存プロジェクトの場合（recipesテーブルが既に存在する場合）：

`migration-to-genres-array.sql`を実行して既存のデータを新しい構造に移行してください：

```sql
-- migration-to-genres-array.sql ファイルの内容をSupabaseのSQL Editorで実行
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

## 機能

- ✅ レシピの作成・編集・削除
- ✅ お気に入り機能
- ✅ 複数ジャンルの選択と表示
- ✅ ジャンルによるフィルタリング
- ✅ 設定画面でのジャンル管理
- ✅ レスポンシブデザイン

## 注意事項

設定画面でジャンル管理機能を使用するには、データベースのマイグレーション（`supabase-setup.sql`の実行）が必要です。
マイグレーションが完了していない場合、デフォルトジャンルのみが表示されます。

## トラブルシューティング

### ジャンル追加に失敗する場合

1. Supabaseで`supabase-setup.sql`ファイルの内容を実行してください
2. `genres`テーブルが正しく作成されているか確認してください
3. 設定画面で警告メッセージが表示される場合は、データベースの初期化が必要です
