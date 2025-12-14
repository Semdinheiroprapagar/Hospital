// Auto-setup Supabase tables
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import fs from 'fs';

// Load .env.local
config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

async function setupSupabase() {
    console.log('🚀 Setting up Supabase tables...\n');

    if (!supabaseUrl || !supabaseKey) {
        console.error('❌ Missing Supabase credentials!');
        process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Read SQL script
    const sqlPath = path.join(process.cwd(), 'scripts', 'setup-supabase.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');

    console.log('📄 Executing SQL script...\n');

    try {
        // Execute the SQL script using Supabase's RPC or direct SQL execution
        // Note: Supabase JS client doesn't support direct SQL execution
        // We'll create tables using the client API instead

        console.log('Creating tables...');

        // The SQL script needs to be run manually in Supabase SQL Editor
        // But we can verify if tables exist
        const tables = ['banners', 'posts', 'testimonials', 'history_items', 'contact_cards', 'admin_users'];

        let allTablesExist = true;
        for (const table of tables) {
            const { error } = await supabase.from(table).select('count').limit(1);
            if (error) {
                console.log(`   ❌ ${table}: Not found`);
                allTablesExist = false;
            } else {
                console.log(`   ✅ ${table}: Exists`);
            }
        }

        if (!allTablesExist) {
            console.log('\n⚠️  Algumas tabelas não existem!');
            console.log('\n📋 AÇÃO NECESSÁRIA:');
            console.log('1. Acesse: https://supabase.com/dashboard');
            console.log('2. Vá para seu projeto');
            console.log('3. Clique em "SQL Editor" no menu lateral');
            console.log('4. Clique em "New Query"');
            console.log('5. Cole o conteúdo do arquivo: scripts/setup-supabase.sql');
            console.log('6. Clique em "Run" (ou Ctrl/Cmd + Enter)');
            console.log('\n💡 O arquivo SQL está em: ' + sqlPath);
            process.exit(1);
        }

        console.log('\n✨ Todas as tabelas existem!');
        console.log('🚀 Supabase está pronto para uso!');

    } catch (error: any) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

setupSupabase();
