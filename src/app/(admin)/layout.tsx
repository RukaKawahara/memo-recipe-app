import { createClient } from '@/utils/supabase/server'; // サーバーサイドSupabaseクライアント
import { redirect } from 'next/navigation';
import React from 'react';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log(user);


  if (!user) {
    redirect('/login');
  }

  return (
    <div className="app-container">
      <div className="main-content">
        <div className="container">{children}</div> {/* 👈 /create や /settings などの中身が表示される */}
      </div>
    </div>
  );
}