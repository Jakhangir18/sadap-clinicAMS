# Supabase + Vercel интеграция: пошаговая инструкция

## 1. Создание проекта в Supabase

1. Зайдите на [supabase.com](https://supabase.com) и авторизуйтесь
2. Нажмите **New Project** и выберите организацию
3. Задайте:
   - **Database name**: любое имя (например, `sadap-clinic`)
   - **Password**: надежный пароль (сохраните!)
   - **Region**: выберите ближайший регион
4. Подождите 2-3 минуты, пока проект создастся
5. После создания откроется дашборд

## 2. Получение ключей Supabase

1. В левой панели нажмите **Settings** → **API**
2. Скопируйте и сохраните:
   - **Project URL** (например, `https://xxxxx.supabase.co`)
   - **anon public key** (начинается с `eyJ...`)
   - **service_role key** (если будут серверные операции)

## 3. Настройка аутентификации

1. В левой панели нажмите **Authentication**
2. Перейдите в **Providers**
3. Включите **Phone Auth** (SMS, OTP):
   - Установите SMS provider (Twilio по умолчанию)
   - Задайте длину кода: 6 цифр
4. При необходимости добавьте OAuth (Google, Apple и т.п.)

## 4. Настройка Redirect URLs

1. Authentication → URL Configuration
2. Добавьте URL'ы для редирект после входа:
   - **Локально**: `http://localhost:3000/auth/callback`
   - **Production**: `https://<your-vercel-domain>.vercel.app/auth/callback`
   - При кастомном домене: `https://yourdomain.com/auth/callback`

## 5. Создание таблицы profiles

1. Перейдите в **SQL Editor**
2. Скопируйте содержимое `src/lib/supabase-migrations.sql` и выполните
3. Или создайте таблицу вручную через UI: **Table Editor** → **Create a new table**

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  phone TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

Включите RLS и создайте политики (см. файл миграции).

## 6. Локальная настройка (.env.local)

1. Откройте `client/.env.local`
2. Замените плейсхолдеры на реальные значения:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

3. **НЕ коммитьте .env.local** (добавьте в `.gitignore`)

## 7. Тестирование локально

1. Запустите dev-сервер:
   ```bash
   cd client
   npm run dev
   ```

2. Откройте http://localhost:3000/auth
3. Введите номер телефона и ФИО
4. Получите код по SMS (или в Supabase Dashboard → Authentication → Users → SMS Logs)
5. Введите код и проверьте редирект на `/profile`

## 8. Деплой на Vercel

1. **Подключение репозитория**:
   - Vercel → New Project → Import Git Repository
   - Выберите репозиторий `sadap-clinic`

2. **Настройка переменных окружения**:
   - Settings → Environment Variables
   - Добавьте:
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
     SUPABASE_SERVICE_ROLE_KEY=eyJ...
     ```

3. **Деплой**:
   - Build command: `npm run build` (по умолчанию)
   - Output Directory: `.next`
   - Нажмите **Deploy**

4. **После успешного деплоя**:
   - Скопируйте прод-домен из Vercel (например, `sadap-clinic.vercel.app`)
   - В Supabase добавьте в Redirect URLs: `https://sadap-clinic.vercel.app/auth/callback`

## 9. Проверка на проде

1. Откройте https://sadap-clinic.vercel.app/auth
2. Пройдите процесс регистрации
3. Убедитесь, что редирект на `/profile` работает
4. Проверьте, что данные появились в Supabase (Authentication → Users и Table Editor → profiles)

## 10. Возможные ошибки и решения

### "Missing Supabase environment variables"
- Убедитесь, что `.env.local` заполнен и находится в папке `client/`
- Рестартните dev-сервер (Ctrl+C и снова `npm run dev`)

### SMS не приходит
- Проверьте в Supabase Dashboard → Authentication → SMS Logs
- Убедитесь, что Twilio настроен (или используйте другой SMS-провайдер)
- На локальном dev'е используйте test-номер: +1234567890

### "Redirect URL is not allowed"
- В Supabase URL Configuration добавьте точный URL'и (с https://)
- Включите HTTPS в настройках

### Проблема с CORS на проде
- В Supabase Settings → General → API → CORS headers установите домен Vercel

## Файлы, которые были добавлены/изменены

- ✅ `client/.env.local` — переменные окружения (не коммитить)
- ✅ `client/src/lib/supabase.js` — браузерный клиент
- ✅ `client/src/lib/supabase-server.js` — серверный клиент
- ✅ `client/src/lib/supabase-migrations.sql` — миграция БД
- ✅ `client/src/app/auth/page.js` — страница входа/регистрации
- ✅ `client/src/app/auth/page.module.css` — стили (адаптивный)
- ✅ `client/src/app/auth/callback/route.js` — роут для OAuth callback
- ✅ `client/src/app/profile/page.js` — защищённая страница профиля
- ✅ `client/src/app/profile/page.module.css` — стили профиля (обновлены)

## Следующие шаги

- Настроить SMS-провайдера (Twilio) для SMS-кодов
- Добавить дополнительные таблицы (appointments, reviews и т.п.)
- Настроить RLS политики для таблиц
- Добавить логику создания записей (appointments)
