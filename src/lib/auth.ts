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
    session: {
        strategy: "jwt"
    },
    callbacks: {
        async jwt({ token, user, trigger, session }: any) {
            if (user) {
                token.id = user.id;
                token.cfHandle = user.cfHandle;
                token.cfRating = user.cfRating;
            }
            // Update token if session data is updated
            if (trigger === "update" && session?.user) {
                token.cfHandle = session.user.cfHandle;
                token.cfRating = session.user.cfRating;
            }
            return token;
        },
        async session({ session, token }: any) {
            if (session.user) {
                session.user.id = token.id;
                session.user.cfHandle = token.cfHandle;
                session.user.cfRating = token.cfRating;
            }
            return session;
        },
    },
    debug: process.env.NEXTAUTH_DEBUG === 'true',
};
