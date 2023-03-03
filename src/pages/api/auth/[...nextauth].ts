import NextAuth from 'next-auth'
import SpotifyProvider from 'next-auth/providers/spotify'

// ref: https://next-auth.js.org/v3/tutorials/refresh-token-rotation
/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(token: any) {
  try {
    const url =
      'https://accounts.spotify.com/api/token?' +
      new URLSearchParams({
        client_id: process.env.SPOTIFY_CLIENT_ID || '',
        client_secret: process.env.SPOTIFY_CLIENT_SECRET || '',
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken,
      })

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    })

    const refreshedTokens = await response.json()

    if (!response.ok) {
      throw refreshedTokens
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    }
  } catch (error) {
    console.log(error)

    return {
      ...token,
      error: 'RefreshAccessTokenError',
    }
  }
}

export const authOptions: any = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID || '',
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET || '',
      authorization: {
        url: 'https://accounts.spotify.com/authorize',
        // ref: https://developer.spotify.com/documentation/general/guides/authorization/code-flow/
        params: {
          scope: [
            'playlist-read-private',
            'playlist-read-collaborative',
            'playlist-modify-private',
            'playlist-modify-public',
            'user-library-modify',
            'user-library-read',
          ].join(','),
          show_dialog: true,
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }: { token: any; user: any; account: any }) {
      // Initial sign in
      if (account && user) {
        return {
          accessToken: account.access_token,
          accessTokenExpires: Date.now() + account.expires_in * 1000,
          refreshToken: account.refresh_token,
          user,
        }
      }

      // Return previous token if the access token has not expired yet
      // Access token has expired, try to update it
      return Date.now() < token.accessTokenExpires ? token : refreshAccessToken(token)
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user = token.user
        session.accessToken = token.accessToken
        session.error = token.error
      }

      return session
    },
  },
}

export default NextAuth(authOptions)
