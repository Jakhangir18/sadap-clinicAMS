-- ===================================
-- ПОЛИТИКИ ДЛЯ СЕРТИФИКАТОВ
-- ===================================
-- Бакет уже создан, создаём только политики
--

-- Удаляем старые политики (если есть)
DROP POLICY IF EXISTS "Public read certificates" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload certificates" ON storage.objects;
DROP POLICY IF EXISTS "Admin update certificates" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete certificates" ON storage.objects;

-- Публичное чтение
CREATE POLICY "Public read certificates"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'certificates');

-- Загрузка для всех аутентифицированных пользователей
CREATE POLICY "Admin upload certificates"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'certificates');

-- Обновление для всех аутентифицированных
CREATE POLICY "Admin update certificates"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'certificates');

-- Удаление для всех аутентифицированных
CREATE POLICY "Admin delete certificates"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'certificates');

-- Проверяем созданные политики
SELECT policyname, cmd, roles
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE '%certificate%'
ORDER BY policyname;
