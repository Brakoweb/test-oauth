# 🔄 Token Refresh Automático - Guía Completa

## 🎯 Problema Resuelto

Los access tokens de GHL expiran después de **24 horas** (86400 segundos). Antes, cuando expiraban, los usuarios no podían acceder a la app hasta que un admin re-autorizara.

Ahora, los tokens **se refrescan automáticamente** sin intervención del usuario.

---

## 🔐 Cómo Funciona

### Flujo Automático

```
1. Usuario hace request (SSO o API)
   ↓
2. App verifica si el token está expirado o cerca de expirar
   ↓
3a. ✅ Token válido → Usar directamente
   ↓
3b. ⏰ Token expirado → Refresh automático
   ↓
4. GHL retorna nuevo access token + refresh token
   ↓
5. App guarda nuevos tokens en base de datos
   ↓
6. App usa nuevo token para el request
   ↓
7. ✅ Usuario no nota nada, todo funciona transparentemente
```

### Componentes Implementados

#### 1. **Token Manager** (`/lib/tokenManager.js`)

Función principal: `getValidTokens(locationId)`

```javascript
// Uso en cualquier ruta
import { getValidTokens } from './lib/tokenManager.js';

const tokens = await getValidTokens(locationId);
// Siempre retorna tokens válidos o null si falla el refresh
```

**Qué hace:**
- Verifica si el token está expirado o por expirar (< 5 minutos)
- Si está expirado, automáticamente llama al refresh
- Guarda los nuevos tokens
- Retorna tokens válidos listos para usar

#### 2. **Token Expiration Check** (`/lib/database.js`)

Función: `isTokenExpired(locationId)`

```javascript
// Verifica si tokens expiran en menos de 5 minutos
const expired = isTokenExpired(locationId);
```

**Lógica:**
- Calcula cuándo expira el token: `savedAt + expiresIn`
- Compara con tiempo actual
- Agrega un buffer de 5 minutos (para refrescar antes de que expire realmente)

#### 3. **Refresh Service** (`/services/GHL/OAuth/index.js`)

Método: `refreshToken({ refreshToken })`

```javascript
// Llama al API de GHL para obtener nuevo token
const newTokens = await GoHighLevelOAuthService.refreshToken({
    refreshToken: oldRefreshToken
});
```

**Request a GHL:**
```
POST https://services.leadconnectorhq.com/oauth/token
{
    grant_type: 'refresh_token',
    refresh_token: '<refresh_token>',
    client_id: '<client_id>',
    client_secret: '<client_secret>',
    user_type: 'Location'
}
```

**Response:**
```json
{
    "access_token": "nuevo_token_aqui",
    "refresh_token": "nuevo_refresh_token_aqui",
    "expires_in": 86400,
    "scope": "contacts.readonly users.readonly"
}
```

---

## 📊 Integración en Rutas

### SSO Route (`/src/app/api/sso/route.js`)

```javascript
// Antes
const tokens = getTokens(locationId);

// Ahora
const tokens = await getValidTokens(locationId);
// ✅ Automáticamente refresca si es necesario
```

### Contacts API (`/src/app/api/v2/contacts/route.js`)

```javascript
// Obtener tokens frescos antes de cada request
const tokens = await getValidTokens(session.locationId);

const contacts = await GoHighLevelOAuthService.getContacts({
    accessToken: tokens.accessToken,
    locationId: session.locationId
});
```

---

## 🔍 Logs de Monitoreo

### Token Válido (No Refresh)

```
[DB] Tokens retrieved for location: 5dUjc0jCdYPxyESimkhn
[TokenManager] ✅ Using existing valid tokens
```

### Token Expirado (Refresh Automático)

```
[DB] Tokens retrieved for location: 5dUjc0jCdYPxyESimkhn
[DB] Token expired or expiring soon for location: 5dUjc0jCdYPxyESimkhn (120s remaining)
[TokenManager] 🔄 Token expired, attempting refresh...
--GHL refreshing access token...
--GHL token refresh success
[DB] Tokens saved for location: 5dUjc0jCdYPxyESimkhn
[TokenManager] ✅ Token refreshed successfully
```

### Refresh Fallido

```
[TokenManager] 🔄 Token expired, attempting refresh...
--GHL refreshing access token...
--GHL token refresh failed, reason: Invalid refresh token
[TokenManager] ❌ Token refresh failed
```

Si el refresh falla, el usuario verá un error indicando que debe re-autorizar.

---

## ⏱️ Tiempos y Configuración

### Configuración Actual

| Parámetro | Valor | Descripción |
|-----------|-------|-------------|
| Token Duration | 86400s (24h) | Duración del access token |
| Refresh Buffer | 300s (5min) | Tiempo antes de expiración para refrescar |
| Refresh Trigger | < 5 min remaining | Cuándo se activa el refresh |

### Por Qué 5 Minutos de Buffer

- ✅ Evita que el token expire durante un request
- ✅ Da margen para completar operaciones
- ✅ Reduce la probabilidad de errores de expiración

