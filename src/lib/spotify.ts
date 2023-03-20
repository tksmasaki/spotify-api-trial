import { JWT } from 'next-auth/jwt'

// ref: https://developer.spotify.com/documentation/web-api/reference/#/operations/get-users-saved-tracks
export const getUserSavedTracks = async ({ accessToken }: JWT) => {
  const response = await fetch('https://api.spotify.com/v1/me/tracks', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  return await response.json()
}

// ref: https://developer.spotify.com/documentation/web-api/reference/#/operations/get-list-users-playlists
export const getUserPlaylists = async ({ accessToken }: JWT) => {
  const response = await fetch('https://api.spotify.com/v1/me/playlists', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  return await response.json()
}
