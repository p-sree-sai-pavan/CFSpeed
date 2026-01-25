import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db";
import { verifyCFHandle } from "@/lib/cf";
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    // 1. Check Auth
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { handle } = body;

        if (!handle) {
            return NextResponse.json({ error: 'Handle is required' }, { status: 400 });
        }

        // 2. Verify with Codeforces
        const cfUser = await verifyCFHandle(handle);
        if (!cfUser) {
            return NextResponse.json({ error: 'Codeforces handle not found' }, { status: 404 });
        }

        // 3. Check if handle is already taken by another user
        const existingUser = await prisma.user.findUnique({
            where: { cfHandle: cfUser.handle },
        });

        if (existingUser && existingUser.email !== session.user.email) {
            return NextResponse.json({ error: 'Handle already linked to another account' }, { status: 409 });
        }

        // 4. Link to current user
        const updatedUser = await prisma.user.update({
            where: { email: session.user.email },
            data: {
                cfHandle: cfUser.handle, // Use canonical handle from CF (case-corrected)
                cfRating: cfUser.rating || 0,
                image: session.user.image, // Keep existing image or update if needed
            },
        });

        return NextResponse.json({
            success: true,
            user: {
                handle: updatedUser.cfHandle,
                rating: updatedUser.cfRating
            }
        });

    } catch (error) {
        console.error('Link CF Handle Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
