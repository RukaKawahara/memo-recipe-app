'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { Recipe } from '@/types/recipe';
import GenreTag from '@/components/atoms/GenreTag';
import ActionButtons from '@/components/molecules/ActionButtons';
import LoadingState from '@/components/molecules/LoadingState';
import ImageCarousel from '@/components/molecules/ImageCarousel';
import styles from './page.module.scss';

export default function RecipeDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [id, setId] = useState<string>('');
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    params.then((resolvedParams) => {
      setId(resolvedParams.id);
    });
  }, [params]);

  useEffect(() => {
    if (id) {
      // ページ遷移時にトップにスクロール
      window.scrollTo(0, 0);
      fetchRecipe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchRecipe = async () => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching recipe:', error);
        router.push('/');
      } else {
        setRecipe(data);
        // Update last_viewed_at timestamp
        updateLastViewed();
      }
    } catch (error) {
      console.error('Error:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const updateLastViewed = async () => {
    try {
      await supabase
        .from('recipes')
        .update({ last_viewed_at: new Date().toISOString() })
        .eq('id', id);
    } catch (error) {
      console.error('Error updating last viewed:', error);
    }
  };

  const handleDelete = async () => {
    if (!recipe) return;

    const confirmed = confirm('このレシピを削除しますか？');
    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', recipe.id);

      if (error) {
        console.error('Error deleting recipe:', error);
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) {
    return (
      <main className={styles.main}>
        <LoadingState title="レシピを読み込み中..." />
      </main>
    );
  }

  if (!recipe) {
    return (
      <main className={styles.main}>
        <div className={styles.error}>レシピが見つかりませんでした。</div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <div className={styles.topSection}>
          <div className={styles.imageContainer}>
            <ImageCarousel
              images={
                recipe.image_urls ||
                (recipe.image_url ? [recipe.image_url] : [])
              }
              alt={recipe.title}
            />
          </div>

          <div className={`${styles.section} ${styles.infoSection}`}>
            <h2 className={styles.infoTitle}>{recipe.title}</h2>
            <p className={styles.description}>{recipe.description}</p>
          </div>
        </div>

        {recipe.genres && recipe.genres.length > 0 && (
          <div className={`${styles.section} ${styles.genresSection}`}>
            <h3 className={styles.genresTitle}>ジャンル</h3>
            <div className={styles.genres}>
              {recipe.genres.filter(Boolean).map((genre) => (
                <GenreTag key={genre} size="medium">
                  {genre}
                </GenreTag>
              ))}
            </div>
          </div>
        )}

        <div className={styles.bottomSection}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>材料</h2>
            <div className={styles.ingredients}>
              {recipe.ingredients
                .split('\n')
                .filter((ingredient) => ingredient.trim())
                .map((ingredient, index) => (
                  <div key={index} className={styles.ingredient}>
                    <span>{ingredient.trim()}</span>
                  </div>
                ))}
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>手順</h2>
            <div className={styles.instructions}>
              {recipe.instructions
                .split('\n')
                .filter((instruction) => instruction.trim())
                .map((instruction, index) => (
                  <div key={index} className={styles.instruction}>
                    <span>{instruction.trim()}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {recipe.memo && (
          <div className={`${styles.section} ${styles.memoSection}`}>
            <h2 className={styles.sectionTitle}>メモ</h2>
            <p className={styles.memo}>{recipe.memo}</p>
          </div>
        )}

        {recipe.reference_url && (
          <div className={`${styles.section} ${styles.referenceSection}`}>
            <h2 className={styles.sectionTitle}>参考リンク</h2>
            <a
              href={recipe.reference_url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.referenceLink}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M137.54,186.36a8,8,0,0,1,0,11.31l-9.94,10A56,56,0,0,1,48.38,128.4L74.05,102.73a56,56,0,0,1,79.2,0,8,8,0,0,1-11.31,11.31,40,40,0,0,0-56.57,0L59.69,139.71a40,40,0,0,0,56.57,56.57l9.94-9.94A8,8,0,0,1,137.54,186.36Zm70.08-138a56,56,0,0,0-79.21,0l-9.94,9.95a8,8,0,0,0,11.32,11.31l9.94-9.94a40,40,0,0,1,56.57,56.56L170.63,141.9a40,40,0,0,1-56.57,0,8,8,0,0,0-11.31,11.32,56,56,0,0,0,79.2,0l25.67-25.67A56,56,0,0,0,207.62,48.38Z"></path>
              </svg>
              {recipe.reference_url}
            </a>
          </div>
        )}

        <ActionButtons
          editHref={`/edit/${recipe.id}`}
          onDelete={handleDelete}
        />
      </div>
    </main>
  );
}
