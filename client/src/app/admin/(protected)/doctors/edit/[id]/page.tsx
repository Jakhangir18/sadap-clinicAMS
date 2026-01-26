'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

function slugify(input: string): string {
  const map: Record<string, string> = {
    а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y',
    к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f',
    х: 'h', ц: 'c', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
  };
  return input
    .toLowerCase()
    .split('')
    .map((ch) => map[ch] ?? ch)
    .join('')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function getMimeType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  const mimeTypes: Record<string, string> = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'webp': 'image/webp',
    'gif': 'image/gif',
    'bmp': 'image/bmp',
    'svg': 'image/svg+xml',
    'avif': 'image/avif',
  };
  return mimeTypes[ext] || 'image/jpeg';
}

export default function EditDoctorPage() {
  const router = useRouter();
  const params = useParams();
  const doctorId = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    specialization_title: '',
    slug: '',
    rating: 4.9,
    sort_order: 0,
    is_published: true,
    avatar: null as File | null,
    education_text: '',
    experience_years: 0,
    working_hours_text: '',
    directions: [] as string[],
    disease_tags: [] as string[],
  });
  const [directionInput, setDirectionInput] = useState('');
  const [diseaseInput, setDiseaseInput] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!doctorId) {
        router.push('/admin/doctors');
        return;
      }

      const { data } = await supabase.from('doctors').select('*').eq('id', doctorId).maybeSingle();
      if (!data) {
        router.push('/admin/doctors');
        return;
      }
      setDoctor(data);
      setFormData({
        full_name: data.full_name || '',
        specialization_title: data.specialization_title || '',
        slug: data.slug || '',
        rating: typeof data.rating === 'number' ? data.rating : 4.9,
        sort_order: data.sort_order ?? 0,
        is_published: !!data.is_published,
        avatar: null,
        education_text: data.education_text || '',
        experience_years: data.experience_years ?? 0,
        working_hours_text: data.working_hours_text || '',
        directions: Array.isArray(data.directions) ? data.directions : [],
        disease_tags: Array.isArray(data.disease_tags) ? data.disease_tags : [],
      });
      setSlugTouched(!!data.slug);
      setLoading(false);
    };
    fetchDoctor();
  }, [doctorId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const full_name = formData.full_name.trim();
      let slug = formData.slug.trim();
      if (!slug && full_name) slug = slugify(full_name);
      const specialization_title = formData.specialization_title.trim() || 'Специализация не указана';
      const ratingValue = Number.isFinite(formData.rating) ? Math.min(5, Math.max(0, Number(formData.rating))) : 0;
      const sortOrderInt = Math.max(0, Math.round(formData.sort_order));

      await supabase
        .from('doctors')
        .update({
          full_name,
          specialization_title,
          slug,
          sort_order: sortOrderInt,
          is_published: formData.is_published,
          rating: ratingValue,
          education_text: formData.education_text.trim(),
          experience_years: formData.experience_years,
          working_hours_text: formData.working_hours_text.trim(),
          directions: formData.directions,
          disease_tags: formData.disease_tags,
        })
        .eq('id', doctorId);

      if (formData.avatar && formData.avatar.size > 0) {
        const ext = formData.avatar.name.split('.').pop() || 'jpg';
        const path = `doctor-${slug || doctorId}-${Date.now()}.${ext}`;
        const mimeType = getMimeType(formData.avatar.name);
        console.log('Uploading avatar to path:', path, 'with MIME type:', mimeType);
        
        const { error: upErr } = await supabase.storage.from('avatars').upload(path, formData.avatar, { contentType: mimeType, upsert: true });
        
        if (upErr) {
          console.error('Upload error:', upErr);
          alert('Ошибка загрузки фото: ' + upErr.message);
        } else {
          const { data: pub } = await supabase.storage.from('avatars').getPublicUrl(path);
          console.log('Public URL generated:', pub?.publicUrl);
          
          if (pub?.publicUrl) {
            const { error: updateErr } = await supabase.from('doctors').update({ avatar_url: pub.publicUrl }).eq('id', doctorId);
            if (updateErr) {
              console.error('Update avatar_url error:', updateErr);
            } else {
              console.log('✅ Avatar URL saved to database:', pub.publicUrl);
            }
          }
        }
      }

      router.push('/admin/doctors');
    } catch (error) {
      console.error('Error updating doctor:', error);
      alert('Не удалось сохранить врача: ' + (error as any)?.message ?? 'Ошибка');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: 24 }}>Загрузка...</div>;
  if (!doctor) return null;

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h1 style={{ margin: 0 }}>Редактировать врача</h1>
          <p style={{ margin: 4, color: '#6b7280' }}>Обновите карточку врача и сохраните</p>
        </div>
        <button type="button" onClick={() => router.push('/admin/doctors')} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #d1d5db', background: '#fff' }}>← Назад</button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16, background: '#fff', padding: 20, borderRadius: 12, border: '1px solid #e5e7eb', boxShadow: '0 6px 18px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 16, alignItems: 'start' }}>
          <div style={{ display: 'grid', gap: 8 }}>
            <span style={{ fontWeight: 600 }}>Фото (аватар)</span>
            <div style={{ width: 180, height: 180, borderRadius: 12, overflow: 'hidden', background: '#f3f4f6', border: '1px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {previewUrl ? (
                <img 
                  src={previewUrl} 
                  alt="Новое фото" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              ) : doctor.avatar_url ? (
                <Image src={doctor.avatar_url} alt={doctor.full_name || 'avatar'} width={180} height={180} style={{ objectFit: 'cover' }} />
              ) : (
                <p style={{ fontSize: 12, color: '#94a3b8' }}>Фото не загружено</p>
              )}
            </div>
            <input type="file" name="avatar" accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/bmp,image/svg+xml,image/avif" onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setFormData({ ...formData, avatar: file });
              if (previewUrl) URL.revokeObjectURL(previewUrl);
              setPreviewUrl(file ? URL.createObjectURL(file) : null);
            }} />
            <p style={{ fontSize: 11, color: '#666', margin: 0 }}>Поддерживаются: JPG, PNG, WebP, GIF, BMP, SVG, AVIF</p>
          </div>

          <div style={{ display: 'grid', gap: 12 }}>
            <label style={{ display: 'grid', gap: 6 }}>
              <span>ФИО *</span>
              <input type="text" name="full_name" required value={formData.full_name} onChange={(e) => {
                const nextName = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  full_name: nextName,
                  slug: slugTouched ? prev.slug : slugify(nextName),
                }));
              }} style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db' }} />
            </label>

            <label style={{ display: 'grid', gap: 6 }}>
              <span>Специализация</span>
              <input type="text" name="specialization_title" value={formData.specialization_title} onChange={(e) => setFormData({ ...formData, specialization_title: e.target.value })} style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db' }} />
            </label>

            <label style={{ display: 'grid', gap: 6 }}>
              <span>Slug (URL)</span>
              <input type="text" name="slug" value={formData.slug} onChange={(e) => {
                setSlugTouched(true);
                setFormData({ ...formData, slug: e.target.value });
              }} style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db' }} />
              <span style={{ fontSize: 12, color: '#6b7280' }}>Генерируется автоматически, но можно отредактировать.</span>
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <label style={{ display: 'grid', gap: 6 }}>
                <span>Рейтинг (0–5, дробные)</span>
                <input type="number" name="rating" min="0" max="5" step="0.1" value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })} style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db' }} />
              </label>
              <label style={{ display: 'grid', gap: 6 }}>
                <span>Порядок сортировки</span>
                <input type="number" name="sort_order" min="0" step="1" value={formData.sort_order} onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })} style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db' }} />
              </label>
            </div>
          </div>
        </div>

        <label style={{ display: 'grid', gap: 6 }}>
          <span>Образование</span>
          <textarea name="education_text" rows={3} placeholder="Западно-Казахстанский медицинский университет имени Марата Оспанова, 2008 год" value={formData.education_text} onChange={(e) => setFormData({ ...formData, education_text: e.target.value })} style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db', resize: 'vertical' }} />
        </label>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <label style={{ display: 'grid', gap: 6 }}>
            <span>Стаж (лет)</span>
            <input type="number" name="experience_years" min="0" step="1" value={formData.experience_years} onChange={(e) => setFormData({ ...formData, experience_years: Number(e.target.value) })} style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db' }} />
          </label>
          <label style={{ display: 'grid', gap: 6 }}>
            <span>Время приема</span>
            <input type="text" name="working_hours_text" placeholder="Пн-Пт: 9:00 – 18:00, Сб: 9:00 – 14:00" value={formData.working_hours_text} onChange={(e) => setFormData({ ...formData, working_hours_text: e.target.value })} style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db' }} />
          </label>
        </div>

        <div style={{ display: 'grid', gap: 6 }}>
          <span>Направления</span>
          <div style={{ display: 'flex', gap: 6 }}>
            <input type="text" placeholder="Добавить направление" value={directionInput} onChange={(e) => setDirectionInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); if (directionInput.trim()) { setFormData({ ...formData, directions: [...formData.directions, directionInput.trim()] }); setDirectionInput(''); } } }} style={{ flex: 1, padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db' }} />
            <button type="button" onClick={() => { if (directionInput.trim()) { setFormData({ ...formData, directions: [...formData.directions, directionInput.trim()] }); setDirectionInput(''); } }} style={{ padding: '10px 12px', borderRadius: 8, background: '#0c3465', color: '#fff', border: 'none' }}>+ Добавить</button>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {formData.directions.map((dir, i) => (
              <div key={i} style={{ padding: '4px 10px', background: '#e0f2fe', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>{dir}</span>
                <button type="button" onClick={() => setFormData({ ...formData, directions: formData.directions.filter((_, idx) => idx !== i) })} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#0c3465', fontWeight: 700 }}>×</button>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gap: 6 }}>
          <span>Специализация по заболеваниям</span>
          <div style={{ display: 'flex', gap: 6 }}>
            <input type="text" placeholder="Добавить заболевание" value={diseaseInput} onChange={(e) => setDiseaseInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); if (diseaseInput.trim()) { setFormData({ ...formData, disease_tags: [...formData.disease_tags, diseaseInput.trim()] }); setDiseaseInput(''); } } }} style={{ flex: 1, padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db' }} />
            <button type="button" onClick={() => { if (diseaseInput.trim()) { setFormData({ ...formData, disease_tags: [...formData.disease_tags, diseaseInput.trim()] }); setDiseaseInput(''); } }} style={{ padding: '10px 12px', borderRadius: 8, background: '#0c3465', color: '#fff', border: 'none' }}>+ Добавить</button>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {formData.disease_tags.map((tag, i) => (
              <div key={i} style={{ padding: '4px 10px', background: '#dbeafe', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>{tag}</span>
                <button type="button" onClick={() => setFormData({ ...formData, disease_tags: formData.disease_tags.filter((_, idx) => idx !== i) })} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#0c3465', fontWeight: 700 }}>×</button>
              </div>
            ))}
          </div>
        </div>

        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" checked={formData.is_published} onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })} /> Опубликовано
        </label>

        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" disabled={saving} style={{ padding: '10px 14px', borderRadius: 8, background: '#0c3465', color: '#fff', fontWeight: 600, cursor: 'pointer', border: 'none' }}>
            {saving ? 'Сохранение...' : 'Сохранить'}
          </button>
          <button type="button" onClick={() => router.push('/admin/doctors')} style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db', background: '#fff' }}>Отмена</button>
        </div>
      </form>
    </div>
  );
}
