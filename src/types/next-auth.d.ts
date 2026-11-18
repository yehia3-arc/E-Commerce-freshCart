import NextAuth from "next-auth";

declare module "next-auth" {
  /*
    RETURNED BY `useSession` , `getSession` and recieved as a prop on the `SessionProvider` React Context
    */
  interface User {
    id: string;
    name: string;
    email: string;
    accessToken: string;
  }
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string | undefined;
    };
    expires: string;
    id: string;
  }
}

declare module "next-auth/jwt" {
  // Returned by jwt callback and getToken , when using jwt session

  interface JWT {
    //open id token
    routeToken: string;
    id: string;
  }
}
