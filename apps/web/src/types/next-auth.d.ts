// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  /**
   * When using the Credentials Provider the user object is the
   * response returned from the authorize callback
   */
  interface User extends DefaultUser {
    ethAddress: string;
    roles: {
      id: string;
      name: string;
    }[];
  }

  /**
   * Returned by `useSession`, `getSession` and received as a prop on
   * the `SessionProvider` React Context
   */
  interface Session {
    user: {} & User;
  }
}
