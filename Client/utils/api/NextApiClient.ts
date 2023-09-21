import getConfig from 'next/config';

import { Client } from './generated/Api';

const { publicRuntimeConfig } = getConfig();

const NextApiClient = new Client({
  baseUrl: publicRuntimeConfig.CLIANNA_API_URL,
});

export default NextApiClient;
