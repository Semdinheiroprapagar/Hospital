import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// GET all banners
export async function GET() {
    try {
        const banners = await db.getBanners();
        return NextResponse.json(banners);
    } catch (error) {
        console.error('Error fetching banners:', error);
        return NextResponse.json({ error: 'Erro ao buscar banners' }, { status: 500 });
    }
}

// POST create new banner
export async function POST(request: NextRequest) {
    try {
        const { image_url, order_index } = await request.json();

        const banner = await db.createBanner({
            image_url,
            order_index,
        });

        return NextResponse.json({ success: true, id: banner.id });
    } catch (error) {
        console.error('Error creating banner:', error);
        return NextResponse.json({ error: 'Erro ao criar banner' }, { status: 500 });
    }
}

// PUT update banner
export async function PUT(request: NextRequest) {
    try {
        const { id, image_url, order_index } = await request.json();

        const banner = await db.updateBanner(id, {
            image_url,
            order_index,
        });

        return NextResponse.json({ success: true, banner });
    } catch (error) {
        console.error('Error updating banner:', error);
        return NextResponse.json({ error: 'Erro ao atualizar banner' }, { status: 500 });
    }
}

// DELETE banner
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID não fornecido' }, { status: 400 });
        }

        await db.deleteBanner(parseInt(id));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting banner:', error);
        return NextResponse.json({ error: 'Erro ao deletar banner' }, { status: 500 });
    }
}
