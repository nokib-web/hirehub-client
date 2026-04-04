import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          // You would typically sync this with your backend here
          // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://hirehub-server-ydm5.onrender.com/api'}/auth/google`, {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify({ email: user.email, name: user.name, image: user.image }),
          // });
          return true;
        } catch (error) {
          console.error("Error during Google sign in:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as {id?: string; name?: string | null; email?: string | null; image?: string | null}).id = token.id as string;
        (session.user as {id?: string; name?: string | null; email?: string | null; image?: string | null}).name = token.name;
        (session.user as {id?: string; name?: string | null; email?: string | null; image?: string | null}).email = token.email;
        (session.user as {id?: string; name?: string | null; email?: string | null; image?: string | null}).image = token.image as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
