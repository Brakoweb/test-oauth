import fs from 'fs';
import path from 'path';

export default async function LocationsPage() {
  const DB_PATH = path.join(process.cwd(), 'data', 'tokens.json');
  
  let locations = {};
  let error = null;
  
  try {
    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, 'utf-8');
      locations = JSON.parse(data);
    }
  } catch (err) {
    error = err.message;
  }

  const locationIds = Object.keys(locations);

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>Locations Autorizadas</h1>
      
      {error && (
        <div style={{ backgroundColor: '#fee', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
          <p style={{ color: 'red' }}>Error: {error}</p>
        </div>
      )}

      <div style={{ 
        marginBottom: '2rem', 
        padding: '1rem', 
        backgroundColor: '#dbeafe', 
        borderRadius: '8px',
        border: '1px solid #3b82f6'
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>ℹ️ Scopes necesarios para SSO</h3>
        <p style={{ margin: 0, fontSize: '0.9em' }}>
          Para que el flujo SSO funcione, necesitas el scope: <code style={{ 
            backgroundColor: 'white', 
            padding: '0.25rem 0.5rem', 
            borderRadius: '3px'
          }}>users.readonly</code>
          <br />
          Actualiza tu <code>.env.local</code> con: <code style={{ 
            backgroundColor: 'white', 
            padding: '0.25rem 0.5rem', 
            borderRadius: '3px'
          }}>GHL_OAUTH_SCOPES=contacts.readonly users.readonly locations.readonly</code>
          <br />
          <strong>Luego re-autoriza en <a href="/api/v2/authorize" style={{ color: '#1e40af' }}>/api/v2/authorize</a></strong>
        </p>
      </div>

      {locationIds.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
          <h2>No hay locations autorizadas</h2>
          <p>Ningún administrador ha autorizado la aplicación aún.</p>
          <a 
            href="/api/v2/authorize" 
            style={{ 
              display: 'inline-block',
              marginTop: '1rem',
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
      ) : (
        <div>
          <p style={{ marginBottom: '1.5rem', color: '#6b7280' }}>
            Total de locations autorizadas: <strong>{locationIds.length}</strong>
          </p>
          
          <div style={{ display: 'grid', gap: '1rem' }}>
            {locationIds.map((locationId) => {
              const location = locations[locationId];
              return (
                <div 
                  key={locationId}
                  style={{ 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '1.5rem',
                    backgroundColor: 'white'
                  }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.5rem 1.5rem' }}>
                    <strong>Location ID:</strong>
                    <code style={{ 
                      backgroundColor: '#f3f4f6', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '4px',
                      fontSize: '0.9em'
                    }}>
                      {locationId}
                    </code>

                    <strong>Company ID:</strong>
                    <code style={{ 
                      backgroundColor: '#f3f4f6', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '4px',
                      fontSize: '0.9em'
                    }}>
                      {location.companyId || 'N/A'}
                    </code>

                    <strong>Autorizado:</strong>
                    <span>{new Date(location.savedAt).toLocaleString('es-ES')}</span>

                    <strong>Scopes:</strong>
                    <div>
                      <div style={{ fontSize: '0.85em', color: '#6b7280', marginBottom: '0.5rem' }}>
                        {location.scope || 'N/A'}
                      </div>
                      {location.scope && !location.scope.includes('users.readonly') && (
                        <div style={{ 
                          fontSize: '0.85em', 
                          color: '#dc2626', 
                          backgroundColor: '#fee2e2',
                          padding: '0.5rem',
                          borderRadius: '4px',
                          marginTop: '0.5rem'
                        }}>
                          ⚠️ <strong>Falta scope:</strong> users.readonly (necesario para SSO)
                        </div>
                      )}
                      {location.scope && location.scope.includes('users.readonly') && (
                        <div style={{ 
                          fontSize: '0.85em', 
                          color: '#16a34a', 
                          backgroundColor: '#dcfce7',
                          padding: '0.5rem',
                          borderRadius: '4px',
                          marginTop: '0.5rem'
                        }}>
                          ✅ Scopes correctos para SSO
                        </div>
                      )}
                    </div>

                    <strong>Expira en:</strong>
                    <span>{location.expiresIn ? `${location.expiresIn}s` : 'N/A'}</span>
                  </div>

                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                    <p style={{ fontSize: '0.85em', color: '#6b7280', marginBottom: '0.5rem' }}>
                      Para probar SSO, usa: <code style={{ backgroundColor: '#f3f4f6', padding: '0.25rem 0.5rem', borderRadius: '3px' }}>/dashboard?locationId={locationId}&userId=USER_ID</code>
                    </p>
                    <p style={{ fontSize: '0.85em', color: '#6b7280', margin: 0 }}>
                      Reemplaza <code>USER_ID</code> con un ID de usuario válido de esta location.
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ 
            marginTop: '2rem', 
            padding: '1rem', 
            backgroundColor: '#fef3c7', 
            borderRadius: '8px',
            border: '1px solid #fbbf24'
          }}>
            <h3 style={{ marginTop: 0 }}>ℹ️ Nota importante</h3>
            <p style={{ margin: 0 }}>
              Cada location (sub-cuenta) en GoHighLevel necesita su propia autorización. 
              Si un usuario intenta acceder desde una location no listada aquí, verá un error 
              de autorización.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
