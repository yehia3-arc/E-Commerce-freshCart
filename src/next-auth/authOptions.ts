import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";
import { signOut } from "next-auth/react";

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "my Login",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@example.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "*******",
        },
      },
      // function to call api
      async authorize(credentials, req) {
        // Add your authentication logic here
        try {
          const res = await fetch(
            `https://ecommerce.routemisr.com/api/v1/auth/signin`,
            {
              method: "POST",
              body: JSON.stringify({
                email: credentials?.email,
                password: credentials?.password,
              }),
              headers: { "content-type": "application/json" },
            },
          );
          const response = await res.json();
          console.log("result of login", response);
          if (!res.ok) {
            throw new Error(response.message);
          }
          console.log("authrize resualt", response);
          // use it to generate enciped  token based on it
          // if res.ok? ===> save token ==> cookies
          const jwt: { id: string } = jwtDecode(response.token);

          return {
            id: jwt.id,
            name: response.user.name,
            email: response.user.email,
            accessToken: response.token,
          };
        } catch (err) {
          console.log("error from api", err);
          throw new Error((err as Error).message || "invalid login");
          // return null; // if error ==> go to error page
        }
      },
    }),
  ],
  // callbacks  ==> will be excute after successfully login | user - refresh  + getsession
  callbacks: {
    // recive user object from authorization function + token (jwt) + session
    jwt(param) {
      console.log("jwt param ..", param);
      // param.token ==> object next auth save in cookies
      if (param.user) {
        param.token.routeToken = param.user.accessToken;
        param.token.id = param.user.id;
      }

      // param.user ==> object return  from authorize function

      return param.token;
    },
    // when ??  ==> useSession() | getServerSession() | api/auth/session
    //
    session({ token, session }) {
      session.user.id = token.id;
      //param.session.token = param.token.routerToken;  ❌❌❌ ( token be in server not in browser)
      //console.log("session param ..", param);
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};
/* 
two types of token 

1 - access token  ===> returned from be    ====> used when we call api 
2- increpted token  => next auth token  => save inside cookies  => decreption

*/

/*
to generate secret key  => npx auth secret command  => next auth will use it automitcally 

*/
