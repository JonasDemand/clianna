import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export const withGapi =
  (needsRootfolder: boolean) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req });
    console.log(session);
    if (!session) {
      return res.status(401).send('This method needs authorization');
    }
    if (!session.user.google || !session.user.refreshToken)
      return res
        .status(401)
        .send('This method needs connection to your google account');
    if (!session.user.gapiAccess)
      return res
        .status(403)
        .send('This method needs access to the google drive and docs api');
    if (needsRootfolder && !session.user.cliannaFolderId)
      return res
        .status(400)
        .send('A clianna root folder needs to be defined in the user config');
  };
