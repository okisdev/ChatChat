import type { NextAuthOptions } from 'next-auth';

import EmailProvider from 'next-auth/providers/email';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

import { PrismaAdapter } from '@next-auth/prisma-adapter';

import { database } from '@/lib/database';

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(database),
    callbacks: {
        // async signIn({ user, account, profile }) {
        //     console.log('signIn', user, account, profile);

        //     const existingUser = await database.user.findUnique({
        //         where: {
        //             email: user.email as string,
        //         },
        //     });

        //     let updateFields = {
        //         name: user?.name,
        //         email: user?.email,
        //         image: user?.image,
        //         platform: account?.provider,
        //         emailVerified: undefined,
        //     };

        //     if (existingUser && existingUser.platform && existingUser.platform !== 'email' && account?.provider === 'email') {
        //         updateFields.emailVerified = new Date() as any;
        //     }

        //     if (existingUser && existingUser.platform && existingUser.emailVerified) {
        //         return true; // Don't update anything
        //     }

        //     await database.user.upsert({
        //         where: {
        //             email: user.email as string,
        //         },
        //         create: {
        //             ...updateFields,
        //         },
        //         update: {
        //             ...updateFields,
        //         },
        //     });

        //     return true;
        // },
        async session({ token, session }) {
            if (token) {
                session.user.id = token.id;
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.image = token.picture;
            }

            return session;
        },
        async jwt({ token, user }) {
            const databaseUser = await database.user.findFirst({
                where: {
                    email: token.email,
                },
            });

            if (!databaseUser) {
                if (user) {
                    token.id = user?.id;
                }
                return token;
            }

            return {
                id: databaseUser.id,
                name: databaseUser.name,
                email: databaseUser.email,
                picture: databaseUser.image,
            };
        },
    },
    cookies: {
        sessionToken: {
            name: 'next-auth.session-token',
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production',
            },
        },
    },
    pages: {
        signIn: '/login',
    },
    providers: [
        EmailProvider({
            server: {
                host: process.env.EMAIL_HOST,
                port: Number(process.env.EMAIL_PORT) || 587,
                auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD,
                },
            },
            from: process.env.EMAIL_FORM,
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID || '',
            clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt',
    },
    debug: false,
};
