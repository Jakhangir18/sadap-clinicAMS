-- Удаляем старые политики если есть
DROP POLICY IF EXISTS "Public read avatars" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Admin update avatars" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete avatars" ON storage.objects;

-- Публичное чтение аватаров
CREATE POLICY "Public read avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- Админы могут загружать
CREATE POLICY "Admin upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Админы могут обновлять
CREATE POLICY "Admin update avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Админы могут удалять
CREATE POLICY "Admin delete avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- То же самое для certificates
DROP POLICY IF EXISTS "Public read certificates" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload certificates" ON storage.objects;
DROP POLICY IF EXISTS "Admin update certificates" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete certificates" ON storage.objects;

CREATE POLICY "Public read certificates"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'certificates');

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