**Puedes ajustar el buffer en `/lib/database.js`:**
```javascript
// Cambiar de 5 minutos a 10 minutos
const bufferTime = 10 * 60 * 1000; // 10 minutes in ms
```

---

## 🧪 Testing

### Test Manual: Forzar Refresh

Para probar el refresh automático sin esperar 24 horas:

**1. Edita `/lib/database.js` temporalmente:**

```javascript
// En isTokenExpired(), cambia el buffer a algo muy grande
const bufferTime = 86400 * 1000; // 24 horas
// Esto hará que considere todos los tokens como "por expirar"
```

**2. Reinicia el servidor:**
```bash
npm run dev
```

**3. Haz un request:**
```bash
# Visita cualquier ruta SSO
https://your-app.com/api/sso?locationId=...&userId=...
```

**4. Verifica los logs:**
Deberías ver:
```
[TokenManager] 🔄 Token expired, attempting refresh...
--GHL token refresh success
[TokenManager] ✅ Token refreshed successfully
```

**5. Revierte el cambio en `database.js`:**
```javascript
const bufferTime = 5 * 60 * 1000; // Volver a 5 minutos
```

---

## 📋 Checklist de Funcionalidad

### ✅ Token Refresh Automático Implementado

- [x] `getValidTokens()` verifica expiración antes de retornar
- [x] `isTokenExpired()` detecta tokens por expirar
- [x] `refreshToken()` llama al API de GHL para refresh
- [x] Nuevos tokens se guardan automáticamente
- [x] SSO route usa refresh automático
- [x] Contacts API usa refresh automático
- [x] Logs informativos de cada paso
- [x] Manejo de errores si refresh falla

### ✅ Beneficios para el Usuario

- [x] **No requiere re-autorización** después de 24 horas
- [x] **Acceso continuo** sin interrupciones
- [x] **Transparente** - el usuario no nota nada
- [x] **Seguro** - tokens siempre actualizados

---

## 🚨 Manejo de Errores

### Escenario 1: Refresh Token Inválido

**Causa:** El refresh token ha sido revocado o es inválido.

**Comportamiento:**
```
--GHL token refresh failed, reason: Invalid refresh token
[TokenManager] ❌ Token refresh failed
→ Usuario ve error: "no_tokens"
→ Admin debe re-autorizar desde /api/v2/authorize
```

### Escenario 2: Network Error

**Causa:** No hay conexión a GHL API.

**Comportamiento:**
```
--GHL token refresh failed, reason: Network error
[TokenManager] ❌ Token refresh failed
→ Usuario ve error temporal
→ Retry automático en siguiente request
```

### Escenario 3: GHL API Down

**Causa:** API de GHL no disponible.

**Comportamiento:**
- Tokens antiguos siguen funcionando si no han expirado realmente
- Si han expirado, falla el request
- Se recupera automáticamente cuando GHL vuelve

---

## 🔐 Seguridad

### Refresh Tokens

**Almacenamiento:**
- ✅ Guardados en `data/tokens.json` en el servidor
- ✅ Nunca expuestos al cliente
- ✅ No incluidos en JWT de sesión

**Rotación:**
- GHL puede retornar un nuevo refresh token en cada refresh
- El código maneja esto automáticamente:
  ```javascript
  refresh_token: newTokens.refresh_token || tokens.refreshToken
  ```

**Revocación:**
- Si un admin revoca el acceso desde GHL, el refresh token se invalida
- La app detecta esto y requiere re-autorización

---

## 📊 Estadísticas de Tokens

### Ver Estado de Tokens para una Location

**En Admin Dashboard:**
```
Location ID: 5dUjc0jCdYPxyESimkhn
Autorizado: 20/11/2025, 1:08:55
Expira en: 86399s (23h 59m 59s)
```

**El tiempo se actualiza cada vez que se hace refresh:**
- Después del refresh: `Expira en: 86400s` (24h completas)
- Se resetea el contador

---

## 🎯 Mejoras Futuras (Opcionales)

### 1. Background Refresh Job

Ejecutar un cron job que refresque tokens antes de que expiren:

```javascript
// Cada 12 horas, revisar y refrescar todos los tokens
setInterval(() => {
    refreshAllExpiringTokens();
}, 12 * 60 * 60 * 1000);
```

**Ventaja:** Tokens siempre frescos, incluso sin requests.

### 2. Notificaciones de Refresh Fallido

Enviar email al admin si el refresh falla repetidamente.

### 3. Múltiples Refresh Tokens

Soportar múltiples refresh tokens por location para diferentes contextos.

---

## 📚 Referencias

- [GHL OAuth Documentation](https://highlevel.stoplight.io/docs/integrations/01f2e7c0b13a0-overview)
- [OAuth 2.0 Refresh Token Flow](https://oauth.net/2/grant-types/refresh-token/)

---

**Última actualización:** 20 de Noviembre, 2025
**Versión:** 1.0
**Status:** ✅ Completamente Implementado
