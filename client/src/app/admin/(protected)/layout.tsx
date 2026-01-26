'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let checkTimeout: ReturnType<typeof setTimeout> | null = null;

    const checkAuth = async () => {
      try {
        // Таймаут: если за 5 секунд не проверили — редирект на логин
        checkTimeout = setTimeout(() => {
          if (!isMounted) return;
          console.warn('[Admin Layout] Timeout - redirecting to login');
          setLoading(false);
          setAuthorized(false);
          router.replace('/admin/login');
        }, 5000);

        const { data, error } = await supabase.auth.getSession();
        
        // Очищаем таймаут как только получили ответ
        if (checkTimeout) {
          clearTimeout(checkTimeout);
          checkTimeout = null;
        }

        if (!isMounted) return;

        if (error || !data?.session) {
          setLoading(false);
          setAuthorized(false);
          router.replace('/admin/login');
          return;
        }

        // Проверяем роль
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.session.user.id)
          .maybeSingle();

        if (!isMounted) return;

        if (profile?.role !== 'admin') {
          setLoading(false);
          setAuthorized(false);
          router.replace('/admin/login');
          return;
        }

        setAuthorized(true);
        setLoading(false);
      } catch (err) {
        console.error('[Admin Layout] Auth check failed:', err);
        if (checkTimeout) clearTimeout(checkTimeout);
        if (!isMounted) return;
        setLoading(false);
        setAuthorized(false);
        router.replace('/admin/login');
      }
    };

    checkAuth();

    // Слушаем только выход (SIGNED_OUT)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;
      
      // Только при выходе редиректим
      if (event === 'SIGNED_OUT' || !session) {
        setAuthorized(false);
        setLoading(false);
        router.replace('/admin/login');
      }
    });

    return () => {
      isMounted = false;
      if (checkTimeout) clearTimeout(checkTimeout);
      subscription?.unsubscribe();
    };
  }, [router]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div>Загрузка...</div>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return <>{children}</>;
}
