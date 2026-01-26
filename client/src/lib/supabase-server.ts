import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

function getCookieValue(name: string): string | undefined {
  try {
    const store: any = cookies();
    if (typeof store.get === 'function') {
      return store.get(name)?.value;
    }
    if (typeof store.getAll === 'function') {
      const all = store.getAll();
      const found = Array.isArray(all) ? all.find((c: any) => c?.name === name) : undefined;
      return found?.value;
    }
    return undefined;
  } catch {
    return undefined;
  }
}

function setCookieValue(name: string, value: string, options: any) {
  try {
    const store: any = cookies();
    if (typeof store.set === 'function') {
      store.set({ name, value, ...options });
    }
  } catch {
    // no-op on environments where setting is not supported
  }
}

export const serverSupabase = () => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    {
      cookies: {
        get: (name: string) => getCookieValue(name),
        set: (name: string, value: string, options: any) => setCookieValue(name, value, options),
        remove: (name: string, options: any) => setCookieValue(name, '', options),
      },
    }
  );
};

export const getAdminProfile = async () => {
  const supabase = serverSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('id', session.user.id)
    .maybeSingle();

  if (!profile || profile.role !== 'admin') return null;
  return profile;
};

export type AdminUser = { id: string; role: 'admin' | 'user' } | null;
