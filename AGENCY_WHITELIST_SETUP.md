# 🔒 Configuración de Whitelist para Usuarios de Agencia

## ¿Qué es esto?

Los **usuarios de agencia** en GoHighLevel son usuarios que tienen acceso a nivel de compañía/agencia, no solo a una location específica. 

Cuando estos usuarios intentan acceder a tu app vía Custom Menu Link, el API de GHL retorna un error porque el `userId` no pertenece a una location específica.

Para permitir el acceso seguro de estos usuarios, implementamos una **whitelist**.

---

## 🎯 Cómo Funciona

### Flujo de Validación

```
1. Usuario hace clic en Custom Menu Link
   ↓
2. App intenta obtener info del usuario con getUserInfo()
   ↓
3a. ✅ Usuario encontrado → Acceso permitido
   ↓
3b. ❌ Usuario NO encontrado (posible agency user o ataque)
   ↓
4. App verifica si userId está en whitelist de agencia
   ↓
5a. ❌ NO en whitelist → RECHAZAR (intento de ataque)
   ↓
5b. ✅ SÍ en whitelist → Validar access token
   ↓
6a. ❌ Token inválido → RECHAZAR
   ↓
6b. ✅ Token válido → PERMITIR como Agency User
```

---

## 📋 Configuración Paso a Paso

### 1. Obtener los userIds de tus usuarios de agencia

**Opción A: Desde los logs**

Cuando un usuario de agencia intente acceder por primera vez, verás este error en los logs:

```
[SSO] ❌ SECURITY: userId not in agency whitelist
[SSO] ❌ SECURITY: Rejecting unauthorized access for userId: i8oU45mSi7AEMjmWrpyT
```

Copia ese `userId`.

**Opción B: Desde el dashboard de GHL**

1. Ve a tu cuenta de agencia en GHL
2. Settings → My Staff
3. Busca al usuario de agencia
4. Copia su User ID

### 2. Agregar los IDs a tu `.env.local`

Abre tu archivo `.env.local` y agrega esta línea:

```bash
# IDs de usuarios de agencia permitidos (separados por coma)
GHL_AGENCY_USER_IDS=i8oU45mSi7AEMjmWrpyT,otro_user_id_aqui
```

**Formato:**
- Múltiples IDs separados por coma
- Con o sin espacios después de la coma (ambos funcionan)
- Sin comillas

**Ejemplos válidos:**
```bash
# Un solo usuario
GHL_AGENCY_USER_IDS=i8oU45mSi7AEMjmWrpyT

# Dos usuarios (sin espacios)
GHL_AGENCY_USER_IDS=i8oU45mSi7AEMjmWrpyT,abc123XYZ456

# Dos usuarios (con espacios - también funciona)
GHL_AGENCY_USER_IDS=i8oU45mSi7AEMjmWrpyT, abc123XYZ456
```

### 3. Reiniciar el servidor

```bash
# Detener el servidor actual
Ctrl + C

# Reiniciar
npm run dev
```

### 4. Probar el acceso

Pide al usuario de agencia que haga clic en el Custom Menu Link.

**Logs esperados (acceso exitoso):**
```
[SSO] ⚠️  User not found in location, checking if whitelisted agency user...
[SSO] 🔍 Checking userId against whitelist: { userId: 'i8oU45mSi7AEMjmWrpyT', whitelistSize: 2 }
[SSO] ✅ Whitelisted agency user verified - granting access
[SSO] Creating session for user: agency@user (isAdmin: true , isAgency: true )
```

---

## 🔍 Verificación de Seguridad

### ✅ Test 1: Usuario de agencia legítimo

```
URL: /api/sso?locationId=VALID&userId=i8oU45mSi7AEMjmWrpyT
Resultado esperado: ✅ Acceso permitido
Badge en dashboard: 🏢 AGENCIA
```

### ✅ Test 2: Usuario normal de location

