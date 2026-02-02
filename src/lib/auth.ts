import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async session({ session, user }: any) {
            if (session.user) {
                session.user.id = user.id;
                // User object from adapter typically contains all fields from DB
                // We cast to any to access custom fields if types aren't fully extended,
                // avoiding the extra DB query.
                const adapterUser = user as any;
                session.user.cfHandle = adapterUser.cfHandle;
                session.user.cfRating = adapterUser.cfRating;
            }
            return session;
        },
    },
    debug: process.env.NEXTAUTH_DEBUG === 'true',
};
