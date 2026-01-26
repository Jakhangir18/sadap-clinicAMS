-- ===================================
-- ПРОВЕРКА ПРАВ АДМИНИСТРАТОРА
-- ===================================
-- 
-- Выполните этот скрипт чтобы:
-- 1. Проверить вашу роль в системе
-- 2. Установить роль 'admin' если её нет
--

-- 1. Посмотреть текущего пользователя
SELECT auth.uid() as current_user_id;

-- 2. Проверить роль текущего пользователя
SELECT id, email, role, created_at 
FROM profiles 
WHERE id = auth.uid();

-- 3. Если роль не 'admin', обновить её (замените YOUR_USER_ID на ваш ID)
-- UPDATE profiles 
-- SET role = 'admin' 
-- WHERE id = auth.uid();

-- 4. Проверить все профили
SELECT id, email, role 
FROM profiles 
ORDER BY created_at DESC;
