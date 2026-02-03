import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { verifyCFHandle } from "@/lib/codeforces";
import { rateLimit } from "@/lib/ratelimit";
import { validateCSRF } from "@/lib/csrf";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    if (!validateCSRF(request)) return NextResponse.json({ error: 'Invalid Origin' }, { status: 403 });

    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const limit = await rateLimit(ip, { limit: 10, windowMs: 60 * 1000 });
    if (!limit.success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

    // 1. Check Auth
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        let { handle } = body;

        // [H-1] Strict Input Validation
        if (!handle || typeof handle !== 'string') {
            return NextResponse.json({ error: 'Handle is required' }, { status: 400 });
        }

        handle = handle.trim();
        // CF handles: 3-24 chars, alphanumeric + underscore/hyphen
        if (handle.length < 3 || handle.length > 24 || !/^[a-zA-Z0-9_\-]+$/.test(handle)) {
            return NextResponse.json({ error: 'Invalid handle format' }, { status: 400 });
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
                // Reset sync state for new handle
                lastCfSync: null,
                lastSyncedSubmissionId: null,
                solvedProblemIds: [],
            } as any,
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
