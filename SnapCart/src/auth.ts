import NextAuth,{CredentialsSignin} from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import connectDB from "./lib/db";
import User from "./models/user_model";
import bcrypt from "bcryptjs";

class UserNotFoundError extends CredentialsSignin {
  code = "USER_NOT_FOUND"
}

class WrongPasswordError extends CredentialsSignin {
  code = "WRONG_PASSWORD"
}


export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        console.log("=== AUTHORIZE CALLED ===", credentials?.email)
        if (!credentials?.email || !credentials?.password) {
          return null 
        }

        await connectDB();
        const email = credentials.email;
        const password = credentials.password as string;
        const user = await User.findOne({ email });
        if (!user) {
          console.log("User not EXIst");
           throw new UserNotFoundError() 
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          console.log("User Does not Match");
          throw new WrongPasswordError() 
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    // we will put our data in token through jwt

    async signIn({ user, account }) {
      if (account?.provider == "google") {
        try {
          await connectDB(); // Move this inside try-catch

          const name = user.name;
          const email = user.email;
          let dbUser = await User.findOne({ email });

          if (!dbUser) {
            dbUser = await User.create({
              name,
              email,
              image: user.image,
            });
          }

          user.id = dbUser._id.toString();
          user.role = dbUser.role;
          console.log(user);
          return true;
        } catch (err) {
          console.log("Google Auth Error", err);
          return false;
        }
      }
      return true; // For non-Google providers (credentials, etc.)
    },
    jwt({ token, user }) {
      //user will come from the authorise function
      // if authorised then real user or null
      if (user) {
        ((token.id = user.id),
          (token.name = user.name),
          (token.email = user.email),
          //type 'User | AdapterUser' = NextAuth user ka official TypeScript type
          // • Property does not exist on type 'User' = default User type me role field defined nahi hai
          (token.role = user.role));
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        ((session.user.id = token.id as string),
          (session.user.email = token.email as string),
          (session.user.name = token.name as string));
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 10 * 24 * 60 * 60 * 1000,
    //10- dayss
  },
  secret: process.env.NEXTAUTH_SECRET,
});

// | Feature                  | **Session**                       | **Token**                 |
// | ------------------------ | --------------------------------- | ------------------------- |
// | **Where data is stored** | Server memory / DB                | Client side (browser/app) |
// | **What client stores**   | Only a session ID                 | The full token itself     |
// | **Scalability**          | Hard to scale                     | Very scalable             |
// | **Best for**             | Traditional websites              | Modern apps, APIs, mobile |
// | **Example**              | Logged-in user on a shopping site | JWT used to call an API   |

// Session (Server-side login state)
// How it works

// • User logs in → server creates a session
// • Server stores user details such as:
// • user id
// • login time
// • permissions
// • Server sends a session ID to the browser
// • Browser stores the session ID inside a cookie
// • On every request:
// • Browser sends session ID from cookie
// • Server finds the stored session
// • User stays logged in

// Common uses

// • Page navigation while logged in
// • Shopping cart storage
// • Admin dashboard access
// • Websites where server manages user state

// Token (Client-side authentication)
// How it works

// • User logs in → server generates a token (usually JWT)
// • Token contains encoded data like:
// • user id
// • role
// • expiry time
// • Token is sent to client
// • Client stores token in:
// • LocalStorage
// • Cookies
// • App memory
// • For every API request:
// • Token is attached to request
// • Server verifies token signature & expiry
// • Access allowed if valid

// Common uses

// • API authentication
// • Mobile apps
// • Single Page Apps (React, MERN, etc.)
// • Microservices communication
// • Distributed / multi-server systems
