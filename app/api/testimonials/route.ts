import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// GET all testimonials
export async function GET() {
    try {
        const testimonials = await db.getTestimonials();
        return NextResponse.json(testimonials);
    } catch (error) {
        console.error('Error fetching testimonials:', error);
        return NextResponse.json({ error: 'Erro ao buscar relatos' }, { status: 500 });
    }
}

// POST create new testimonial
export async function POST(request: NextRequest) {
    try {
        const { name, content, role, published } = await request.json();

        const testimonial = await db.createTestimonial({
            name,
            content,
            role: role || null,
            published: published ?? true,
        });

        return NextResponse.json({ success: true, id: testimonial.id });
    } catch (error) {
        console.error('Error creating testimonial:', error);
        return NextResponse.json({ error: 'Erro ao criar relato' }, { status: 500 });
    }
}

// PUT update testimonial
export async function PUT(request: NextRequest) {
    try {
        const { id, name, content, role, published } = await request.json();

        const testimonial = await db.updateTestimonial(id, {
            name,
            content,
            role: role || null,
            published,
        });

        return NextResponse.json({ success: true, testimonial });
    } catch (error) {
        console.error('Error updating testimonial:', error);
        return NextResponse.json({ error: 'Erro ao atualizar relato' }, { status: 500 });
    }
}

// DELETE testimonial
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID não fornecido' }, { status: 400 });
        }

        await db.deleteTestimonial(parseInt(id));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting testimonial:', error);
        return NextResponse.json({ error: 'Erro ao deletar relato' }, { status: 500 });
    }
}
