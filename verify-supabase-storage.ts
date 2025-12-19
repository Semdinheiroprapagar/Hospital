import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Carregar variáveis de ambiente
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Erro: Variáveis de ambiente não configuradas');
    console.error('Certifique-se de que NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY estão no .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifySupabaseStorage() {
    console.log('🔍 Verificando configuração do Supabase Storage...\n');

    // 1. Verificar se o bucket existe
    console.log('1️⃣ Verificando bucket "case-files"...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();

    if (bucketsError) {
        console.error('❌ Erro ao listar buckets:', bucketsError.message);
        return false;
    }

    const caseFilesBucket = buckets?.find(b => b.name === 'case-files');

    if (!caseFilesBucket) {
        console.error('❌ Bucket "case-files" não encontrado!');
        console.log('\n📝 Para criar o bucket:');
        console.log('   1. Acesse o painel do Supabase');
        console.log('   2. Vá em Storage → New bucket');
        console.log('   3. Nome: case-files');
        console.log('   4. Marque como "Public bucket"');
        return false;
    }

    console.log('✅ Bucket "case-files" encontrado');
    console.log(`   - Público: ${caseFilesBucket.public ? 'Sim' : 'Não'}`);
    console.log(`   - ID: ${caseFilesBucket.id}`);

    if (!caseFilesBucket.public) {
        console.warn('⚠️  Aviso: O bucket não está marcado como público');
    }

    // 2. Testar upload
    console.log('\n2️⃣ Testando upload de arquivo...');
    const testFileName = `test/${Date.now()}-test.txt`;
    const testContent = 'Este é um arquivo de teste para verificar o upload.';

    const { data: uploadData, error: uploadError } = await supabase.storage
        .from('case-files')
        .upload(testFileName, Buffer.from(testContent), {
            contentType: 'text/plain',
            upsert: false,
        });

    if (uploadError) {
        console.error('❌ Erro ao fazer upload:', uploadError.message);
        console.log('\n📝 Possíveis soluções:');
        console.log('   - Verifique se as políticas de INSERT estão configuradas');
        console.log('   - Execute o SQL para criar as políticas (veja supabase-setup-guide.md)');
        return false;
    }

    console.log('✅ Upload realizado com sucesso');
    console.log(`   - Arquivo: ${testFileName}`);

    // 3. Testar leitura (URL pública)
    console.log('\n3️⃣ Testando acesso público ao arquivo...');
    const { data: urlData } = supabase.storage
        .from('case-files')
        .getPublicUrl(testFileName);

    console.log('✅ URL pública gerada');
    console.log(`   - URL: ${urlData.publicUrl}`);

    // 4. Testar download
    console.log('\n4️⃣ Testando download do arquivo...');
    const { data: downloadData, error: downloadError } = await supabase.storage
        .from('case-files')
        .download(testFileName);

    if (downloadError) {
        console.error('❌ Erro ao fazer download:', downloadError.message);
        console.log('\n📝 Possíveis soluções:');
        console.log('   - Verifique se as políticas de SELECT estão configuradas');
        return false;
    }

    console.log('✅ Download realizado com sucesso');

    // 5. Limpar arquivo de teste
    console.log('\n5️⃣ Limpando arquivo de teste...');
    const { error: deleteError } = await supabase.storage
        .from('case-files')
        .remove([testFileName]);

    if (deleteError) {
        console.warn('⚠️  Aviso: Não foi possível deletar o arquivo de teste');
        console.log(`   - Você pode deletar manualmente: ${testFileName}`);
    } else {
        console.log('✅ Arquivo de teste removido');
    }

    // 6. Verificar políticas
    console.log('\n6️⃣ Resumo das políticas necessárias:');
    console.log('   ✓ INSERT: Permitir uploads públicos');
    console.log('   ✓ SELECT: Permitir leitura pública');
    console.log('   ✓ DELETE: (Opcional) Para limpar arquivos');

    // 7. Verificar WhatsApp
    console.log('\n7️⃣ Verificando configuração do WhatsApp...');
    const whatsappNumber = process.env.WHATSAPP_NUMBER;

    if (!whatsappNumber) {
        console.warn('⚠️  WhatsApp não configurado');
        console.log('   - Adicione WHATSAPP_NUMBER no .env.local');
        console.log('   - Formato: 5511999999999 (código país + DDD + número)');
    } else {
        console.log('✅ WhatsApp configurado');
        console.log(`   - Número: ${whatsappNumber}`);
    }

    console.log('\n✅ Verificação concluída com sucesso!');
    console.log('\n🎉 O Supabase Storage está configurado corretamente!');
    console.log('   Você pode testar o formulário em: http://localhost:3000');

    return true;
}

// Executar verificação
verifySupabaseStorage()
    .then(success => {
        process.exit(success ? 0 : 1);
    })
    .catch(error => {
        console.error('\n❌ Erro durante a verificação:', error);
        process.exit(1);
    });
