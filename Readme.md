# Infojobs provider for next-auth

## Installation

```bash
yarn add infojobs-next-auth-provider
# or
pnpm add infojobs-next-auth-provider
# or
pnpm install infojobs-next-auth-provider
```

## Usage

Basic usage:

```typescript
import InfojobsProvider from "infojobs-next-auth-provider";
import NextAuth from "next-auth";

export default NextAuth({
  providers: [
    InfojobsProvider({
      clientId: process.env.INFOJOBS_CLIENT_ID ?? "",
      clientSecret: process.env.INFOJOBS_SECRET ?? "",
      redirect_uri: "https://domain.com/api/callback",
      infojobs_scopes:
        "CANDIDATE_PROFILE_WITH_EMAIL,CV,CANDIDATE_READ_CURRICULUM_EXPERIENCE",
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      return session;
    },
  },
});
```

## API Reference

[Infojobs OAuth](https://developer.infojobs.net/documentation/user-oauth2/index.xhtml)
