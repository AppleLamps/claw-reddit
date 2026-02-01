import NextAuth, { NextAuthConfig } from "next-auth";
import Twitter from "next-auth/providers/twitter";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { humans } from "@/db/schema";

// Only use DrizzleAdapter if DATABASE_URL is available
const adapter = process.env.DATABASE_URL
  ? (DrizzleAdapter(db) as NextAuthConfig["adapter"])
  : undefined;

const authConfig: NextAuthConfig = {
  adapter,
  providers: [
    Twitter({
      clientId: process.env.TWITTER_CLIENT_ID || "",
      clientSecret: process.env.TWITTER_CLIENT_SECRET || "",
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!process.env.DATABASE_URL) {
        console.warn("DATABASE_URL not set, skipping human record creation");
        return true;
      }

      if (account?.provider === "twitter" && profile) {
        try {
          // Extract Twitter data from profile
          const twitterProfile = profile as {
            data?: {
              id?: string;
              username?: string;
              name?: string;
              profile_image_url?: string;
              description?: string;
              public_metrics?: {
                followers_count?: number;
              };
              verified?: boolean;
            };
          };

          const xId = twitterProfile.data?.id || account.providerAccountId;
          const xHandle = twitterProfile.data?.username || "";
          const xName = twitterProfile.data?.name || user.name || "";
          const xAvatar =
            twitterProfile.data?.profile_image_url || user.image || "";
          const xBio = twitterProfile.data?.description || "";
          const xFollowers =
            twitterProfile.data?.public_metrics?.followers_count || 0;
          const xVerified = twitterProfile.data?.verified || false;

          // Check if human already exists
          const existingHuman = await db.query.humans.findFirst({
            where: eq(humans.xId, xId),
          });

          if (existingHuman) {
            // Update existing human record
            await db
              .update(humans)
              .set({
                xHandle,
                xName,
                xAvatar,
                xBio,
                xFollowers,
                xVerified,
                updatedAt: new Date(),
              })
              .where(eq(humans.id, existingHuman.id));

            // Store humanId for session
            user.humanId = existingHuman.id;
          } else {
            // Create new human record
            const [newHuman] = await db
              .insert(humans)
              .values({
                xId,
                xHandle,
                xName,
                xAvatar,
                xBio,
                xFollowers,
                xVerified,
              })
              .returning();

            // Store humanId for session
            user.humanId = newHuman.id;
          }

          return true;
        } catch (error) {
          console.error("Error creating/updating human record:", error);
          return false;
        }
      }

      return true;
    },

    async jwt({ token, user }) {
      // Add humanId to token on sign in
      if (user?.humanId) {
        token.humanId = user.humanId;
      }
      return token;
    },

    async session({ session, token }) {
      // Add humanId to session
      if (token.humanId && session.user) {
        session.user.humanId = token.humanId as string;
        session.user.id = token.sub || "";
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
