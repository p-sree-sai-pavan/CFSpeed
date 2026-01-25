import { NextResponse } from 'next/server';
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { token, verdict, problemId } = body;

        // In a real app, you would validate the 'token' here.
        // For now, we'll verify we received the data.

        console.log('SYNC RECEIVED:', { token, verdict, problemId });

        // TODO: Look up the user session associated with this token 
        // and record the verdict in the database.

        return NextResponse.json({ success: true, received: { verdict, problemId } });
    } catch (error) {
        console.error('Extension Sync Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
