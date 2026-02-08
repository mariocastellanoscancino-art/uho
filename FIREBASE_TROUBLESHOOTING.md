# 🚨 Solución de Problemas - Firebase No Conecta

## Pasos para Diagnosticar y Solucionar

### 1️⃣ **Verificar Variables de Entorno**

Abre tu archivo `.env.local` y asegúrate de que tenga este formato EXACTO (sin comillas):

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key_aqui
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

❌ **MAL** (con comillas):
```bash
NEXT_PUBLIC_FIREBASE_API_KEY="tu_api_key"
```

✅ **BIEN** (sin comillas):
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
```

### 2️⃣ **Obtener Credenciales Correctas de Firebase**

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Selecciona tu proyecto "uholidays2"
3. Haz clic en el ícono de ⚙️ (Configuración del proyecto)
4. Ve a la pestaña "General"
5. En "Tus aplicaciones" busca tu app web
6. Haz clic en el ícono de configuración `</>`
7. Copia los valores de `firebaseConfig`

### 3️⃣ **Verificar Estado del Proyecto Firebase**

En Firebase Console, asegúrate de que:
- ✅ **Authentication** esté habilitado
- ✅ **Firestore Database** esté creado
- ✅ Tu proyecto esté activo (no suspendido)

### 4️⃣ **Configurar Authentication**

1. Ve a **Authentication** > **Sign-in method**
2. Habilita **Email/Password**
3. Guarda los cambios

### 5️⃣ **Configurar Firestore Database**

1. Ve a **Firestore Database** 
2. Si no está creado, haz clic en **Crear base de datos**
3. Selecciona **Modo de prueba** (reglas permisivas temporalmente)
4. Elige una ubicación cercana

### 6️⃣ **Reglas de Firestore Temporales**

En **Firestore Database** > **Reglas**, usa estas reglas temporales para desarrollo:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

⚠️ **Importante**: Estas reglas son SOLO para desarrollo. Cambia a reglas específicas en producción.

### 7️⃣ **Comandos para Solucionar**

```bash
# 1. Parar el servidor
Ctrl+C

# 2. Limpiar caché de Next.js
rm -rf .next

# 3. Reinstalar Firebase (si es necesario)
npm uninstall firebase
npm install firebase@latest

# 4. Reiniciar servidor
npm run dev
```

### 8️⃣ **Verificar en la Consola del Navegador**

1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña **Console**
3. Busca mensajes de Firebase
4. Deberías ver: `✅ Firebase configurado para proyecto: tu_proyecto_id`

### 9️⃣ **Errores Comunes y Soluciones**

| Error | Causa | Solución |
|-------|-------|----------|
| `Firebase configuration object is invalid` | Variables mal configuradas | Revisar `.env.local` sin comillas |
| `Missing or insufficient permissions` | Reglas muy restrictivas | Usar reglas permisivas temporalmente |
| `Project 'X' not found` | Proyecto ID incorrecto | Verificar en Firebase Console |
| `Network request failed` | Problema de conectividad | Verificar internet y dominio |
| `Firebase app named '[DEFAULT]' already exists` | Inicialización duplicada | Ya resuelto en el código |

### 🔟 **Última Verificación**

Ve a `http://localhost:3000/firebase-test` y:

1. **Presiona "Probar Conexión Firebase"**
2. **Revisa el resultado:**
   - ✅ Verde = Todo funciona
   - ❌ Rojo = Hay errores
   - ⚠️ Amarillo = Conecta pero con problemas

### 📞 **Si Sigue Sin Funcionar**

1. **Copia el mensaje de error exacto** de la consola del navegador
2. **Verifica que el proyecto Firebase esté activo** en la consola
3. **Comprueba tu plan de Firebase** (¿está dentro de los límites gratuitos?)
4. **Prueba crear un proyecto Firebase nuevo** para descartar problemas del proyecto

---

## 🆘 Checklist Rápido

- [ ] `.env.local` sin comillas
- [ ] Variables copiadas de Firebase Console
- [ ] Authentication habilitado
- [ ] Firestore Database creado
- [ ] Reglas permisivas temporales
- [ ] Servidor reiniciado
- [ ] Sin errores en consola del navegador
- [ ] Proyecto Firebase activo

¡Siguiendo estos pasos deberías tener Firebase funcionando! 🚀