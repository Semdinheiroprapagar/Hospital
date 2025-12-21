import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { trackCaseAnalysisSubmission } from '@/lib/facebook-conversions';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
    try {
        // Parse form data
        const formData = await request.formData();
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const phone = formData.get('phone') as string;
        const message = formData.get('message') as string;
        const file = formData.get('file') as File;

        // Validation
        if (!name || !email || !phone || !file) {
            return NextResponse.json(
                { error: 'Todos os campos obrigatórios devem ser preenchidos' },
                { status: 400 }
            );
        }

        // Validate file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json(
                { error: 'Arquivo muito grande. Tamanho máximo: 10MB' },
                { status: 400 }
            );
        }

        // Validate file type
        const allowedTypes = [
            'application/pdf',
            'image/jpeg',
            'image/jpg',
            'image/png',
            'application/dicom',
        ];
        if (!allowedTypes.includes(file.type) && !file.name.match(/\.(pdf|jpe?g|png|dcm|dicom)$/i)) {
            return NextResponse.json(
                { error: 'Tipo de arquivo não suportado' },
                { status: 400 }
            );
        }

        // Upload to Supabase Storage
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Create file path with date organization
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const timestamp = Date.now();
        const fileExt = file.name.split('.').pop();
        const fileName = `${year}/${month}/${day}/${timestamp}-${name.replace(/\s+/g, '-')}.${fileExt}`;

        // Convert File to ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload file
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('case-files')
            .upload(fileName, buffer, {
                contentType: file.type,
                upsert: false,
            });

        if (uploadError) {
            console.error('Supabase upload error:', uploadError);
            return NextResponse.json(
                { error: 'Erro ao fazer upload do arquivo' },
                { status: 500 }
            );
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('case-files')
            .getPublicUrl(fileName);

        const fileUrl = urlData.publicUrl;

        // Create WhatsApp message
        const whatsappNumber = process.env.WHATSAPP_NUMBER || '';
        let whatsappUrl = '';

        if (whatsappNumber) {
            const whatsappMessage = encodeURIComponent(
                `🏥 *Nova Solicitação de Análise de Caso*\n\n` +
                `👤 *Nome:* ${name}\n` +
                `📧 *Email:* ${email}\n` +
                `📱 *Telefone:* ${phone}\n` +
                `💬 *Mensagem:* ${message || 'Não informada'}\n\n` +
                `📎 *Arquivo:* ${fileUrl}\n\n` +
                `_Enviado em ${date.toLocaleString('pt-BR')}_`
            );
            whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
        }

        // Track Facebook Conversion
        try {
            await trackCaseAnalysisSubmission({
                email,
                phone,
                name,
                eventSourceUrl: request.url,
                clientIp: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
                userAgent: request.headers.get('user-agent') || undefined,
            });
        } catch (fbError) {
            console.error('Facebook tracking error:', fbError);
            // Não falhar a requisição se o tracking falhar
        }

        return NextResponse.json({
            success: true,
            fileUrl,
            whatsappUrl,
            message: 'Solicitação enviada com sucesso!',
        });
    } catch (error) {
        console.error('Error processing case analysis request:', error);
        return NextResponse.json(
            { error: 'Erro ao processar solicitação' },
            { status: 500 }
        );
    }
}
