import NextAuth, { DefaultSession } from 'next-auth'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    token?: JWT
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string
    accessTokenExpires: number
    refreshToken: string
  }
}
