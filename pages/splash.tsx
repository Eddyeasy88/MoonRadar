import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/login');
    }, 2000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div style={{
      backgroundColor: '#000',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <img src="/splash.png" alt="MoonRadar" style={{ maxWidth: '80%', height: 'auto' }} />
    </div>
  );
}
