import type { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import RecipeDetailClient from './RecipeDetailClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();

  const { data: recipe } = await supabase
    .from('recipes')
    .select('title, description, image_url, image_urls')
    .eq('id', id)
    .single();

  if (!recipe) {
    return { title: 'レシピが見つかりません' };
  }

  const image = recipe.image_urls?.[0] ?? recipe.image_url ?? undefined;

  return {
    title: recipe.title,
    description: recipe.description,
    openGraph: {
      title: recipe.title,
      description: recipe.description,
      images: image ? [{ url: image }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: recipe.title,
      description: recipe.description,
      images: image ? [image] : [],
    },
  };
}

export default async function RecipeDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return <RecipeDetailClient params={params} isLoggedIn={!!user} />;
}
