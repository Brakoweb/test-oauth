import { getSession } from '../../../lib/session.js';
import { GoHighLevelOAuthService } from '../../../services/GHL/OAuth/index.js';

export default async function DashboardPage() {
  const session = await getSession();
  console.log('Dashboard - Session retrieved:', session);

  if (!session || !session.accessToken) {
    console.log('Dashboard - No session or no access token');
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>No autenticado</h1>
        <p>Por favor, inicia sesión primero.</p>
        <a href="/api/v2/authorize" style={{ color: 'blue', textDecoration: 'underline' }}>
          Iniciar sesión
        </a>
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
      <h1 style={{ marginBottom: '2rem' }}>Dashboard de Contactos</h1>
      
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
