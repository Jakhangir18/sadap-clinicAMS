// Тестовый скрипт для проверки отправки OTP
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Читаем .env.local вручную
const envContent = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL,
  envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testOTP() {
  const testPhone = '+1234567890'; // Тестовый номер
  
  console.log('\n🔍 Тестирование отправки OTP...\n');
  console.log(`📱 Отправка кода на: ${testPhone}`);
  
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      phone: testPhone,
      options: {
        data: {
          full_name: 'Test User',
        },
      },
    });

    if (error) {
      console.error('❌ Ошибка:', error.message);
      console.log('\n💡 Возможные причины:');
      console.log('   1. Phone Auth не включен в Supabase');
      console.log('   2. SMS провайдер не настроен');
      console.log('   3. Неверный формат номера');
      console.log('\n📖 Инструкция:');
      console.log('   1. Откройте: https://supabase.com/dashboard/project/qjealtvlmkusxeuymdpx/auth/providers');
      console.log('   2. Включите "Phone" провайдер');
      console.log('   3. В режиме dev код можно найти в Dashboard → Authentication → Users');
      return;
    }

    console.log('✅ Запрос успешно отправлен!');
    console.log('\n📋 Как получить код для входа:');
    console.log('   1. Откройте: https://supabase.com/dashboard/project/qjealtvlmkusxeuymdpx/auth/users');
    console.log('   2. Обновите страницу (F5)');
    console.log(`   3. Найдите пользователя с номером ${testPhone}`);
    console.log('   4. Кликните на пользователя → вкладка "Recovery/OTP Codes"');
    console.log('   5. Скопируйте 6-значный код\n');
    
  } catch (err) {
    console.error('❌ Неожиданная ошибка:', err.message);
  }
}

testOTP();
