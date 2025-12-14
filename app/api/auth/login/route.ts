import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
    try {
        const { username, password } = await request.json();

        // Get user from database
        const user = await db.getAdminUser(username);

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'Credenciais inválidas' },
                { status: 401 }
            );
        }

        // Verify password
        const passwordMatch = await bcrypt.compare(password, user.password_hash);

        if (!passwordMatch) {
            return NextResponse.json(
                { success: false, error: 'Credenciais inválidas' },
                { status: 401 }
            );
        }

        // Login successful
        const response = NextResponse.json({ success: true });

        // Set authentication cookie
        response.cookies.set('admin-token', process.env.JWT_SECRET || 'secret', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { success: false, error: 'Erro no servidor' },
            { status: 500 }
        );
    }
}
