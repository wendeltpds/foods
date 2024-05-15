import { PrismaAdapter } from "@auth/prisma-adapter";
import { Adapter } from "next-auth/adapters";
import { db } from "./prisma";
import GoogleProviders from "next-auth/providers/google";
import { AuthOptions } from "next-auth";

export const authOptions:AuthOptions = {
    adapter: PrismaAdapter(db) as Adapter ,

    providers: [
        GoogleProviders({
          clientId: process.env.GOOGLE_CLIENT_ID as string ,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET as string 
      }),
    ],
    callbacks: {
      async session({session, user}) {
        session.user = {...session.user, id: user.id};
        return session;
      }
    }
}

function GoogleProvider(arg0: { clientId: string; clientSecret: string; }) {
    throw new Error("Function not implemented.");
}
