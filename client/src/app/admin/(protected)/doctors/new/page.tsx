'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

export default function NewDoctorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const full_name = formData.full_name.trim();
      const specialization_title = formData.specialization_title.trim() || 'Специализация не указана';
      let slug = formData.slug.trim();
      if (!slug && full_name) slug = slugify(full_name);

      const ratingValue = Number.isFinite(formData.rating) ? Math.min(5, Math.max(0, Number(formData.rating))) : 0;
      const sortOrderInt = Math.max(0, Math.round(formData.sort_order));

      const { data: inserted, error} = await supabase
        .from('doctors')
        .insert({
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
        .select('id, slug')
        .single();
      
      if (error || !inserted) throw error;

      if (formData.avatar && formData.avatar.size > 0) {
        const ext = formData.avatar.name.split('.').pop() || 'jpg';
        const path = `doctor-${inserted.slug || inserted.id}-${Date.now()}.${ext}`;
        const mimeType = getMimeType(formData.avatar.name);
        const { error: upErr } = await supabase.storage.from('avatars').upload(path, formData.avatar, { contentType: mimeType, upsert: true });
        if (!upErr) {
          const { data: pub } = await supabase.storage.from('avatars').getPublicUrl(path);
          if (pub?.publicUrl) {
            await supabase.from('doctors').update({ avatar_url: pub.publicUrl }).eq('id', inserted.id);
          }
        }
      }

      router.push('/admin/doctors');
    } catch (error) {
      console.error('Error creating doctor:', error);
      alert('Не удалось создать врача: ' + (error as any)?.message ?? 'Ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 12 }}>Добавить врача</h1>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12, maxWidth: 560 }}>
        <label style={{ display: 'grid', gap: 6 }}>
          <span>Фото (аватар)</span>
          {previewUrl && (
            <div style={{ marginTop: 8, marginBottom: 8 }}>
              <img 
                src={previewUrl} 
                alt="Предпросмотр" 
                style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8, border: '2px solid #0c3465' }} 
              />
              <p style={{ fontSize: 12, color: '#666', marginTop: 4 }}>Выбрано: {formData.avatar?.name}</p>
            </div>
          )}
          <input type="file" name="avatar" accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/bmp,image/svg+xml,image/avif" onChange={(e) => {
            const file = e.target.files?.[0] || null;
            setFormData({ ...formData, avatar: file });
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            setPreviewUrl(file ? URL.createObjectURL(file) : null);
          }} />
          <p style={{ fontSize: 11, color: '#666', marginTop: 4 }}>Поддерживаются: JPG, PNG, WebP, GIF, BMP, SVG, AVIF</p>
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          <span>ФИО *</span>
          <input type="text" name="full_name" required placeholder="Иванов Иван Иванович" value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} />
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          <span>Специализация</span>
          <input type="text" name="specialization_title" placeholder="Стоматолог-ортопед" value={formData.specialization_title} onChange={(e) => setFormData({ ...formData, specialization_title: e.target.value })} />
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          <span>Slug (если пусто — сгенерируется)</span>
          <input type="text" name="slug" placeholder="ivanov-ivan-ivanovich" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} />
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          <span>Рейтинг</span>
          <input type="number" name="rating" min="0" max="5" step="0.1" value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })} />
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          <span>Порядок сортировки</span>
          <input type="number" name="sort_order" min="0" step="1" value={formData.sort_order} onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })} />
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          <span>Образование</span>
          <textarea name="education_text" rows={3} placeholder="Западно-Казахстанский медицинский университет имени Марата Оспанова, 2008 год" value={formData.education_text} onChange={(e) => setFormData({ ...formData, education_text: e.target.value })} style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #d1d5db', resize: 'vertical' }} />
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          <span>Стаж (лет)</span>
          <input type="number" name="experience_years" min="0" step="1" value={formData.experience_years} onChange={(e) => setFormData({ ...formData, experience_years: Number(e.target.value) })} />
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          <span>Время приема</span>
          <input type="text" name="working_hours_text" placeholder="Пн-Пт: 9:00 – 18:00, Сб: 9:00 – 14:00" value={formData.working_hours_text} onChange={(e) => setFormData({ ...formData, working_hours_text: e.target.value })} />
        </label>

        <div style={{ display: 'grid', gap: 6 }}>
          <span>Направления</span>
          <div style={{ display: 'flex', gap: 6 }}>
            <input type="text" placeholder="Добавить направление" value={directionInput} onChange={(e) => setDirectionInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); if (directionInput.trim()) { setFormData({ ...formData, directions: [...formData.directions, directionInput.trim()] }); setDirectionInput(''); } } }} style={{ flex: 1, padding: '8px 12px', borderRadius: 6, border: '1px solid #d1d5db' }} />
            <button type="button" onClick={() => { if (directionInput.trim()) { setFormData({ ...formData, directions: [...formData.directions, directionInput.trim()] }); setDirectionInput(''); } }} style={{ padding: '8px 12px', borderRadius: 6, background: '#0c3465', color: '#fff' }}>+ Добавить</button>
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
            <input type="text" placeholder="Добавить заболевание" value={diseaseInput} onChange={(e) => setDiseaseInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); if (diseaseInput.trim()) { setFormData({ ...formData, disease_tags: [...formData.disease_tags, diseaseInput.trim()] }); setDiseaseInput(''); } } }} style={{ flex: 1, padding: '8px 12px', borderRadius: 6, border: '1px solid #d1d5db' }} />
            <button type="button" onClick={() => { if (diseaseInput.trim()) { setFormData({ ...formData, disease_tags: [...formData.disease_tags, diseaseInput.trim()] }); setDiseaseInput(''); } }} style={{ padding: '8px 12px', borderRadius: 6, background: '#0c3465', color: '#fff' }}>+ Добавить</button>
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
          <input type="checkbox" checked={formData.is_published} onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })} /> Опубликовать
        </label>

        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" disabled={loading} style={{ padding: '8px 12px', borderRadius: 8, background: '#0c3465', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
            {loading ? 'Сохранение...' : 'Сохранить'}
          </button>
          <button type="button" onClick={() => router.push('/admin/doctors')} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #d1d5db' }}>Отмена</button>
        </div>
      </form>
    </div>
  );
}
