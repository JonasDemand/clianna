import { PrismaClient } from '@prisma/client';
import { GapiWrapper } from '@utils/gapi/GapiWrapper';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (!session) return res.status(401).send('Unauthorized');
  const user = await prisma.user.findUniqueOrThrow({
    where: { cuid: session.user.cuid },
    select: { refreshToken: true },
  });
  if (!user.refreshToken) return res.status(403).send('Unauthorized');
  const gapi = new GapiWrapper(user.refreshToken);
  const folder = await gapi.drive.files.create({
    requestBody: {
      name: `Clianna_${session.user.cuid}`,
      mimeType: 'application/vnd.google-apps.folder',
    },
  });

  res.status(200).send(folder);
};

export default handler;
