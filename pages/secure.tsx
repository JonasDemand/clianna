import { useSession, signIn, signOut } from 'next-auth/react';

const Secure = () => {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        Signed in as {session.user.admin ? 'admin' : 'normal'} user
        <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
};

export default Secure;
