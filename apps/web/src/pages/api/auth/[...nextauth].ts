/* eslint-disable no-param-reassign */
import prisma from "@/utils/prisma";
import { Magic } from "@magic-sdk/admin";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { NextAuthOptions, SessionStrategy } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getCsrfToken } from "next-auth/react";
import { SiweMessage } from "siwe";

const mAdmin = new Magic(process.env.MAGIC_SECRET_API_KEY);

const querySessionUser = async (input: {
  id?: string;
  email?: string;
  ethAddress?: string;
}) => {
  const user = await prisma.user.findUnique({
    where: input,
    include: {
      roles: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
  return user;
};

const providers = [
  CredentialsProvider({
    name: "Ethereum",
    credentials: {
      message: {
        label: "Message",
        type: "text",
        placeholder: "0x0",
      },
      signature: {
        label: "Signature",
        type: "text",
        placeholder: "0x0",
      },
    },
    async authorize(credentials, req) {
      try {
        const siwe = new SiweMessage(JSON.parse(credentials?.message || "{}"));
        const nextAuthUrl = new URL(process.env.NEXTAUTH_URL!);

        const result = await siwe.verify({
          signature: credentials?.signature || "",
          domain: nextAuthUrl.host,
          nonce: await getCsrfToken({ req }),
        });

        if (!result.success) {
          return null;
        }
        const user = await querySessionUser({
          ethAddress: siwe.address.toLowerCase(),
        });
        if (!user) {
          throw Error("User not found. Must be registered first by admin.");
        }
        return user;
      } catch (e) {
        return null;
      }
    },
  }),
  CredentialsProvider({
    name: "Magic Link",
    id: "magic",
    credentials: {
      didToken: { label: "DID Token", type: "text" },
    },
    async authorize(credentials) {
      try {
        if (!credentials?.didToken) {
          return null;
        }
        // validate magic DID token
        mAdmin.token.validate(credentials.didToken);

        // fetch user metadata
        const metadata = await mAdmin.users.getMetadataByToken(
          credentials.didToken,
        );
        if (!metadata.email) {
          return null;
        }
        // Only allow login if user is already in the database (allowlisted)
        const user = await querySessionUser({ email: metadata.email });
        if (!user) {
          throw new Error(
            "No account found for email. Please login with your wallet first to associate this email to your account",
          );
        }
        return user;
      } catch (e) {
        return null;
      }
    },
  }),
];

export const authOptions: NextAuthOptions = {
  providers,
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.ethAddress = user.ethAddress;
        token.roles = user.roles;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      session.user.id = token.sub;
      session.user.ethAddress = token.ethAddress;
      session.user.roles = token.roles;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
};

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return NextAuth(req, res, authOptions);
}
