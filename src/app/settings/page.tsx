'use client';

import { useState, useEffect } from 'react';
import {
  getGenres,
  addGenre,
  updateGenre,
  deleteGenre,
  type Genre,
  GENRE_LIMIT,
  isGenreLimitReached,
  getRemainingGenreCount,
} from '@/lib/genres';
import { initializeDatabase } from '@/lib/database-init';
import { supabase } from '@/lib/supabase';
import Button from '@/components/atoms/Button';
import LoadingState from '@/components/molecules/LoadingState';
import styles from './page.module.scss';

export default function Settings() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [newGenreName, setNewGenreName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [dbInitialized, setDbInitialized] = useState<boolean | null>(null);
  const [isLimitReached, setIsLimitReached] = useState(false);
  const [remainingCount, setRemainingCount] = useState(0);

  useEffect(() => {
    checkDatabase();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkDatabase = async () => {
    const initialized = await initializeDatabase();
    setDbInitialized(initialized);
    fetchGenres();
  };

  const fetchGenres = async () => {
    try {
      const genreList = await getGenres();
      setGenres(genreList);

      // 上限チェック
      const limitReached = await isGenreLimitReached();
      const remaining = await getRemainingGenreCount();
      setIsLimitReached(limitReached);
      setRemainingCount(remaining);
    } catch (error) {
      console.error('Error fetching genres:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGenre = async () => {
    const trimmedName = newGenreName.trim();
    if (!trimmedName) {
      alert('ジャンル名を入力してください。');
      return;
    }

    // 既存のジャンルと重複チェック
    const existingGenre = genres.find(
      (genre) => genre.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (existingGenre) {
      alert('このジャンルは既に存在します。');
      return;
    }

    setActionLoading('add');
    try {
      const success = await addGenre(trimmedName);
      if (success) {
        setNewGenreName('');
        setIsAdding(false);
        await fetchGenres();
      } else {
        alert(
          'ジャンルの追加に失敗しました。データベースの設定を確認してください。'
        );
      }
    } catch (error) {
      console.error('Error adding genre:', error);
      alert(
        'ジャンルの追加に失敗しました。ネットワークエラーまたはデータベースエラーです。'
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditGenre = async (id: string) => {
    if (!editingName.trim()) return;

    setActionLoading(id);
    try {
      const success = await updateGenre(id, editingName);
      if (success) {
        setEditingId(null);
        setEditingName('');
        await fetchGenres();
      } else {
        alert(
          'ジャンルの更新に失敗しました。既に存在するジャンル名の可能性があります。'
        );
      }
    } catch (error) {
      console.error('Error updating genre:', error);
      alert('ジャンルの更新に失敗しました。');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteGenre = async (id: string, name: string) => {
    // まず、このジャンルを使用しているレシピがあるかチェック
    try {
      const { data: recipesWithGenre, error } = await supabase
        .from('recipes')
        .select('id, title, genres')
        .not('genres', 'is', null);

      if (error) {
        console.error('Error checking recipes:', error);
        alert('レシピの確認中にエラーが発生しました。');
        return;
      }

      const affectedRecipes =
        recipesWithGenre?.filter(
          (recipe) =>
            recipe.genres &&
            Array.isArray(recipe.genres) &&
            recipe.genres.includes(name)
        ) || [];

      let confirmMessage = `「${name}」を削除しますか？この操作は取り消せません。`;

      if (affectedRecipes.length > 0) {
        confirmMessage += `\n\n⚠️ 注意: このジャンルは ${affectedRecipes.length} 件のレシピで使用されています。\n削除すると、これらのレシピからもこのジャンルが削除されます。\n\n影響を受けるレシピ:\n${affectedRecipes
          .slice(0, 5)
          .map((recipe) => `• ${recipe.title}`)
          .join(
            '\n'
          )}${affectedRecipes.length > 5 ? `\n...他 ${affectedRecipes.length - 5} 件` : ''}`;
      }

      const confirmed = confirm(confirmMessage);
      if (!confirmed) return;

      setActionLoading(id);

      // ジャンルを削除
      const success = await deleteGenre(id);
      if (!success) {
        alert('ジャンルの削除に失敗しました。');
        return;
      }

      // 影響を受けるレシピからジャンルを削除
      if (affectedRecipes.length > 0) {
        for (const recipe of affectedRecipes) {
          const updatedGenres = recipe.genres.filter(
            (genre: string) => genre !== name
          );

          const { error: updateError } = await supabase
            .from('recipes')
            .update({ genres: updatedGenres })
            .eq('id', recipe.id);

          if (updateError) {
            console.error(`Error updating recipe ${recipe.id}:`, updateError);
          }
        }
      }

      await fetchGenres();

      if (affectedRecipes.length > 0) {
        alert(
          `ジャンル「${name}」を削除し、${affectedRecipes.length} 件のレシピから該当ジャンルを削除しました。`
        );
      }
    } catch (error) {
      console.error('Error deleting genre:', error);
      alert('ジャンルの削除に失敗しました。');
    } finally {
      setActionLoading(null);
    }
  };

  const startEditing = (genre: Genre) => {
    setEditingId(genre.id);
    setEditingName(genre.name);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingName('');
  };

  const cancelAdding = () => {
    setIsAdding(false);
    setNewGenreName('');
  };

  if (loading) {
    return (
      <main className={styles.main}>
        <LoadingState
          title="設定を読み込み中..."
          subtitle="ジャンル情報を準備しています"
        />
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>ジャンル管理</h3>
            <p className={styles.sectionDescription}>
              レシピのジャンルを追加・編集・削除できます
            </p>
            <div className={styles.genreCounter}>
              <span className={styles.genreCountText}>
                登録済み: {genres.length} / {GENRE_LIMIT}
              </span>
              {isLimitReached ? (
                <span className={styles.limitReachedText}>
                  上限に達しています
                </span>
              ) : (
                <span className={styles.remainingCountText}>
                  あと {remainingCount} 個追加可能
                </span>
              )}
            </div>
            {dbInitialized === false && (
              <div className={styles.warningMessage}>
                <p>⚠️ データベースのジャンルテーブルが見つかりません。</p>
                <p>現在はデフォルトジャンルのみ表示されています。</p>
                <p>
                  ジャンルの追加・編集・削除機能を使用するには、データベースのマイグレーションを実行してください。
                </p>
              </div>
            )}
          </div>

          <div className={styles.genreList}>
            {genres.length === 0 && !isAdding ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path d="M243.31,136,144,36.69A15.86,15.86,0,0,0,132.69,32H40A8,8,0,0,0,32,40v92.69A15.86,15.86,0,0,0,36.69,144L136,243.31a16,16,0,0,0,22.63,0l84.68-84.68a16,16,0,0,0,0-22.63ZM84,96A12,12,0,1,1,96,84,12,12,0,0,1,84,96Z"></path>
                  </svg>
                </div>
                <h4 className={styles.emptyTitle}>ジャンルがありません</h4>
                <p className={styles.emptyDescription}>
                  レシピを整理するために、ジャンルを追加してみましょう。
                  <br />
                  「メインディッシュ」「デザート」「スープ」などがおすすめです。
                </p>
                <button
                  onClick={() => setIsAdding(true)}
                  disabled={dbInitialized === false || isLimitReached}
                  className={`${styles.emptyAddButton} ${dbInitialized === false || isLimitReached ? styles.disabled : ''}`}
                  title={
                    dbInitialized === false
                      ? 'データベースの初期化が必要です'
                      : isLimitReached
                        ? `ジャンル登録上限（${GENRE_LIMIT}個）に達しています`
                        : ''
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path>
                  </svg>
                  最初のジャンルを追加
                </button>
              </div>
            ) : (
              genres.map((genre) => (
                <div key={genre.id} className={styles.genreItem}>
                  {editingId === genre.id ? (
                    <div className={styles.editingForm}>
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className={styles.editInput}
                        placeholder="ジャンル名"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleEditGenre(genre.id);
                          if (e.key === 'Escape') cancelEditing();
                        }}
                        autoFocus
                      />
                      <div className={styles.editActions}>
                        <Button
                          variant="primary"
                          rounded
                          onClick={() => handleEditGenre(genre.id)}
                          disabled={actionLoading === genre.id}
                        >
                          {actionLoading === genre.id ? '保存中...' : '保存'}
                        </Button>
                        <Button
                          variant="outline"
                          rounded
                          onClick={cancelEditing}
                          disabled={actionLoading === genre.id}
                        >
                          キャンセル
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.genreDisplay}>
                      <div className={styles.genreInfo}>
                        <span className={styles.genreName}>{genre.name}</span>
                      </div>
                      <div className={styles.genreActions}>
                        <Button
                          variant="outline"
                          rounded
                          onClick={() => startEditing(genre)}
                          disabled={ actionLoading === genre.id }
                        >
                          編集
                        </Button>
                        <Button
                          variant="danger"
                          rounded
                          onClick={() =>
                            handleDeleteGenre(genre.id, genre.name)
                          }
                          disabled={actionLoading === genre.id}
                        >
                          {actionLoading === genre.id ? '削除中...' : '削除'}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}

            {isAdding ? (
              <div className={styles.genreItem}>
                <div className={styles.editingForm}>
                  <input
                    type="text"
                    value={newGenreName}
                    onChange={(e) => setNewGenreName(e.target.value)}
                    className={styles.editInput}
                    placeholder="新しいジャンル名"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddGenre();
                      if (e.key === 'Escape') cancelAdding();
                    }}
                    autoFocus
                  />
                  <div className={styles.editActions}>
                    <Button
                      variant="primary"
                      rounded
                      onClick={handleAddGenre}
                      disabled={actionLoading === 'add'}
                    >
                      {actionLoading === 'add' ? '追加中...' : '追加'}
                    </Button>
                    <Button
                      variant="outline"
                      rounded
                      onClick={cancelAdding}
                      disabled={actionLoading === 'add'}
                    >
                      キャンセル
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              genres.length > 0 && (
                <Button
                  variant="outline"
                  dashed
                  onClick={() => setIsAdding(true)}
                  disabled={dbInitialized === false || isLimitReached}
                  title={
                    dbInitialized === false
                      ? 'データベースの初期化が必要です'
                      : isLimitReached
                        ? `ジャンル登録上限（${GENRE_LIMIT}個）に達しています`
                        : ''
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path>
                  </svg>
                  新しいジャンルを追加
                </Button>
              )
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
