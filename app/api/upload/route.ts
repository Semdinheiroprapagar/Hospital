import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            console.error('Upload error: No file provided');
            return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
        }

        console.log('Upload attempt:', {
            filename: file.name,
            type: file.type,
            size: file.size
        });

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            console.error('Upload error: Invalid file type:', file.type);
            return NextResponse.json(
                { error: `Tipo de arquivo não permitido: ${file.type}. Use JPG, PNG, GIF ou WebP.` },
                { status: 400 }
            );
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
            console.error('Upload error: File too large:', sizeMB, 'MB');
            return NextResponse.json(
                { error: `Arquivo muito grande (${sizeMB}MB). Tamanho máximo: 5MB` },
                { status: 400 }
            );
        }

        // Check if using Supabase
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (supabaseUrl && supabaseKey) {
            // Use Supabase Storage
            console.log('Using Supabase Storage');

            const supabase = createClient(supabaseUrl, supabaseKey);

            // Generate unique filename
            const timestamp = Date.now();
            const originalName = file.name.replace(/\s+/g, '-');
            const filename = `${timestamp}-${originalName}`;

            // Convert file to buffer
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Upload to Supabase Storage
            const { data, error } = await supabase.storage
                .from('images')
                .upload(filename, buffer, {
                    contentType: file.type,
                    upsert: false
                });

            if (error) {
                console.error('Supabase upload error:', error);
                return NextResponse.json(
                    { error: `Erro ao fazer upload no Supabase: ${error.message}` },
                    { status: 500 }
                );
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('images')
                .getPublicUrl(filename);

            console.log('File uploaded to Supabase:', publicUrl);

            return NextResponse.json({
                success: true,
                url: publicUrl,
                filename: filename
            });
        } else {
            // Fallback to local storage (for development)
            console.log('Using local storage (development only)');

            const { writeFile, mkdir } = await import('fs/promises');
            const { existsSync } = await import('fs');
            const path = await import('path');

            const timestamp = Date.now();
            const originalName = file.name.replace(/\s+/g, '-');
            const filename = `${timestamp}-${originalName}`;

            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Ensure upload directory exists
            const uploadDir = path.join(process.cwd(), 'public', 'uploads');
            if (!existsSync(uploadDir)) {
                console.log('Creating uploads directory:', uploadDir);
                await mkdir(uploadDir, { recursive: true });
            }

            // Save file
            const filepath = path.join(uploadDir, filename);
            await writeFile(filepath, buffer);
            console.log('File saved locally:', filepath);

            // Return public URL
            const publicUrl = `/uploads/${filename}`;

            return NextResponse.json({
                success: true,
                url: publicUrl,
                filename: filename
            });
        }
    } catch (error: any) {
        console.error('Upload error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        return NextResponse.json(
            { error: `Erro ao fazer upload: ${error.message}` },
            { status: 500 }
        );
    }
}
