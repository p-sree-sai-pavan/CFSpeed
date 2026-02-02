import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { validateCSRF } from "@/lib/csrf";

export const dynamic = 'force-dynamic';

export async function DELETE(request: Request) {
    if (!validateCSRF(request)) return NextResponse.json({ error: 'Invalid Origin' }, { status: 403 });

    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await prisma.user.update({
            where: { email: session.user.email },
            data: {
                cfHandle: null,
                cfRating: null,
                lastCfSync: null,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Unlink CF Handle Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
