import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    const start = Date.now();
    try {
        // Actually test DB connection with a simple query
        await prisma.$queryRaw`SELECT 1`;
        const dbLatency = Date.now() - start;

        return NextResponse.json({
            status: 'ok',
            db: 'connected',
            dbLatencyMs: dbLatency,
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

