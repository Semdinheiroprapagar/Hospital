// Setup Supabase Storage bucket automatically
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import path from 'path';

// Load .env.local
config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

async function setupStorage() {
    console.log('🗄️  Setting up Supabase Storage...\n');

    if (!supabaseUrl || !supabaseKey) {
        console.error('❌ Missing Supabase credentials!');
        process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        // Check if bucket exists
        const { data: buckets, error: listError } = await supabase.storage.listBuckets();

        if (listError) {
            console.error('❌ Error listing buckets:', listError.message);
            process.exit(1);
        }

        const imagesBucket = buckets?.find(b => b.name === 'images');

        if (imagesBucket) {
            console.log('✅ Bucket "images" already exists!');
        } else {
            console.log('📦 Creating bucket "images"...');

            const { data, error } = await supabase.storage.createBucket('images', {
                public: true,
                fileSizeLimit: 5242880, // 5MB
            });

            if (error) {
                console.error('❌ Error creating bucket:', error.message);
                console.log('\n💡 Você precisa criar o bucket manualmente:');
                console.log('1. Acesse: https://supabase.com/dashboard');
                console.log('2. Vá em Storage > Create bucket');
                console.log('3. Nome: images');
                console.log('4. Marque "Public bucket"');
                process.exit(1);
            }

            console.log('✅ Bucket "images" created successfully!');
        }

        console.log('\n📋 Next steps:');
        console.log('1. Configure as políticas de acesso no Supabase');
        console.log('2. Vá em Storage > images > Policies');
        console.log('3. Adicione as 3 políticas do guia: docs/supabase-storage-setup.md');
        console.log('\n✨ Pronto para usar!');

    } catch (error: any) {
        console.error('❌ Unexpected error:', error.message);
        process.exit(1);
    }
}

setupStorage();
