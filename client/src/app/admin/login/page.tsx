"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const isStrongPassword = (pwd: string) => {
  return (
    pwd.length >= 12 &&
    /[A-Z]/.test(pwd) &&
    /\d/.test(pwd) &&
    /[^A-Za-z0-9]/.test(pwd)
  );
};

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isStrongPassword(password)) {
      setError('Пароль должен быть минимум 12 символов, содержать заглавную букву, цифру и спецсимвол.');
      return;
    }
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    // Проверим роль admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError('Не удалось получить пользователя');
      setLoading(false);
      return;
    }
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    if (!profile || profile.role !== 'admin') {
      setError('Доступ только для администраторов');
      setLoading(false);
      return;
    }

    // Даём Supabase время инициализировать сеанс
    await new Promise(resolve => setTimeout(resolve, 500));
    router.replace('/admin/doctors');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: '#f7f7f7' }}>
      <form onSubmit={onSubmit} style={{ width: 360, background: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
        <h1 style={{ margin: 0, marginBottom: 12, fontSize: 20 }}>Super Admin Login</h1>
        <p style={{ marginTop: 0, color: '#666', marginBottom: 16 }}>Вход по email и паролю</p>

        <label style={{ display: 'block', fontSize: 12, color: '#333', marginBottom: 6 }}>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd', marginBottom: 14 }} />

        <label style={{ display: 'block', fontSize: 12, color: '#333', marginBottom: 6 }}>Пароль</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd', marginBottom: 8 }} />
        <div style={{ fontSize: 11, color: '#777', marginBottom: 12 }}>Минимум 12 символов, 1 заглавная, 1 цифра, 1 спецсимвол</div>

        {error && <div style={{ background: '#ffe9e9', color: '#b00020', padding: '8px 10px', borderRadius: 8, marginBottom: 12 }}>{error}</div>}

        <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: 'none', background: '#0c3465', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
          {loading ? 'Вход...' : 'Войти'}
        </button>
      </form>
    </div>
  );
}
