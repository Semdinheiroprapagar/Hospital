import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
    try {
        const cards = await db.getContactCards();
        return NextResponse.json(cards);
    } catch (error) {
        console.error('Error fetching contact cards:', error);
        return NextResponse.json(
            { error: 'Failed to fetch contact cards' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const { type, title, content, image_url, order_index } = data;

        if (!type) {
            return NextResponse.json(
                { error: 'Type is required' },
                { status: 400 }
            );
        }

        const card = await db.createContactCard({
            type: type as 'image' | 'text',
            title: title || null,
            content: content || null,
            image_url: image_url || null,
            order_index: order_index || 0,
        });

        return NextResponse.json(card);
    } catch (error) {
        console.error('Error creating contact card:', error);
        return NextResponse.json(
            { error: 'Failed to create contact card' },
            { status: 500 }
        );
    }
}
