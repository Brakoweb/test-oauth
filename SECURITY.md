# 🔒 Seguridad de la Aplicación

## Medidas de Seguridad Implementadas

### 1. Validación Estricta de Usuarios + Whitelist de Agencia

**Problema Original:**
```javascript
// ❌ INSEGURO: Cualquier userId inventado obtenía acceso de admin
if (!userInfo) {
    isAdmin = true; // Da acceso a cualquiera
}
```

**Solución Actual:**
```javascript
// ✅ SEGURO: Valida contra whitelist de usuarios de agencia
if (!userInfo) {
    const agencyUserIds = process.env.GHL_AGENCY_USER_IDS.split(',');
    
    if (!agencyUserIds.includes(userId)) {
        // ❌ NO está en whitelist - rechazar
        return NextResponse.redirect(`${baseUrl}/dashboard?error=unauthorized_user`);
    }
    
    // ✅ Está en whitelist - verificar token también
    const locationTest = await fetch(`/locations/${locationId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    
    if (!locationTest.ok) {
        return NextResponse.redirect(`${baseUrl}/dashboard?error=unauthorized_user`);
    }
    
    // ✅ Whitelist + Token válido = Usuario de agencia legítimo
}
```

**Resultado:**
- ✅ Solo usuarios verificados en GHL pueden acceder
- ✅ Usuarios de agencia deben estar en whitelist (`GHL_AGENCY_USER_IDS`)
- ✅ UserIds inventados son rechazados incluso si el token es válido
- ✅ Doble validación: Whitelist + Access Token
- ✅ Intentos de acceso no autorizado son registrados

---

### 2. Verificación de Tokens por Location

**Protección:**
```javascript
const tokens = getTokens(locationId);
if (!tokens) {
    return NextResponse.redirect(`${baseUrl}/dashboard?error=no_tokens`);
}
```

**Resultado:**
- ✅ Solo locations autorizadas (con OAuth completado) pueden usar la app
- ✅ Intentos con locationIds no autorizados son rechazados

---

### 3. Validación de Acceso a Recursos

**Para Contactos:**
```javascript
const userInfo = await getUserInfo({ accessToken, userId });
if (!userInfo) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

**Resultado:**
- ✅ Cada request valida que el usuario existe
- ✅ Access tokens son verificados por GHL
- ✅ No se puede acceder a datos de otras locations

---

## Vectores de Ataque Mitigados

### ❌ Ataque 1: userId Inventado (Usuario Normal)

**Intento:**
```
https://app.com/api/sso?locationId=VALID&userId=FAKE_USER_123
```

**Defensa:**
1. Se intenta obtener info del usuario con `getUserInfo()`
2. GHL retorna 400/404 porque el usuario no existe
3. Se verifica si está en whitelist de agencia
4. NO está en whitelist → Acceso rechazado inmediatamente
5. Se registra el intento en logs

**Resultado:** ❌ Acceso denegado

---

### ❌ Ataque 1.5: userId Inventado Intentando Simular Agencia

**Intento:**
```
https://app.com/api/sso?locationId=VALID&userId=FAKE_AGENCY_USER_999
```

**Defensa:**
1. `getUserInfo()` falla (usuario no existe)
2. Se verifica si `FAKE_AGENCY_USER_999` está en `GHL_AGENCY_USER_IDS`
3. NO está en whitelist → **Rechazado inmediatamente**
4. Ni siquiera se valida el token
5. Se registra el intento en logs

**Resultado:** ❌ Acceso denegado

**Nota:** Incluso si el `locationId` y token son válidos, sin estar en la whitelist NO puede acceder.

---

### ❌ Ataque 2: locationId No Autorizado

**Intento:**
```
https://app.com/api/sso?locationId=ANOTHER_LOCATION&userId=VALID
```

**Defensa:**
1. App busca tokens guardados para ese `locationId`
2. No encuentra tokens (no se hizo OAuth)
3. Rechaza el acceso

**Resultado:** ❌ Acceso denegado

---

### ❌ Ataque 3: Manipulación de Session Token

**Intento:**
Modificar el JWT en localStorage

**Defensa:**
1. JWT está firmado con `SESSION_SECRET`
2. Cualquier modificación invalida la firma
3. Al verificar el token, falla la validación

**Resultado:** ❌ Token rechazado

---

