'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function AuthSuccessPage() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  useEffect(() => {
    // Redirigir después de un pequeño delay para asegurar que la cookie se estableció
    const timer = setTimeout(() => {
      window.location.href = redirect;
    }, 100);

    return () => clearTimeout(timer);
  }, [redirect]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ textAlign: 'center' }}>
        <h2>Autenticación exitosa</h2>
        <p>Redirigiendo...</p>
      </div>
    </div>
  );
}
