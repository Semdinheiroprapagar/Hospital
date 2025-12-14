import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

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

        // Generate unique filename
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const timestamp = Date.now();
        const originalName = file.name.replace(/\s+/g, '-');
        const filename = `${timestamp}-${originalName}`;

        // Ensure upload directory exists
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        if (!existsSync(uploadDir)) {
            console.log('Creating uploads directory:', uploadDir);
            await mkdir(uploadDir, { recursive: true });
        }

        // Save file
        const filepath = path.join(uploadDir, filename);
        await writeFile(filepath, buffer);
        console.log('File saved successfully:', filepath);

        // Return public URL
        const publicUrl = `/uploads/${filename}`;

        return NextResponse.json({
            success: true,
            url: publicUrl,
            filename: filename
        });
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
