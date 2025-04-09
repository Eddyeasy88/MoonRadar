export default function Home() { return (<div><h1>MoonRadar läuft!</h1><p>Coins incoming...</p></div>); }
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/splash');
  }, [router]);

  return null;
}

