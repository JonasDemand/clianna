export const revalidate = async (routes: string[]): Promise<void> => {
  const res = await fetch('/api/revalidate', {
    method: 'POST',
    body: JSON.stringify({ routes }),
    headers: { 'content-type': 'application/json' },
  });
  if (!res.ok) {
    throw 'Failed to revalidate';
  }
};
