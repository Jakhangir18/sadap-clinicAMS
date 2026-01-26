'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

async function togglePublish(id: string, next: boolean) {
  await supabase.from('doctors').update({ is_published: next }).eq('id', id);
}

async function deleteDoctor(id: string) {
  if (!confirm('Удалить врача?')) return;
  await supabase.from('doctors').delete().eq('id', id);
}

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDoctors = async () => {
    const { data, error } = await supabase
      .from('doctors')
      .select('id, full_name, slug, specialization_title, rating, avatar_url, is_published, sort_order')
      .order('sort_order', { ascending: true, nullsFirst: false })
      .order('full_name', { ascending: true });
    if (!error) setDoctors(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleTogglePublish = async (id: string, isPublished: boolean) => {
    await togglePublish(id, !isPublished);
    fetchDoctors();
  };

  const handleDelete = async (id: string) => {
    await deleteDoctor(id);
    fetchDoctors();
  };

  if (loading) {
    return <div style={{ padding: 24 }}>Загрузка...</div>;
  }

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>Врачи</h1>
        <Link href="/admin/doctors/new" style={{ padding: '8px 12px', borderRadius: 8, background: '#0c3465', color: '#fff', fontWeight: 600 }}>+ Добавить врача</Link>
      </div>

      <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 1fr 90px 220px', gap: 12, padding: '12px 16px', background: '#f8fafc', fontWeight: 600, alignItems: 'center' }}>
          <div>Фото</div>
          <div>ФИО</div>
          <div>Специализация</div>
          <div style={{ textAlign: 'center' }}>Рейтинг</div>
          <div style={{ textAlign: 'center' }}>Действия</div>
        </div>
        {doctors.map((d: any) => (
          <div key={d.id} style={{ display: 'grid', gridTemplateColumns: '60px 1fr 1fr 90px 220px', gap: 12, padding: '12px 16px', borderTop: '1px solid #f1f5f9', alignItems: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: 8, overflow: 'hidden', background: '#f3f4f6' }}>
              {d.avatar_url ? (
                <Image src={d.avatar_url} alt={d.full_name || 'avatar'} width={48} height={48} style={{ objectFit: 'cover' }} />
              ) : (
                <div style={{ width: 48, height: 48 }} />
              )}
            </div>
            <div>
              <div style={{ fontWeight: 600 }}>{d.full_name || '—'}</div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>slug: {d.slug || '—'}</div>
            </div>
            <div>{d.specialization_title || '—'}</div>
            <div style={{ textAlign: 'center' }}>{typeof d.rating === 'number' ? d.rating.toFixed(1) : '—'}</div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => handleTogglePublish(d.id, d.is_published)} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #d1d5db', background: d.is_published ? '#e8f5e9' : '#fff', color: d.is_published ? '#1b5e20' : '#374151' }}>
                {d.is_published ? 'Скрыть' : 'Опубликовать'}
              </button>
              <Link href={`/admin/doctors/edit/${d.id}`} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #d1d5db', background: '#fff' }}>Редактировать</Link>
              <button onClick={() => handleDelete(d.id)} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #ef4444', background: '#fff', color: '#b00020' }}>Удалить</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