### ❌ Ataque 4: Acceso a Datos de Otra Location

**Intento:**
Usuario de Location A intenta acceder a contactos de Location B

**Defensa:**
1. Session contiene `locationId` y `accessToken` específicos
2. Access token solo tiene permisos para su location
3. GHL API rechaza el request

**Resultado:** ❌ Acceso denegado por GHL

---

## Mejores Prácticas Implementadas

### ✅ Principio de Menor Privilegio
- Cada usuario solo tiene acceso a SU location
- Los access tokens son específicos por location
- Los roles (admin/user) se verifican desde GHL

### ✅ Validación en Múltiples Capas
1. **Capa 1:** Validación de parámetros (locationId, userId)
2. **Capa 2:** Verificación de tokens OAuth guardados
3. **Capa 3:** Validación de usuario en GHL
4. **Capa 4:** Verificación de permisos en cada API call

### ✅ Logging de Seguridad
```javascript
console.error('[SSO] ❌ SECURITY: User not found for userId:', userId);
console.error('[SSO] ❌ SECURITY: Rejecting unauthorized access attempt');
```

Todos los intentos de acceso no autorizado son registrados con:
- Timestamp
- userId intentado
- locationId intentado
- Razón del rechazo

### ✅ Manejo Seguro de Secretos
- `SESSION_SECRET` en variables de entorno
- `GHL_CLIENT_SECRET` nunca expuesto al frontend
- Tokens OAuth guardados en servidor (no en cookies client-side)

---

## Limitaciones Conocidas

### ⚠️ Custom Menu Links vs Custom Pages

**Custom Menu Links (implementación actual):**
- Los parámetros viajan en la URL: `?locationId=...&userId=...`
- Son visibles y pueden ser copiados
- **Mitigación:** Validación estricta en el backend

**Custom Pages con iframe (más seguro):**
- Datos encriptados con Shared Secret
- No visible en URL
- Comunicación cross-frame
- **Nota:** Requiere cambio de arquitectura

### ⚠️ Tokens de Larga Duración

Los access tokens de GHL pueden tener larga duración:
- **Mitigación:** Refresh automático
- **Mejora futura:** Implementar token rotation

---

## Checklist de Seguridad

- [x] Validar que usuario existe en GHL antes de dar acceso
- [x] Verificar tokens OAuth por location
- [x] **Whitelist de usuarios de agencia en `GHL_AGENCY_USER_IDS`**
- [x] **Doble validación para agency users (whitelist + token)**
- [x] Firmar JWTs con secret seguro
- [x] Logging de intentos de acceso no autorizado
- [x] Validación en múltiples capas
- [x] Secretos en variables de entorno
- [x] Rechazo de usuarios no encontrados
- [x] Rechazo de agency users NO whitelistados
- [x] Mensajes de error informativos pero seguros
- [ ] Rate limiting (implementar si es necesario)
- [ ] Token rotation (mejora futura)
- [ ] Migrar a Custom Pages con iframe (si es necesario)

---

## Monitoreo de Seguridad

### Logs a Revisar

**Intentos de acceso no autorizado:**
```bash
grep "SECURITY: User not found" logs.txt
grep "SECURITY: Rejecting" logs.txt
```

**Errores de autenticación:**
```bash
grep "401" logs.txt | grep "Invalid JWT"
```

**Tokens expirados:**
```bash
grep "Token expired" logs.txt
```

---

## Reporte de Vulnerabilidades

Si encuentras un problema de seguridad:

1. **NO** lo publiques públicamente
2. Documenta el problema con detalles
3. Incluye pasos para reproducir
4. Reporta de manera privada

---

## Actualizaciones de Seguridad

### v2.1 - 20 Noviembre 2025
- ✅ **Whitelist de usuarios de agencia** (`GHL_AGENCY_USER_IDS`)
- ✅ Doble validación para agency users (whitelist + token)
- ✅ Prevención de ataques de simulación de agency user

### v2.0 - 20 Noviembre 2025
- ✅ Eliminada asunción de "Agency User" para usuarios no encontrados
- ✅ Validación estricta de userId
- ✅ Logging mejorado de intentos de acceso

### v1.0 - Inicial
- ✅ Implementación básica OAuth
- ✅ JWT para sesiones
- ✅ Validación de tokens

---

**Última actualización:** 20 de Noviembre, 2025 - v2.1
