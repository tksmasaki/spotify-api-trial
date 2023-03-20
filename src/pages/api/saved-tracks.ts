import { getUserSavedTracks } from '../../lib/spotify'
import { getSession } from 'next-auth/react'
import type { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  if (!session?.token) return res.status(401)

  const response = await getUserSavedTracks(session.token)
  return res.status(200).json(response)
}

export default handler
