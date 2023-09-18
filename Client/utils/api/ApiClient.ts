import { Client } from './generated/GENERATED_Client';

const ApiClient = new Client(
  'https://localhost:7022',
  typeof window === 'undefined' ? { fetch } : undefined
);

export default ApiClient;
