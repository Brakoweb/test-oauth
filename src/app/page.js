export default function HomePage() {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
          GoHighLevel OAuth Integration
        </h1>
        <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
          Dashboard de contactos con SSO para usuarios
        </p>
      </div>

      <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Admin Card */}
        <div style={{ 
          border: '2px solid #3b82f6',
          borderRadius: '12px',
          padding: '2rem',
          backgroundColor: '#eff6ff'
        }}>
          <h2 style={{ color: '#1e40af', marginTop: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>👑</span>
            Para Administradores
          </h2>
          <p style={{ color: '#1e40af', marginBottom: '1.5rem' }}>
            Autoriza la aplicación una sola vez por location. Esto guarda los tokens de forma permanente
            para que los usuarios puedan acceder sin pasar por OAuth.
          </p>
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
              Autorizar Aplicación
            </a>
            <a 
              href="/admin/locations"
              style={{
                display: 'inline-block',
                padding: '0.75rem 1.5rem',
                backgroundColor: 'white',
                color: '#3b82f6',
                textDecoration: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                border: '2px solid #3b82f6'
              }}
            >
              Ver Locations Autorizadas
            </a>
          </div>
        </div>

        {/* User Card */}
        <div style={{ 
          border: '2px solid #f59e0b',
          borderRadius: '12px',
          padding: '2rem',
          backgroundColor: '#fffbeb'
        }}>
          <h2 style={{ color: '#92400e', marginTop: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>👤</span>
            Para Usuarios Normales
          </h2>
          <p style={{ color: '#92400e', marginBottom: '1.5rem' }}>
            Accede a través del <strong>Custom Menu Link</strong> configurado en GoHighLevel.
            El acceso es automático, sin pantallas de autorización.
          </p>
          <div style={{ 
            backgroundColor: 'white',
            padding: '1rem',
            borderRadius: '6px',
            border: '1px solid #fbbf24'
          }}>
            <p style={{ margin: 0, fontSize: '0.9em', color: '#92400e' }}>
              <strong>URL del Custom Menu Link:</strong><br/>
              <code style={{ fontSize: '0.85em', wordBreak: 'break-all' }}>
                /api/sso?locationId={'{{location.id}}'}&userId={'{{user.id}}'}
              </code>
            </p>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div style={{ 
        backgroundColor: '#f3f4f6',
        padding: '1.5rem',
        borderRadius: '8px',
        border: '1px solid #d1d5db'
      }}>
        <h3 style={{ marginTop: 0, fontSize: '1.1rem' }}>ℹ️ Cómo funciona</h3>
        <ol style={{ marginBottom: 0, paddingLeft: '1.5rem' }}>
          <li style={{ marginBottom: '0.5rem' }}>
            El <strong>Admin</strong> autoriza la aplicación una vez por location
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            Los tokens se guardan de forma permanente en la base de datos
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            Los <strong>usuarios normales</strong> acceden mediante el Custom Menu Link
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            La aplicación usa los tokens guardados para verificar al usuario
          </li>
          <li>
            El usuario ve su dashboard personalizado con sus contactos
          </li>
        </ol>
      </div>
    </div>
  );
}
