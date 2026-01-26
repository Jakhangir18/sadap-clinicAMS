-- ===================================
-- Приводим рейтинг врачей к дробному типу
-- ===================================
-- Меняем столбец rating на NUMERIC(2,1), чтобы сохранять 4.3 / 4.5 и т.д.

-- Удаляем старые ограничения, если есть
ALTER TABLE public.doctors
  DROP CONSTRAINT IF EXISTS doctors_rating_check,
  DROP CONSTRAINT IF EXISTS doctors_rating_check_num;

-- Сбрасываем default, чтобы корректно поменять тип
ALTER TABLE public.doctors
  ALTER COLUMN rating DROP DEFAULT;

-- Приводим тип к NUMERIC(2,1) и одновременно ограничиваем диапазон 0..5
ALTER TABLE public.doctors
  ALTER COLUMN rating TYPE NUMERIC(2,1)
  USING LEAST(5, GREATEST(0, rating::NUMERIC));

-- Возвращаем default и чек-constraint
ALTER TABLE public.doctors
  ALTER COLUMN rating SET DEFAULT 0,
  ADD CONSTRAINT doctors_rating_check_num CHECK (rating >= 0 AND rating <= 5);

-- Проверяем результат
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'doctors' AND column_name = 'rating';

SELECT id, full_name, rating
FROM public.doctors
ORDER BY full_name
LIMIT 10;
