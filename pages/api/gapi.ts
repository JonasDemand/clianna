import { PrismaClient } from '@prisma/client';
import { google } from 'googleapis';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

const prisma = new PrismaClient();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:3000/api/auth/callback/google'
);
const docs = google.docs({
  version: 'v1',
  auth: oauth2Client,
});
const drive = google.drive({
  version: 'v3',
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (!session) return res.status(401).send('Unauthorized');
  const user = await prisma.user.findUniqueOrThrow({
    where: { cuid: session.user.cuid },
    select: { googleToken: true },
  });
  oauth2Client.setCredentials({ refresh_token: user.googleToken });
  /*const document = await docs.documents.get({
    documentId: '1dmrhy6mqgqD8KrmbV3skmOTLwgodYj0j7WX1W79T0h4',
  });*/
  const document = await docs.documents.create();

  res.status(200).send(document);
};

export default handler;
