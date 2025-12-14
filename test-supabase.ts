// Test Supabase connection
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import path from 'path';

// Load .env.local
config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

async function testSupabase() {
    console.log('🧪 Testing Supabase Connection...\n');

    console.log('📋 Configuration:');
    console.log(`   URL: ${supabaseUrl ? '✅ Found' : '❌ Missing'}`);
    console.log(`   Service Key: ${supabaseKey ? '✅ Found' : '❌ Missing'}\n`);

    if (!supabaseUrl || !supabaseKey) {
        console.error('❌ Missing Supabase credentials in .env.local!');
        process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        // Test connection by listing tables
        console.log('1️⃣ Testing connection...');
        const { data: tables, error: tablesError } = await supabase
            .from('posts')
            .select('count')
            .limit(1);

        if (tablesError) {
            console.error('❌ Error connecting to Supabase:', tablesError.message);
            console.log('\n💡 Você precisa executar o script setup-supabase.sql no Supabase!');
            console.log('   Vá em: SQL Editor > New Query > Cole o conteúdo de scripts/setup-supabase.sql');
            process.exit(1);
        }

        console.log('✅ Connection successful!\n');

        // Test each table
        const tablesToTest = ['banners', 'posts', 'testimonials', 'history_items', 'contact_cards', 'admin_users'];

        console.log('2️⃣ Testing tables...');
        for (const table of tablesToTest) {
            const { data, error } = await supabase.from(table).select('count').limit(1);

            if (error) {
                console.log(`   ❌ ${table}: ${error.message}`);
            } else {
                console.log(`   ✅ ${table}: OK`);
            }
        }

        console.log('\n✨ Supabase está configurado e funcionando!');
        console.log('🚀 Você pode usar o sistema normalmente.');

    } catch (error: any) {
        console.error('❌ Unexpected error:', error.message);
        process.exit(1);
    }
}

testSupabase();
