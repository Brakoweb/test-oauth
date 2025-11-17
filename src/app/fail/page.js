export default function FailPage() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
      <h1 style={{ color: 'red' }}>Error de Autenticación</h1>
      <p>No se pudo completar el inicio de sesión. Por favor, inténtalo de nuevo.</p>
    </div>
  );
}
