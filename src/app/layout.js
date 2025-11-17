export const metadata = {
  title: 'Test OAuth App',
  description: 'Aplicación para probar el flujo de OAuth',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
