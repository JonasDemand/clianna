export const refreshSession = async () => {
  await fetch('/api/auth/session?refreshSession=true');

  const event = new Event('visibilitychange');
  document.dispatchEvent(event);
};
