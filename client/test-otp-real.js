// Тестовый скрипт для проверки отправки OTP с реальным номером
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

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
  // Используем ваш реальный номер или любой другой
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  readline.question('📱 Введите ваш номер телефона (например: +77771234567): ', async (testPhone) => {
    console.log(`\n🔍 Отправка кода на: ${testPhone}\n`);
    
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
        
        if (error.message.includes('not a valid phone number')) {
          console.log('\n💡 Номер должен быть в формате: +<код страны><номер>');
          console.log('   Примеры:');
          console.log('   • Казахстан: +77771234567');
          console.log('   • США: +15551234567');
          console.log('   • Россия: +79991234567\n');
        } else if (error.message.includes('SMS provider')) {
          console.log('\n💡 SMS провайдер не настроен');
          console.log('   1. Откройте: https://supabase.com/dashboard/project/qjealtvlmkusxeuymdpx/auth/providers');
          console.log('   2. Нажмите на Phone → Configure');
          console.log('   3. В режиме dev включите "Enable phone confirmations"\n');
        }
        readline.close();
        return;
      }

      console.log('✅ Запрос успешно отправлен!');
      console.log('\n📲 ПРОВЕРЬТЕ ТЕЛЕФОН! Код должен прийти через SMS');
      console.log('\n📋 Если SMS не пришло (режим разработки):');
      console.log('   1. Откройте: https://supabase.com/dashboard/project/qjealtvlmkusxeuymdpx/auth/users');
      console.log('   2. Обновите страницу (F5)');
      console.log(`   3. Найдите пользователя с номером ${testPhone}`);
      console.log('   4. Кликните на него → там будет код\n');
      
      readline.close();
    } catch (err) {
      console.error('❌ Неожиданная ошибка:', err.message);
      readline.close();
    }
  });
}

testOTP();
