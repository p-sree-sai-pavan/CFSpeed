import { NextResponse } from 'next/server';
import { getUpcomingContests } from '@/lib/cf';

// Cache this route for 5 minutes at the edge
export const revalidate = 300;

export async function GET() {
    try {
        const contests = await getUpcomingContests();
        return NextResponse.json(contests, {
            headers: {
                'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
            },
        });
    } catch (error) {
        console.error('Error fetching contests:', error);
        // Return empty array instead of failing - graceful degradation
        return NextResponse.json([], { status: 200 });
    }
}
