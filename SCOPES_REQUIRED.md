# Scopes Requeridos para GoHighLevel OAuth

## Error: "The token is not authorized for this scope"

Este error significa que necesitas agregar más permisos (scopes) a tu configuración OAuth.

## Scopes Necesarios

Para que la aplicación funcione completamente, necesitas estos scopes en tu variable `GHL_OAUTH_SCOPES`:

### Mínimos requeridos para el SSO de usuarios:

```
contacts.readonly users.readonly locations.readonly
```

### Recomendados (para funcionalidad completa):

```
contacts.readonly contacts.write users.readonly users.write locations.readonly conversations/message.readonly conversations/message.write
```

## Cómo actualizar los scopes

### 1. Edita tu archivo `.env.local`

```env
GHL_OAUTH_SCOPES=contacts.readonly users.readonly locations.readonly
```

**IMPORTANTE:** Los scopes se separan con **espacios**, NO con comas.

### 2. RE-AUTORIZAR la aplicación

Después de cambiar los scopes, DEBES volver a autorizar:

1. Ve a: `https://uncancerous-vernal-mattie.ngrok-free.dev/api/v2/authorize`
2. Completa el flujo OAuth nuevamente
3. Esto actualizará los tokens con los nuevos permisos

### 3. Verificar los scopes guardados

Visita: `https://uncancerous-vernal-mattie.ngrok-free.dev/admin/locations`

En la página verás los scopes actuales de cada location autorizada.

## Scopes explicados

| Scope | Para qué sirve |
|-------|----------------|
| `contacts.readonly` | Leer contactos (ya lo tienes) |
| `contacts.write` | Crear/editar contactos |
| `users.readonly` | **NECESARIO** - Buscar y leer información de usuarios |
| `users.write` | Crear/editar usuarios |
| `locations.readonly` | Leer información de locations |
| `conversations/message.readonly` | Leer mensajes |
| `conversations/message.write` | Enviar mensajes |

## Scope actual vs. requerido

**El error ocurre porque:**
- Intentas usar: `/users/search/filter-by-email`
- Requiere: `users.readonly` scope
- Pero tu token probablemente solo tiene: `contacts.readonly`

## Solución rápida

1. Abre `.env.local`
2. Cambia la línea de scopes a:
   ```
   GHL_OAUTH_SCOPES=contacts.readonly users.readonly locations.readonly
   ```
3. Guarda el archivo
4. Ve a `/api/v2/authorize` y re-autoriza
5. Prueba el SSO nuevamente

## Notas importantes

- ⚠️ **Cada vez que cambies los scopes**, debes RE-AUTORIZAR
- 📝 Los tokens viejos no se actualizan automáticamente
- 🔄 Necesitas hacer el flujo OAuth completo otra vez
- 🎯 Solo pide los scopes que realmente necesitas (principio de menor privilegio)