```
URL: /api/sso?locationId=VALID&userId=vLUD5I5EES3tDbUmkde1
Resultado esperado: ✅ Acceso permitido
Badge en dashboard: 👤 USUARIO o 👑 ADMIN
```

### ❌ Test 3: userId inventado (ataque)

```
URL: /api/sso?locationId=VALID&userId=FAKE_USER_123
Resultado esperado: ❌ Acceso denegado
Error: "Acceso No Autorizado"
```

### ❌ Test 4: userId de agencia NO en whitelist

```
URL: /api/sso?locationId=VALID&userId=otro_agency_user_no_permitido
Resultado esperado: ❌ Acceso denegado
Logs: "userId not in agency whitelist"
```

---

## 🚨 Seguridad

### ¿Por qué es necesaria la whitelist?

Sin whitelist, cualquiera podría:

1. Obtener un `locationId` válido (fácil de adivinar o ver)
2. Inventar un `userId` cualquiera
3. Como el `getUserInfo()` fallaría, el código antiguo asumía "es agency user"
4. ❌ Obtendría acceso de admin sin estar autorizado

**Con whitelist:**
- Solo los userIds específicos en `GHL_AGENCY_USER_IDS` pueden acceder como agency users
- Cualquier otro userId que no se encuentre es rechazado
- Doble validación: whitelist + token válido

### ¿Qué pasa si alguien roba un userId de la whitelist?

Aún así necesitarían:
1. ✅ Un `locationId` válido (con tokens OAuth guardados)
2. ✅ Que el access token de esa location sea válido
3. ✅ Acceso al Custom Menu Link desde GHL

Es decir, ya necesitarían acceso legítimo a GHL.

---

## 🔧 Mantenimiento

### Agregar un nuevo usuario de agencia

1. Obtén su userId
2. Agrégalo a `GHL_AGENCY_USER_IDS` en `.env.local`:
   ```bash
   GHL_AGENCY_USER_IDS=user1,user2,nuevo_user_aqui
   ```
3. Reinicia el servidor

### Remover un usuario de agencia

1. Elimínalo de `GHL_AGENCY_USER_IDS`
2. Reinicia el servidor
3. Ese usuario ya no podrá acceder como agency user

### Ver la whitelist actual

Los logs muestran el tamaño de la whitelist en cada intento:

```
[SSO] 🔍 Checking userId against whitelist: { userId: '...', whitelistSize: 2 }
```

Si ves `whitelistSize: 0`, significa que `GHL_AGENCY_USER_IDS` no está configurado o está vacío.

---

## ❓ Troubleshooting

### Usuario de agencia no puede acceder

**Síntoma:** Usuario de agencia ve "Acceso No Autorizado"

**Posibles causas:**

1. **No está en la whitelist**
   - Solución: Agregar su userId a `GHL_AGENCY_USER_IDS`

2. **Variable de entorno mal configurada**
   - Verificar: Los logs deben mostrar `whitelistSize: 2` (o el número correcto)
   - Si muestra `0`, la variable no está cargada

3. **Servidor no reiniciado**
   - Solución: Reiniciar después de cambios en `.env.local`

4. **Formato incorrecto**
   - ❌ Incorrecto: `GHL_AGENCY_USER_IDS="id1,id2"` (con comillas)
   - ✅ Correcto: `GHL_AGENCY_USER_IDS=id1,id2` (sin comillas)

### Logs muestran whitelistSize: 0

Significa que la variable no está configurada.

**Solución:**
```bash
# En .env.local, agregar:
GHL_AGENCY_USER_IDS=tu_user_id_1,tu_user_id_2

# Reiniciar servidor
npm run dev
```

---

## 📚 Documentación Relacionada

- [SECURITY.md](./SECURITY.md) - Detalles completos de seguridad
- [.env.example](./.env.example) - Ejemplo de configuración
- [SETUP_CUSTOM_MENU_LINK.md](./SETUP_CUSTOM_MENU_LINK.md) - Configuración de Custom Menu Link

---

**Última actualización:** 20 de Noviembre, 2025
