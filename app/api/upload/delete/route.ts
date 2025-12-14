import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const fileUrl = searchParams.get('url');

        if (!fileUrl) {
            return NextResponse.json({ error: 'URL do arquivo não fornecida' }, { status: 400 });
        }

        console.log('Delete attempt:', fileUrl);

        // Check if using Supabase
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (supabaseUrl && supabaseKey && fileUrl.includes('supabase')) {
            // Delete from Supabase Storage
            console.log('Deleting from Supabase Storage');

            const supabase = createClient(supabaseUrl, supabaseKey);

            // Extract filename from URL
            // URL format: https://xxx.supabase.co/storage/v1/object/public/images/filename.jpg
            const filename = fileUrl.split('/').pop();

            if (!filename) {
                return NextResponse.json({ error: 'Nome do arquivo inválido' }, { status: 400 });
            }

            const { error } = await supabase.storage
                .from('images')
                .remove([filename]);

            if (error) {
                console.error('Supabase delete error:', error);
                return NextResponse.json(
                    { error: `Erro ao deletar do Supabase: ${error.message}` },
                    { status: 500 }
                );
            }

            console.log('File deleted from Supabase:', filename);

            return NextResponse.json({
                success: true,
                message: 'Arquivo deletado com sucesso'
            });
        } else {
            // Delete from local storage (development)
            console.log('Deleting from local storage');

            const { unlink } = await import('fs/promises');
            const { existsSync } = await import('fs');
            const path = await import('path');

            // Extract filename from URL (/uploads/filename.jpg)
            const filename = fileUrl.split('/').pop();

            if (!filename) {
                return NextResponse.json({ error: 'Nome do arquivo inválido' }, { status: 400 });
            }

            const filepath = path.join(process.cwd(), 'public', 'uploads', filename);

            if (!existsSync(filepath)) {
                return NextResponse.json({ error: 'Arquivo não encontrado' }, { status: 404 });
            }

            await unlink(filepath);
            console.log('File deleted locally:', filepath);

            return NextResponse.json({
                success: true,
                message: 'Arquivo deletado com sucesso'
            });
        }
    } catch (error: any) {
        console.error('Delete error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        return NextResponse.json(
            { error: `Erro ao deletar arquivo: ${error.message}` },
            { status: 500 }
        );
    }
}
