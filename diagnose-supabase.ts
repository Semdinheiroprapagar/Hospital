// Diagnóstico completo do Supabase
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import path from 'path';

config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

async function diagnoseSupabase() {
    console.log('🔍 Diagnóstico do Supabase\n');

    if (!supabaseUrl || !supabaseKey) {
        console.error('❌ Credenciais não encontradas!');
        process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        // 1. Verificar buckets
        console.log('📦 Verificando buckets...');
        const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();

        if (bucketsError) {
            console.error('❌ Erro ao listar buckets:', bucketsError.message);
        } else {
            console.log('✅ Buckets encontrados:', buckets?.map(b => b.name).join(', ') || 'nenhum');

            const imagesBucket = buckets?.find(b => b.name === 'images');
            if (imagesBucket) {
                console.log('   ✅ Bucket "images" existe');
                console.log('   - Public:', imagesBucket.public);
                console.log('   - ID:', imagesBucket.id);
            } else {
                console.log('   ❌ Bucket "images" NÃO existe');
            }
        }

        // 2. Verificar tabelas
        console.log('\n📋 Verificando tabelas...');
        const tables = ['banners', 'posts', 'testimonials', 'history_items', 'contact_cards', 'admin_users'];

        for (const table of tables) {
            const { data, error } = await supabase.from(table).select('count').limit(1);
            if (error) {
                console.log(`   ❌ ${table}: ${error.message}`);
            } else {
                console.log(`   ✅ ${table}: OK`);
            }
        }

        // 3. Testar upload
        console.log('\n📤 Testando upload...');
        const testFile = Buffer.from('test');
        const testFilename = `test-${Date.now()}.txt`;

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('images')
            .upload(testFilename, testFile, {
                contentType: 'text/plain'
            });

        if (uploadError) {
            console.log('   ❌ Upload falhou:', uploadError.message);
            console.log('   💡 Você precisa configurar as políticas de Storage!');
        } else {
            console.log('   ✅ Upload funcionou!');

            // Deletar arquivo de teste
            await supabase.storage.from('images').remove([testFilename]);
            console.log('   ✅ Delete funcionou!');
        }

        // 4. Verificar admin user
        console.log('\n👤 Verificando admin user...');
        const { data: adminUser, error: adminError } = await supabase
            .from('admin_users')
            .select('username')
            .eq('username', 'MGS')
            .single();

        if (adminError) {
            console.log('   ❌ Admin user não encontrado');
        } else {
            console.log('   ✅ Admin user existe:', adminUser.username);
        }

        console.log('\n✨ Diagnóstico completo!');

    } catch (error: any) {
        console.error('❌ Erro:', error.message);
    }
}

diagnoseSupabase();
