import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Configuração: Deletar arquivos com mais de 1 dia
const DAYS_TO_KEEP = 1;

export async function GET(request: Request) {
    // Verificar autorização (apenas Vercel Cron pode chamar)
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Listar todos os arquivos
        const { data: files, error: listError } = await supabase.storage
            .from('case-files')
            .list('', {
                limit: 1000,
                sortBy: { column: 'created_at', order: 'asc' },
            });

        if (listError) {
            return NextResponse.json({ error: listError.message }, { status: 500 });
        }

        if (!files || files.length === 0) {
            return NextResponse.json({ message: 'No files found', deleted: 0 });
        }

        // Calcular data limite
        const now = new Date();
        const cutoffDate = new Date(now.getTime() - DAYS_TO_KEEP * 24 * 60 * 60 * 1000);

        // Filtrar arquivos antigos
        const filesToDelete: string[] = [];

        for (const file of files) {
            if (!file.name || file.name.endsWith('/')) continue;

            const fileDate = new Date(file.created_at);
            if (fileDate < cutoffDate) {
                filesToDelete.push(file.name);
            }
        }

        if (filesToDelete.length === 0) {
            return NextResponse.json({ message: 'No old files to delete', deleted: 0 });
        }

        // Deletar arquivos
        const { error: deleteError } = await supabase.storage
            .from('case-files')
            .remove(filesToDelete);

        if (deleteError) {
            return NextResponse.json({ error: deleteError.message }, { status: 500 });
        }

        return NextResponse.json({
            message: 'Cleanup completed',
            deleted: filesToDelete.length,
            files: filesToDelete,
        });
    } catch (error) {
        console.error('Cleanup error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
