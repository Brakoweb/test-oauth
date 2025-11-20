'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function DashboardClient() {
  const [session, setSession] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    async function loadDashboard() {
      try {
        // Try to get token from localStorage
        const token = localStorage.getItem('ghl_session_token');
        
        if (!token) {
          setError('No session found');
          setLoading(false);
          return;
        }

        // Decode JWT to get session data
        const payload = JSON.parse(atob(token.split('.')[1]));
        setSession(payload);

        // Fetch contacts
        const response = await fetch('/api/v2/contacts', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setContacts(data.contacts || []);
        }
      } catch (err) {
        console.error('[Dashboard Client] Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('ghl_session_token');
    router.push('/');
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Cargando...</h2>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ 
          border: '2px solid #3b82f6',
          borderRadius: '8px',
          padding: '2rem',
          backgroundColor: '#eff6ff',
          textAlign: 'center'
        }}>
          <h1 style={{ color: '#1e40af', marginTop: 0 }}>🔐 Sesión no iniciada</h1>
          <p>Por favor, accede a través del Custom Menu Link en GoHighLevel.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0 }}>Dashboard de Contactos</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            backgroundColor: session.isAgencyUser ? '#f3e8ff' : (session.isAdmin ? '#dbeafe' : '#fef3c7'),
            color: session.isAgencyUser ? '#6b21a8' : (session.isAdmin ? '#1e40af' : '#92400e'),
            fontWeight: 'bold',
            fontSize: '0.875rem'
          }}>
            {session.isAgencyUser ? '🏢 AGENCIA' : (session.isAdmin ? '👑 ADMIN' : '👤 USUARIO')}
          </div>
          <button 
            onClick={handleLogout}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              fontSize: '0.875rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            🚪 Cerrar Sesión
          </button>
        </div>
      </div>

      {session.userInfo && (
        <div style={{ 
          backgroundColor: session.isAgencyUser ? '#faf5ff' : '#f0f9ff', 
          padding: '1.5rem', 
          borderRadius: '8px', 
          marginBottom: '2rem',
          border: session.isAgencyUser ? '1px solid #e9d5ff' : '1px solid #bfdbfe'
        }}>
          <h2 style={{ marginTop: 0, color: session.isAgencyUser ? '#7c3aed' : '#1e40af' }}>
            Información del Usuario
          </h2>
          {session.isAgencyUser && (
            <div style={{ 
              backgroundColor: '#fef3c7', 
              padding: '0.75rem 1rem', 
              borderRadius: '6px', 
              marginBottom: '1rem',
              border: '1px solid #fcd34d',
              fontSize: '0.875rem'
            }}>
              <strong>ℹ️ Usuario de Agencia:</strong> Tienes acceso de nivel superior con permisos completos en todas las locations.
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {session.userInfo.name && session.userInfo.name !== 'Agency User' && (
              <div>
                <strong>Nombre:</strong> {session.userInfo.name}
              </div>
            )}
            {session.userInfo.email && session.userInfo.email !== 'agency@user' && (
              <div>
                <strong>Email:</strong> {session.userInfo.email}
              </div>
            )}
            {session.userInfo.roles && (
              <div>
                <strong>Rol:</strong> {session.userInfo.roles.role}
                {session.userInfo.roles.type && ` (${session.userInfo.roles.type})`}
              </div>
            )}
            {session.isAgencyUser && (
              <div>
                <strong>User ID:</strong> {session.userId}
              </div>
            )}
          </div>
        </div>
      )}

      <h2>Contactos ({contacts.length})</h2>
      {contacts.length === 0 ? (
        <p>No hay contactos disponibles.</p>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {contacts.slice(0, 20).map((contact) => (
            <div
              key={contact.id}
              style={{
                padding: '1rem',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                backgroundColor: 'white',
              }}
            >
              <h3 style={{ margin: '0 0 0.5rem 0' }}>
                {contact.firstName} {contact.lastName}
              </h3>
              {contact.email && <p style={{ margin: '0.25rem 0' }}>📧 {contact.email}</p>}
              {contact.phone && <p style={{ margin: '0.25rem 0' }}>📞 {contact.phone}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
