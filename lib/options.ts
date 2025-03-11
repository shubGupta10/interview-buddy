import {NextAuthOptions} from 'next-auth'
import  CredentialsProvider  from 'next-auth/providers/credentials'
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from 'bcryptjs';
import prisma from './prisma';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {label: "Email", type: "email"},
                password: {label: "Password", type: "password"}
            },
            async authorize(credentials){
                if(!credentials?.email || !credentials?.password){
                    throw new Error("Please fill all fields")
                }

                try {
                     const user = await prisma.user.findUnique({ where: { email: credentials?.email } })

                     if(!user){
                        throw new Error("No User found")
                     }

                     // Check if this is a social login user trying to use credentials
                    if (user.provider === 'google' || user.provider === 'github') {
                        throw new Error(`Please use ${user.provider.charAt(0).toUpperCase() + user.provider.slice(1)} Sign-In for this account`);
                    }

                    if (!user.password) {
                        throw new Error("User password is missing");
                    }
                    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

                    if (!isPasswordValid) {
                        throw new Error("Invalid password");
                    }

                    return {
                        id: user.id.toString(),
                        email: user.email,
                        name: `${user.name}`,
                        image: user.profileImage,
                        provider: 'credentials'
                    };
                } catch (error) {
                    throw error;
                }
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string
        })
    ],

    callbacks: {
        async jwt({token, user, account}){
            if (user) {
                token.id = user.id;
                token.provider = account?.provider;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.provider = token.provider as string;
            }
            return session;
        },
        async signIn({ user, account }: { user: any; account: any }) {
            if (!user.email) {
                throw new Error("Email is required");
            }
        
            const existingUser = await prisma.user.findUnique({
                where: { email: user.email },
            });
        
            // For OAuth Sign In (Google or GitHub)
            if (account?.provider === "google" || account?.provider === "github") {
                if (existingUser) {
                    if (existingUser.provider === "credentials") {
                        throw new Error(
                            "This email is already registered with a password. Please use password to log in."
                        );
                    }
        
                    await prisma.user.update({
                        where: { email: user.email },
                        data: {
                            name: user.name || existingUser.name,
                            provider: account.provider,
                            createdAt: existingUser.createdAt, 
                        },
                    });
                } else {
                    await prisma.user.create({
                        data: {
                            name: user.name || "",
                            email: user.email,
                            provider: account.provider,
                            isAdmin: false,
                            createdAt: new Date(),
                            profileImage: user.image || "", 
                        },
                    });
                }
                return true;
            }
        
            // For Credentials Sign In
            if (account?.provider === "credentials") {
                if (!existingUser) {
                    throw new Error("No user found with this email");
                }
        
                if (existingUser.provider === "google" || existingUser.provider === "github") {
                    throw new Error(
                        `This email is registered with ${existingUser.provider}. Please use ${existingUser.provider} Sign In.`
                    );
                }
        
                // Update last login time
                await prisma.user.update({
                    where: { email: user.email },
                    data: {
                        createdAt: existingUser.createdAt, 
                    },
                });
        
                return true;
            }
        
            return false;
        }
    },
    pages: {
        signIn: "/auth/login",
        error:  "/auth/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },
    secret: process.env.NEXTAUTH_SECRET
}