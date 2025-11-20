# Configuración del Custom Menu Link en GoHighLevel

## Para configurar el acceso de usuarios normales (SSO)

### 1. Autorización del Admin (una sola vez por Location)
Primero, un administrador debe autorizar la aplicación:
- URL: `https://uncancerous-vernal-mattie.ngrok-free.dev/api/v2/authorize`
- Esto guardará los tokens permanentemente en la base de datos

### 2. Configurar Custom Menu Link en GoHighLevel

En la configuración de tu aplicación en GoHighLevel, crea un **Custom Menu Link** con la siguiente URL:

```
https://uncancerous-vernal-mattie.ngrok-free.dev/api/sso?locationId={{location.id}}&userId={{user.id}}
```

**Nota:** La URL apunta a `/api/sso` que es el endpoint que maneja la autenticación SSO.

**Importante:** GoHighLevel reemplazará automáticamente:
- `{{location.id}}` → ID de la sub-cuenta (Location)
- `{{user.id}}` → ID del usuario que hace clic

### 3. Funcionamiento

Cuando un usuario normal hace clic en el enlace del menú:

1. GHL envía al usuario a tu app con los parámetros reemplazados:
   ```
   https://tu-app.com/dashboard?locationId=5dUjc0jCdYPxyESimkhn&userId=abc123xyz
   ```

2. Tu aplicación:
   - Busca los tokens guardados para ese `locationId`
   - Usa el `userId` para obtener la información del usuario desde la API de GHL
   - Llama a `GET /users/:userId` para obtener nombre, email, rol, permisos, etc.
   - Crea una sesión segura
   - Muestra el dashboard con la información del usuario y los contactos

### 4. Probar el flujo SSO localmente

Para probar sin configurar el Custom Menu Link, puedes simular la URL directamente:

```
https://uncancerous-vernal-mattie.ngrok-free.dev/dashboard?locationId=5dUjc0jCdYPxyESimkhn&userId=USER_ID_AQUI
```

Reemplaza:
- `locationId` con el ID de tu Location (lo ves en los logs cuando autorizas como admin)
- `userId` con el ID de un usuario válido en esa Location

### 5. Diferencia entre Admin y Usuario Normal

**Admin (OAuth flow):**
- Inicia en `/api/v2/authorize`
- Completa pantalla de consentimiento de GHL
- Tokens se guardan en base de datos
- Badge: 👑 ADMIN

**Usuario Normal (SSO flow):**
- Hace clic en Custom Menu Link
- No ve pantalla de consentimiento
- Usa tokens del admin guardados
- Badge: 👤 USUARIO
- Ve su información personal (nombre, email, rol, permisos)

### Notas de seguridad

- Los tokens están protegidos en el servidor (carpeta `data/tokens.json`)
- Las sesiones usan JWT firmados con `SESSION_SECRET`
- Las cookies son `HttpOnly` y `SameSite=Lax`
- Cada usuario solo ve su propia información (verificada con la API de GHL)
