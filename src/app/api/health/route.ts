import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Try to connect to DB
        const userCount = await prisma.user.count();
        return NextResponse.json({
            status: 'ok',
            db: 'connected',
            userCount,
            timestamp: new Date().toISOString()
        }, { status: 200 });
    } catch (error: any) {
        console.error('Health Check DB Error:', error);
        return NextResponse.json({
            status: 'error',
            db: 'disconnected',
            error: error.message,
            timestamp: new Date().toISOString()
        }, { status: 500 });
    }
}
