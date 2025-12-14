// Migrar imagens locais para Supabase Storage
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync } from 'fs';
import path from 'path';

config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

async function migrateImages() {
    console.log('📦 Migrando imagens locais para Supabase Storage...\n');

    if (!supabaseUrl || !supabaseKey) {
        console.error('❌ Credenciais do Supabase não encontradas!');
        process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

    try {
        // Listar arquivos em public/uploads
        const files = readdirSync(uploadsDir);
        console.log(`📁 Encontrados ${files.length} arquivos em public/uploads\n`);

        let uploaded = 0;
        let skipped = 0;
        let errors = 0;

        for (const filename of files) {
            try {
                // Verificar se já existe no Supabase
                const { data: existing } = await supabase.storage
                    .from('images')
                    .list('', { search: filename });

                if (existing && existing.length > 0) {
                    console.log(`⏭️  ${filename} - já existe no Supabase`);
                    skipped++;
                    continue;
                }

                // Ler arquivo local
                const filepath = path.join(uploadsDir, filename);
                const fileBuffer = readFileSync(filepath);

                // Detectar tipo de arquivo
                const ext = path.extname(filename).toLowerCase();
                const contentType = {
                    '.jpg': 'image/jpeg',
                    '.jpeg': 'image/jpeg',
                    '.png': 'image/png',
                    '.gif': 'image/gif',
                    '.webp': 'image/webp',
                }[ext] || 'application/octet-stream';

                // Upload para Supabase
                const { error } = await supabase.storage
                    .from('images')
                    .upload(filename, fileBuffer, {
                        contentType,
                        upsert: false
                    });

                if (error) {
                    console.log(`❌ ${filename} - Erro: ${error.message}`);
                    errors++;
                } else {
                    console.log(`✅ ${filename} - Migrado com sucesso`);
                    uploaded++;
                }
            } catch (err: any) {
                console.log(`❌ ${filename} - Erro: ${err.message}`);
                errors++;
            }
        }

        console.log('\n📊 Resumo:');
        console.log(`   ✅ Migrados: ${uploaded}`);
        console.log(`   ⏭️  Já existiam: ${skipped}`);
        console.log(`   ❌ Erros: ${errors}`);
        console.log(`   📁 Total: ${files.length}`);

        if (uploaded > 0) {
            console.log('\n💡 Próximo passo:');
            console.log('   Atualize as URLs no banco de dados de:');
            console.log('   /uploads/arquivo.jpg');
            console.log('   para:');
            console.log(`   ${supabaseUrl}/storage/v1/object/public/images/arquivo.jpg`);
        }

    } catch (error: any) {
        console.error('❌ Erro:', error.message);
        process.exit(1);
    }
}

migrateImages();
