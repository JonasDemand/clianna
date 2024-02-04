import { Session } from 'next-auth';

export const reloadSession = async (
  refreshSession: boolean
): Promise<Session> => {
  const res = await fetch(`/api/auth/session?refreshSession=${refreshSession}`);

  const event = new Event('visibilitychange');
  document.dispatchEvent(event);

  return await res.json();
};
