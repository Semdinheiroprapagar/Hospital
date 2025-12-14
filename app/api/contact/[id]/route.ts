import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const data = await request.json();
        const { type, title, content, image_url, order_index } = data;

        const card = await db.updateContactCard(parseInt(id), {
            type: type as 'image' | 'text',
            title: title || null,
            content: content || null,
            image_url: image_url || null,
            order_index: order_index || 0,
        });

        return NextResponse.json({ success: true, card });
    } catch (error) {
        console.error('Error updating contact card:', error);
        return NextResponse.json(
            { error: 'Failed to update contact card' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        await db.deleteContactCard(parseInt(id));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting contact card:', error);
        return NextResponse.json(
            { error: 'Failed to delete contact card' },
            { status: 500 }
        );
    }
}
