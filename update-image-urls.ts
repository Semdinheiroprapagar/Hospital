// Atualizar URLs das imagens no banco de dados
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import path from 'path';

config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

async function updateImageUrls() {
    console.log('🔄 Atualizando URLs das imagens no banco de dados...\n');

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        const tables = ['posts', 'banners', 'history_items', 'contact_cards'];
        let totalUpdated = 0;

        for (const table of tables) {
            console.log(`📋 Processando tabela: ${table}`);

            // Buscar registros com URLs locais
            const { data: records } = await supabase
                .from(table)
                .select('*')
                .like('image_url', '/uploads/%');

            if (!records || records.length === 0) {
                console.log(`   ℹ️  Nenhum registro com URL local\n`);
                continue;
            }

            console.log(`   📝 Encontrados ${records.length} registros`);

            for (const record of records) {
                const oldUrl = record.image_url;

                // Extrair nome do arquivo
                const filename = oldUrl.replace('/uploads/', '');

                // Nova URL do Supabase
                const newUrl = `${supabaseUrl}/storage/v1/object/public/images/${filename}`;

                // Atualizar no banco
                const { error } = await supabase
                    .from(table)
                    .update({ image_url: newUrl })
                    .eq('id', record.id);

                if (error) {
                    console.log(`   ❌ ID ${record.id}: ${error.message}`);
                } else {
                    console.log(`   ✅ ID ${record.id}: ${filename}`);
                    totalUpdated++;
                }
            }

            console.log('');
        }

        console.log('📊 Resumo:');
        console.log(`   ✅ Total atualizado: ${totalUpdated} registros`);
        console.log('\n✨ Migração completa!');
        console.log('   Agora todas as imagens estão no Supabase Storage');
        console.log('   e funcionarão na Vercel!');

    } catch (error: any) {
        console.error('❌ Erro:', error.message);
        process.exit(1);
    }
}

updateImageUrls();
