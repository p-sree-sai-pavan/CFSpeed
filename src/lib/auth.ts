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
                // Include CF handle in session if available in DB
                const dbUser = await prisma.user.findUnique({
                    where: { id: user.id },
                    select: { cfHandle: true, cfRating: true },
                });
                session.user.cfHandle = dbUser?.cfHandle;
                session.user.cfRating = dbUser?.cfRating;
            }
            return session;
        },
    },
    debug: true, // Enable debug logs for Vercel
};
