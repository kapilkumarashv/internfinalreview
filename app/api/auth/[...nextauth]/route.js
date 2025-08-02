
import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';

const handler = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      if (session?.user?.email) {
        const email = session.user.email;
        session.user.username = email;
        session.user.password = email.split('@')[0]; 
        session.user.role = 'admin'; 
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
