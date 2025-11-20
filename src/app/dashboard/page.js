import { getSession } from '../../../lib/session.js';
import { GoHighLevelOAuthService } from '../../../services/GHL/OAuth/index.js';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function DashboardPage({ searchParams }) {
  const params = await searchParams;
  const locationIdFromUrl = params?.locationId;
  const userIdFromUrl = params?.userId;
  const errorParam = params?.error;
  const errorMessage = params?.message;

  // SSO Flow: Redirect to SSO handler if locationId and userId are present
  if (locationIdFromUrl && userIdFromUrl) {
    redirect(`/api/sso?locationId=${locationIdFromUrl}&userId=${userIdFromUrl}`);
  }

  // Handle SSO errors
  if (errorParam) {
    let errorTitle = 'Error';
    let errorDescription = 'Ocurrió un error durante la autenticación.';
    
    switch (errorParam) {
      case 'missing_params':
        errorTitle = 'Parámetros faltantes';
        errorDescription = 'Se requieren locationId y userId en la URL.';
        break;
      case 'no_tokens':
        errorTitle = '⚠️ Location No Autorizada';
        errorDescription = `No hay tokens guardados para la location: ${locationIdFromUrl || 'N/A'}`;
        break;
      case 'user_not_found':
        errorTitle = 'Usuario no encontrado';
        errorDescription = `No se pudo obtener la información del usuario con ID: ${params?.userId || 'N/A'}`;
        break;
      case 'server_error':
        errorTitle = 'Error del servidor';
        errorDescription = errorMessage || 'Ocurrió un error inesperado.';
        break;
    }

    return (
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ 
          border: '2px solid #ef4444', 
          borderRadius: '8px', 
          padding: '2rem',
          backgroundColor: '#fef2f2'
        }}>
          <h1 style={{ color: '#b91c1c', marginTop: 0 }}>{errorTitle}</h1>
          
          <p style={{ marginBottom: '1.5rem' }}>
            {errorDescription}
          </p>

          {errorParam === 'no_tokens' && (
            <div style={{ 
              backgroundColor: '#fff7ed', 
              border: '1px solid #fb923c',
              borderRadius: '6px',
              padding: '1rem',
              marginBottom: '1.5rem'
            }}>
              <p style={{ margin: 0, fontSize: '0.95em' }}>
                <strong>💡 Solución:</strong> Un administrador de esta location debe autorizar 
                la aplicación primero. Cada location en GoHighLevel requiere su propia autorización.
              </p>
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a 
              href="/api/v2/authorize" 
              style={{ 
                display: 'inline-block',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '6px',
                fontWeight: 'bold'
              }}
            >
              Autorizar como Admin
            </a>
            
            <a 
              href="/admin/locations" 
              style={{ 
                display: 'inline-block',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#6b7280',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '6px',
                fontWeight: 'bold'
              }}
            >
              Ver Locations Autorizadas
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Check existing session
  const session = await getSession();
  
  // Debug: Check if cookie exists
  const cookieStore = await cookies();
  const rawCookie = cookieStore.get('ghl_session');
  console.log('[Dashboard] Raw cookie present:', !!rawCookie);
  console.log('[Dashboard] Session loaded:', { 
    isAdmin: session?.isAdmin, 
    userId: session?.userId,
    email: session?.userInfo?.email,
    hasAccessToken: !!session?.accessToken
  });

  if (!session || !session.accessToken) {
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
          
          <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
            <p style={{ marginBottom: '1rem' }}>
              <strong>👤 ¿Eres un usuario normal?</strong>
            </p>
            <p style={{ marginBottom: '1rem', paddingLeft: '1rem', fontSize: '0.95em' }}>
              Accede a través del <strong>Custom Menu Link</strong> en GoHighLevel. 
              No necesitas autorizar nada, el acceso es automático.
            </p>

            <div style={{ 
              borderTop: '1px solid #bfdbfe',
              marginTop: '1.5rem',
              marginBottom: '1.5rem'
            }}></div>

            <p style={{ marginBottom: '1rem' }}>
              <strong>👑 ¿Eres un administrador?</strong>
            </p>
            <p style={{ marginBottom: '1rem', paddingLeft: '1rem', fontSize: '0.95em' }}>
              Autoriza la aplicación una sola vez por location para que los usuarios puedan acceder.
            </p>
            
            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <a 
                href="/api/v2/authorize" 
                style={{ 
                  display: 'inline-block',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '6px',
                  fontWeight: 'bold'
                }}
              >
                Autorizar como Admin
              </a>
            </div>
          </div>

          <div style={{ 
            fontSize: '0.85em',
            color: '#6b7280',
            marginTop: '1.5rem',
            paddingTop: '1rem',
            borderTop: '1px solid #bfdbfe'
          }}>
            💡 <strong>Nota:</strong> Cerrar sesión no borra la autorización del admin. 
            Los tokens se mantienen seguros en la base de datos.
          </div>
        </div>
      </div>
    );
  }

  let contacts = [];
  let error = null;

  try {
    contacts = await GoHighLevelOAuthService.getContacts({
      accessToken: session.accessToken,
      locationId: session.locationId
    });
  } catch (err) {
    error = err.message;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0 }}>Dashboard de Contactos</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            backgroundColor: session.isAdmin ? '#dbeafe' : '#fef3c7',
            color: session.isAdmin ? '#1e40af' : '#92400e',
            fontWeight: 'bold',
            fontSize: '0.875rem'
          }}>
            {session.isAdmin ? '👑 ADMIN' : '👤 USUARIO'}
          </div>
          <a 
            href="/api/logout"
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              backgroundColor: '#ef4444',
              color: 'white',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: 'bold'
            }}
          >
            🚪 Cerrar Sesión
          </a>
        </div>
      </div>
      
      {/* User Information Section */}
      {session.userInfo && (
        <div style={{ 
          backgroundColor: '#f0f9ff', 
          padding: '1.5rem', 
          borderRadius: '8px', 
          marginBottom: '2rem',
          border: '1px solid #0ea5e9'
        }}>
          <h2 style={{ marginTop: 0, marginBottom: '1rem', color: '#0369a1' }}>
            Información del Usuario
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.5rem 1.5rem' }}>
            <strong>Nombre:</strong>
            <span>{session.userInfo.name || (session.userInfo.firstName && session.userInfo.lastName ? `${session.userInfo.firstName} ${session.userInfo.lastName}` : 'N/A')}</span>
            
            <strong>Email:</strong>
            <span>{session.userInfo.email || session.userEmail || 'N/A'}</span>
            
            <strong>User ID:</strong>
            <span style={{ fontFamily: 'monospace', fontSize: '0.9em' }}>{session.userId || session.userInfo.id || 'N/A'}</span>
            
            <strong>Location ID:</strong>
            <span style={{ fontFamily: 'monospace', fontSize: '0.9em' }}>{session.locationId || 'N/A'}</span>
            
            <strong>Rol:</strong>
            <span>{session.userInfo.role || 'N/A'}</span>
            
            {session.userInfo.permissions && (
              <>
                <strong>Permisos:</strong>
                <span style={{ fontSize: '0.85em', wordBreak: 'break-word' }}>
                  {JSON.stringify(session.userInfo.permissions, null, 2)}
                </span>
              </>
            )}
          </div>
        </div>
      )}
      
      {error && (
        <div style={{ backgroundColor: '#fee', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
          <p style={{ color: 'red' }}>Error: {error}</p>
        </div>
      )}

      {contacts.length === 0 && !error ? (
        <p>No se encontraron contactos.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Nombre</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Email</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Teléfono</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact, index) => (
                <tr key={contact.id || index} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>
                    {contact.firstName || ''} {contact.lastName || ''}
                  </td>
                  <td style={{ padding: '12px' }}>{contact.email || '-'}</td>
                  <td style={{ padding: '12px' }}>{contact.phone || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ marginTop: '1rem', color: '#666' }}>
            Total de contactos: {contacts.length}
          </p>
        </div>
      )}
    </div>
  );
}
