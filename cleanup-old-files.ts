import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Erro: Variáveis de ambiente não configuradas');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Configuração: Deletar arquivos com mais de X dias
const DAYS_TO_KEEP = 30; // Altere este valor conforme necessário

async function cleanupOldFiles() {
    console.log(`🧹 Limpando arquivos com mais de ${DAYS_TO_KEEP} dias...\n`);

    try {
        // Listar todos os arquivos no bucket
        const { data: files, error: listError } = await supabase.storage
            .from('case-files')
            .list('', {
                limit: 1000,
                sortBy: { column: 'created_at', order: 'asc' },
            });

        if (listError) {
            console.error('❌ Erro ao listar arquivos:', listError.message);
            return;
        }

        if (!files || files.length === 0) {
            console.log('✅ Nenhum arquivo encontrado no bucket');
            return;
        }

        // Calcular data limite
        const now = new Date();
        const cutoffDate = new Date(now.getTime() - DAYS_TO_KEEP * 24 * 60 * 60 * 1000);

        console.log(`📅 Data limite: ${cutoffDate.toLocaleString('pt-BR')}`);
        console.log(`📊 Total de arquivos no bucket: ${files.length}\n`);

        // Filtrar arquivos antigos
        const filesToDelete: string[] = [];

        for (const file of files) {
            // Pular diretórios
            if (!file.name || file.name.endsWith('/')) continue;

            const fileDate = new Date(file.created_at);

            if (fileDate < cutoffDate) {
                filesToDelete.push(file.name);
                console.log(`🗑️  Marcado para deletar: ${file.name}`);
                console.log(`   Criado em: ${fileDate.toLocaleString('pt-BR')}`);
                console.log(`   Idade: ${Math.floor((now.getTime() - fileDate.getTime()) / (24 * 60 * 60 * 1000))} dias\n`);
            }
        }

        if (filesToDelete.length === 0) {
            console.log('✅ Nenhum arquivo antigo encontrado para deletar');
            return;
        }

        console.log(`\n📋 Total de arquivos a deletar: ${filesToDelete.length}`);
        console.log('⏳ Deletando arquivos...\n');

        // Deletar arquivos em lotes de 50
        const batchSize = 50;
        let deletedCount = 0;
        let errorCount = 0;

        for (let i = 0; i < filesToDelete.length; i += batchSize) {
            const batch = filesToDelete.slice(i, i + batchSize);

            const { error: deleteError } = await supabase.storage
                .from('case-files')
                .remove(batch);

            if (deleteError) {
                console.error(`❌ Erro ao deletar lote ${Math.floor(i / batchSize) + 1}:`, deleteError.message);
                errorCount += batch.length;
            } else {
                deletedCount += batch.length;
                console.log(`✅ Lote ${Math.floor(i / batchSize) + 1} deletado (${batch.length} arquivos)`);
            }
        }

        console.log('\n📊 Resumo da limpeza:');
        console.log(`   ✅ Arquivos deletados: ${deletedCount}`);
        if (errorCount > 0) {
            console.log(`   ❌ Erros: ${errorCount}`);
        }
        console.log(`   💾 Espaço liberado: ~${(deletedCount * 0.5).toFixed(2)} MB (estimativa)`);

        console.log('\n🎉 Limpeza concluída!');
    } catch (error) {
        console.error('\n❌ Erro durante a limpeza:', error);
        process.exit(1);
    }
}

// Executar limpeza
cleanupOldFiles()
    .then(() => {
        console.log('\n✅ Script finalizado com sucesso');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Erro fatal:', error);
        process.exit(1);
    });
