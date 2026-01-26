-- ===================================
-- СОЗДАНИЕ БАКЕТА И ПОЛИТИК ДЛЯ СЕРТИФИКАТОВ
-- ===================================
-- 
-- Выполните этот скрипт в Supabase Dashboard:
-- 1. Откройте ваш проект в Supabase
-- 2. Перейдите в SQL Editor
-- 3. Создайте новый запрос
-- 4. Вставьте этот код и нажмите RUN
--

-- 1. Создаём бакет certificates (если не существует)
INSERT INTO storage.buckets (id, name, public)
VALUES ('certificates', 'certificates', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Удаляем старые политики (если есть)
DROP POLICY IF EXISTS "Public read certificates" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload certificates" ON storage.objects;
DROP POLICY IF EXISTS "Admin update certificates" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete certificates" ON storage.objects;

-- 3. Создаём политику для публичного чтения
CREATE POLICY "Public read certificates"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'certificates');

-- 4. Создаём политику для загрузки (админы)
CREATE POLICY "Admin upload certificates"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'certificates' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- 5. Создаём политику для обновления (админы)
CREATE POLICY "Admin update certificates"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'certificates' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- 6. Создаём политику для удаления (админы)
CREATE POLICY "Admin delete certificates"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'certificates' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- 7. Проверяем созданные политики
SELECT 
  schemaname, 
  tablename, 
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE '%certificate%'
ORDER BY policyname;

-- 8. Проверяем бакет
SELECT id, name, public, created_at 
FROM storage.buckets 
WHERE name = 'certificates';
