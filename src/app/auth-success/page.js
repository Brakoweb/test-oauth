'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function AuthSuccessPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      // Store token in localStorage
      localStorage.setItem('ghl_session_token', token);
      console.log('[Auth Success] Token stored in localStorage');
    }
    
    // Redirect to dashboard-client
    const timer = setTimeout(() => {
      window.location.href = '/dashboard-client';
    }, 500);

    return () => clearTimeout(timer);
  }, [token]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
        <h2>Autenticación exitosa</h2>
        <p style={{ color: '#666' }}>Redirigiendo al dashboard...</p>
      </div>
    </div>
  );
}
