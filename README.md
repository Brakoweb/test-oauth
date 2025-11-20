# GoHighLevel OAuth Integration con SSO

Aplicación Next.js que implementa OAuth 2.0 de GoHighLevel con flujo SSO (Single Sign-On) para usuarios.

## 🎯 Características

- **OAuth 2.0 para Admins**: Autorización una sola vez por location
- **SSO para Usuarios**: Acceso automático sin pantalla de consentimiento
- **Persistencia de Tokens**: Base de datos JSON para guardar tokens por location
- **Dashboard de Contactos**: Visualización de contactos de GoHighLevel
- **Gestión de Sesiones**: JWT con cookies seguras
- **Multi-Location**: Soporte para múltiples sub-cuentas de GHL

## 🚀 Inicio Rápido

### 1. Instalación

```bash
npm install
```

### 2. Configuración

Crea un archivo `.env.local`:

```env
# GoHighLevel OAuth
GHL_CLIENT_ID=tu_client_id
GHL_CLIENT_SECRET=tu_client_secret
GHL_OAUTH_SCOPES=contacts.readonly users.readonly locations.readonly
GHL_OAUTH_SUCCESS=http://localhost:3000/dashboard
GHL_OAUTH_FAIL=http://localhost:3000/error

# Session
SESSION_SECRET=tu_secret_muy_seguro_aqui

# Host (para desarrollo con ngrok)
HOST=http://localhost:3000
```

**Importante:** Para desarrollo con ngrok, cambia `HOST` a tu URL de ngrok:
```env
HOST=https://tu-url.ngrok-free.dev
```

### 3. Ejecutar

```bash
npm run dev
```

## 📋 Flujos de Usuario

### Flujo Admin (Una sola vez por Location)

1. Admin accede a `/api/v2/authorize`
2. GoHighLevel muestra pantalla de consentimiento
3. Admin autoriza la aplicación
4. Tokens se guardan en `data/tokens.json` asociados al `locationId`
5. Admin es redirigido al dashboard

### Flujo Usuario Normal (SSO)

1. Usuario hace clic en Custom Menu Link en GoHighLevel
2. GHL redirige a: `/api/sso?locationId=XXX&userId=YYY`
3. Aplicación:
   - Busca tokens guardados para ese `locationId`
   - Obtiene información del usuario desde GHL API
   - Crea sesión para el usuario
   - Muestra dashboard personalizado
4. Usuario ve su información y contactos

## 🔧 Configuración en GoHighLevel

### Custom Menu Link

En la configuración de tu aplicación en GHL, crea un Custom Menu Link:

```
https://tu-url.ngrok-free.dev/api/sso?locationId={{location.id}}&userId={{user.id}}
```

GoHighLevel reemplazará automáticamente:
- `{{location.id}}` → ID de la location
- `{{user.id}}` → ID del usuario

## 📁 Estructura del Proyecto

```
├── src/app/
│   ├── api/
│   │   ├── v2/[action]/route.js    # OAuth (authorize, redirect)
│   │   ├── sso/route.js             # SSO para usuarios
│   │   └── logout/route.js          # Cerrar sesión
│   ├── dashboard/page.js            # Dashboard principal
│   ├── admin/locations/page.js      # Ver locations autorizadas
│   └── page.js                      # Página de inicio
├── lib/
│   ├── session.js                   # Gestión de sesiones JWT
│   └── database.js                  # Persistencia de tokens
├── services/
│   └── GHL/OAuth/index.js           # Cliente API de GoHighLevel
└── constants/
    └── server/index.js              # Configuración GHL
```

## 🔐 Seguridad

- **Tokens protegidos**: Guardados en servidor, nunca expuestos al cliente
- **Cookies HttpOnly**: Sesiones seguras con JWT
- **SameSite**: Protección contra CSRF
- **Scopes mínimos**: Solo permisos necesarios
- **Sesiones separadas**: Admin y usuarios tienen sesiones independientes

## 🛠️ Endpoints API

### OAuth Admin
- `GET /api/v2/authorize` - Inicia flujo OAuth
- `GET /api/v2/redirect` - Callback OAuth (manejado por GHL)

### SSO Usuarios
- `GET /api/sso?locationId=XXX&userId=YYY` - Autenticación SSO

### Gestión
- `GET /api/logout` - Cerrar sesión
- `GET /admin/locations` - Ver locations autorizadas

### Páginas
- `GET /` - Página de inicio
- `GET /dashboard` - Dashboard (requiere sesión)

## 📝 Notas Importantes

### Diferencia entre Sesión y Tokens

- **Sesión (Cookie)**: Temporal, se borra al hacer logout
- **Tokens (Base de datos)**: Permanentes, se mantienen después del logout

Cuando un usuario cierra sesión:
- ✅ Se borra la cookie de sesión
- ✅ Los tokens del admin permanecen en la base de datos
- ✅ Los usuarios pueden volver a entrar mediante el Custom Menu Link

### Re-autorización

Solo es necesario re-autorizar como admin si:
- Cambias los scopes en `.env.local`
- Revocas el acceso en GoHighLevel
- Cambias de location

### Scopes Requeridos

Mínimos para SSO:
```
contacts.readonly users.readonly locations.readonly
```

## 🐛 Troubleshooting

### "Location No Autorizada"
**Causa**: No hay tokens para esa location  
**Solución**: Admin debe autorizar en `/api/v2/authorize`

### "The token is not authorized for this scope"
**Causa**: Faltan scopes en `.env.local`  
**Solución**: Agrega los scopes necesarios y re-autoriza

### "ERR_SSL_PROTOCOL_ERROR" con localhost
**Causa**: Variable `HOST` no configurada con ngrok  
**Solución**: Actualiza `HOST` en `.env.local` con tu URL de ngrok

### Dashboard muestra "ADMIN" cuando es usuario
**Causa**: Sesión anterior de admin todavía activa  
**Solución**: Haz logout antes de probar SSO

## 📚 Recursos

- [GoHighLevel API Docs](https://highlevel.stoplight.io/)
- [Next.js App Router](https://nextjs.org/docs/app)
- [OAuth 2.0 Spec](https://oauth.net/2/)

## 🤝 Desarrollo

### Agregar nuevos endpoints GHL

1. Agrega el método en `services/GHL/OAuth/index.js`
2. Asegúrate de tener los scopes necesarios
3. Úsalo en tus páginas/API routes

### Agregar nuevas páginas

1. Crea el archivo en `src/app/`
2. Usa `getSession()` para verificar autenticación
3. Accede a `session.userInfo` para datos del usuario

## 📄 Licencia

MIT
