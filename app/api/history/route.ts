import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// GET all history items
export async function GET() {
    try {
        const items = await db.getHistoryItems();
        return NextResponse.json(items);
    } catch (error) {
        console.error('Error fetching history items:', error);
        return NextResponse.json({ error: 'Erro ao buscar itens do histórico' }, { status: 500 });
    }
}

// POST create new history item
export async function POST(request: NextRequest) {
    try {
        const { title, content, image_url, order_index } = await request.json();

        const item = await db.createHistoryItem({
            title,
            content,
            image_url: image_url || null,
            order_index: order_index || 0,
        });

        return NextResponse.json({ success: true, id: item.id });
    } catch (error) {
        console.error('Error creating history item:', error);
        return NextResponse.json({ error: 'Erro ao criar item do histórico' }, { status: 500 });
    }
}

// PUT update history item
export async function PUT(request: NextRequest) {
    try {
        const { id, title, content, image_url, order_index } = await request.json();

        const item = await db.updateHistoryItem(id, {
            title,
            content,
            image_url: image_url || null,
            order_index,
        });

        return NextResponse.json({ success: true, item });
    } catch (error) {
        console.error('Error updating history item:', error);
        return NextResponse.json({ error: 'Erro ao atualizar item do histórico' }, { status: 500 });
    }
}

// DELETE history item
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID não fornecido' }, { status: 400 });
        }

        await db.deleteHistoryItem(parseInt(id));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting history item:', error);
        return NextResponse.json({ error: 'Erro ao deletar item do histórico' }, { status: 500 });
    }
}
