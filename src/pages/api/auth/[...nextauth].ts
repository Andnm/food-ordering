import NextAuth, { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import moment from "moment";
import user from "@services/user";

export default NextAuth({
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const loginResult = await user.loginWithUsername(
          credentials.username,
          credentials.password
        );

        const userProfile = await user.getUserProfile(loginResult.token);

        if (loginResult) {
          const user = {
            id: userProfile.user_id,
            name: userProfile.name,
            token: loginResult.token,
            email: userProfile.email,
            role_id: userProfile.role_id,
          } as User;
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, trigger, session, user }) {
      if (user) {
        token.token = user.token;
        token.expiresIn = user.expiresIn;
        token.loginDate = user.loginDate;
        token.email = user.email;
        token.userId = user.userId;
        token.userName = user.userName;
        token.currenNoticeCount = user.currenNoticeCount;
        token.roles = user.roles;
        token.role_id = user.role_id;
      }
      if (trigger === "update" && session) {
        return { ...token, ...session?.user };
      }
      return token;
    },
    async session({ session, token, user }) {
      if (session) {
        session.expires = moment(token.loginDate)
          .add(token.expiresIn, "seconds")
          .toDate();
        session.user.token = token.token;
        // session.user.email = token.email;
        session.user.userName = token.userName;
        session.user.userId = token.userId;
        session.user.roles = token.roles;
        session.user.role_id = token.role_id
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
