import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      humanId: string;
    } & DefaultSession["user"];
  }

  interface User {
    humanId?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    humanId?: string;
  }
}
