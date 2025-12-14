// Test Supabase connection speed
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import path from 'path';

config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

async function testSpeed() {
    console.log('⚡ Testando velocidade do Supabase...\n');

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Test 1: Simple query
    console.log('1️⃣ Teste de leitura simples...');
    let start = Date.now();
    const { data: posts } = await supabase.from('posts').select('*').limit(10);
    console.log(`   ✅ ${Date.now() - start}ms (${posts?.length || 0} posts)`);

    // Test 2: Insert
    console.log('\n2️⃣ Teste de inserção...');
    start = Date.now();
    const { data: newPost } = await supabase.from('posts').insert({
        title: `Teste Performance ${Date.now()}`,
        content: 'Testando velocidade de inserção',
        published: false
    }).select().single();
    console.log(`   ✅ ${Date.now() - start}ms`);

    // Test 3: Update
    if (newPost) {
        console.log('\n3️⃣ Teste de atualização...');
        start = Date.now();
        await supabase.from('posts').update({ title: 'Atualizado' }).eq('id', newPost.id);
        console.log(`   ✅ ${Date.now() - start}ms`);

        // Test 4: Delete
        console.log('\n4️⃣ Teste de deleção...');
        start = Date.now();
        await supabase.from('posts').delete().eq('id', newPost.id);
        console.log(`   ✅ ${Date.now() - start}ms`);
    }

    console.log('\n📊 Resumo:');
    console.log('   - Leitura: Deve ser < 500ms');
    console.log('   - Inserção: Deve ser < 1000ms');
    console.log('   - Atualização: Deve ser < 500ms');
    console.log('   - Deleção: Deve ser < 500ms');
    console.log('\n💡 Se estiver muito lento (> 2s), pode ser:');
    console.log('   - Conexão de internet lenta');
    console.log('   - Região do Supabase distante');
    console.log('   - Problema temporário do Supabase');
}

testSpeed();
