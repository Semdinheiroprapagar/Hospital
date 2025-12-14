import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// GET all posts or a specific post
export async function GET(request: NextRequest) {
    try {
        const startTime = Date.now();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (id) {
            const post = await db.getPost(parseInt(id));
            console.log(`⏱️  GET post ${id}: ${Date.now() - startTime}ms`);
            return NextResponse.json(post);
        }

        const posts = await db.getPosts();
        console.log(`⏱️  GET all posts: ${Date.now() - startTime}ms`);
        return NextResponse.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        return NextResponse.json({ error: 'Erro ao buscar posts' }, { status: 500 });
    }
}

// POST create new post
export async function POST(request: NextRequest) {
    try {
        const startTime = Date.now();
        const { title, content, image_url, published } = await request.json();

        console.log('📝 Creating post:', { title, hasImage: !!image_url });

        const post = await db.createPost({
            title,
            content,
            image_url: image_url || null,
            published: published ?? true,
        });

        console.log(`✅ POST created in ${Date.now() - startTime}ms`);
        return NextResponse.json({ success: true, id: post.id });
    } catch (error) {
        console.error('Error creating post:', error);
        return NextResponse.json({ error: 'Erro ao criar post' }, { status: 500 });
    }
}

// PUT update post
export async function PUT(request: NextRequest) {
    try {
        const { id, title, content, image_url, published } = await request.json();

        const post = await db.updatePost(id, {
            title,
            content,
            image_url: image_url || null,
            published,
        });

        return NextResponse.json({ success: true, post });
    } catch (error) {
        console.error('Error updating post:', error);
        return NextResponse.json({ error: 'Erro ao atualizar post' }, { status: 500 });
    }
}

// DELETE post
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID não fornecido' }, { status: 400 });
        }

        await db.deletePost(parseInt(id));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting post:', error);
        return NextResponse.json({ error: 'Erro ao deletar post' }, { status: 500 });
    }
}
