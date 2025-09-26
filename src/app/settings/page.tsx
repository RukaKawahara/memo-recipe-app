'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getGenres, addGenre, updateGenre, deleteGenre, type Genre } from '@/lib/genres'
import { initializeDatabase } from '@/lib/database-init'
import styles from './page.module.scss'

export default function Settings() {
  const [genres, setGenres] = useState<Genre[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [newGenreName, setNewGenreName] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [dbInitialized, setDbInitialized] = useState<boolean | null>(null)

  useEffect(() => {
    checkDatabase()
  }, [])

  const checkDatabase = async () => {
    const initialized = await initializeDatabase()
    setDbInitialized(initialized)
    fetchGenres()
  }

  const fetchGenres = async () => {
    try {
      const genreList = await getGenres()
      setGenres(genreList)
    } catch (error) {
      console.error('Error fetching genres:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddGenre = async () => {
    const trimmedName = newGenreName.trim()
    if (!trimmedName) {
      alert('ジャンル名を入力してください。')
      return
    }

    // 既存のジャンルと重複チェック
    const existingGenre = genres.find(genre =>
      genre.name.toLowerCase() === trimmedName.toLowerCase()
    )

    if (existingGenre) {
      alert('このジャンルは既に存在します。')
      return
    }

    setActionLoading('add')
    try {
      const success = await addGenre(trimmedName)
      if (success) {
        setNewGenreName('')
        setIsAdding(false)
        await fetchGenres()
      } else {
        alert('ジャンルの追加に失敗しました。データベースの設定を確認してください。')
      }
    } catch (error) {
      console.error('Error adding genre:', error)
      alert('ジャンルの追加に失敗しました。ネットワークエラーまたはデータベースエラーです。')
    } finally {
      setActionLoading(null)
    }
  }

  const handleEditGenre = async (id: string) => {
    if (!editingName.trim()) return

    setActionLoading(id)
    try {
      const success = await updateGenre(id, editingName)
      if (success) {
        setEditingId(null)
        setEditingName('')
        await fetchGenres()
      } else {
        alert('ジャンルの更新に失敗しました。既に存在するジャンル名の可能性があります。')
      }
    } catch (error) {
      console.error('Error updating genre:', error)
      alert('ジャンルの更新に失敗しました。')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeleteGenre = async (id: string, name: string) => {
    const confirmed = confirm(`「${name}」を削除しますか？この操作は取り消せません。`)
    if (!confirmed) return

    setActionLoading(id)
    try {
      const success = await deleteGenre(id)
      if (success) {
        await fetchGenres()
      } else {
        alert('デフォルトジャンルは削除できません。')
      }
    } catch (error) {
      console.error('Error deleting genre:', error)
      alert('ジャンルの削除に失敗しました。')
    } finally {
      setActionLoading(null)
    }
  }

  const startEditing = (genre: Genre) => {
    setEditingId(genre.id)
    setEditingName(genre.name)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditingName('')
  }

  const cancelAdding = () => {
    setIsAdding(false)
    setNewGenreName('')
  }

  if (loading) {
    return (
      <main className={styles.main}>
        <div className={styles.loading}>読み込み中...</div>
      </main>
    )
  }

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <Link href="/" className={styles.backButton}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
            <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
          </svg>
        </Link>
        <h2 className={styles.title}>設定</h2>
        <div className={styles.spacer}></div>
      </header>

      <div className={styles.content}>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>ジャンル管理</h3>
            <p className={styles.sectionDescription}>
              レシピのジャンルを追加・編集・削除できます
            </p>
            {dbInitialized === false && (
              <div className={styles.warningMessage}>
                <p>⚠️ データベースのジャンルテーブルが見つかりません。</p>
                <p>現在はデフォルトジャンルのみ表示されています。</p>
                <p>ジャンルの追加・編集・削除機能を使用するには、データベースのマイグレーションを実行してください。</p>
              </div>
            )}
          </div>

          <div className={styles.genreList}>
            {genres.map((genre) => (
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
                        if (e.key === 'Enter') handleEditGenre(genre.id)
                        if (e.key === 'Escape') cancelEditing()
                      }}
                      autoFocus
                    />
                    <div className={styles.editActions}>
                      <button
                        onClick={() => handleEditGenre(genre.id)}
                        disabled={actionLoading === genre.id}
                        className={styles.saveButton}
                      >
                        {actionLoading === genre.id ? '保存中...' : '保存'}
                      </button>
                      <button
                        onClick={cancelEditing}
                        disabled={actionLoading === genre.id}
                        className={styles.cancelButton}
                      >
                        キャンセル
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={styles.genreDisplay}>
                    <div className={styles.genreInfo}>
                      <span className={styles.genreName}>{genre.name}</span>
                      {genre.is_default && (
                        <span className={styles.defaultBadge}>デフォルト</span>
                      )}
                    </div>
                    <div className={styles.genreActions}>
                      <button
                        onClick={() => startEditing(genre)}
                        disabled={actionLoading === genre.id}
                        className={styles.editButton}
                      >
                        編集
                      </button>
                      {!genre.is_default && (
                        <button
                          onClick={() => handleDeleteGenre(genre.id, genre.name)}
                          disabled={actionLoading === genre.id}
                          className={styles.deleteButton}
                        >
                          {actionLoading === genre.id ? '削除中...' : '削除'}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

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
                      if (e.key === 'Enter') handleAddGenre()
                      if (e.key === 'Escape') cancelAdding()
                    }}
                    autoFocus
                  />
                  <div className={styles.editActions}>
                    <button
                      onClick={handleAddGenre}
                      disabled={actionLoading === 'add'}
                      className={styles.saveButton}
                    >
                      {actionLoading === 'add' ? '追加中...' : '追加'}
                    </button>
                    <button
                      onClick={cancelAdding}
                      disabled={actionLoading === 'add'}
                      className={styles.cancelButton}
                    >
                      キャンセル
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAdding(true)}
                disabled={dbInitialized === false}
                className={`${styles.addGenreButton} ${dbInitialized === false ? styles.disabled : ''}`}
                title={dbInitialized === false ? 'データベースの初期化が必要です' : ''}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path>
                </svg>
                新しいジャンルを追加
              </button>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}