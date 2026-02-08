# 🔥 Guía de Configuración de Firebase

## Resumen
Esta guía te ayudará a conectar correctamente tu aplicación Next.js con Firebase para el sistema de gestión de vacaciones.

## 📋 Requisitos Previos

1. **Cuenta de Google/Firebase**: Necesitas una cuenta de Google para acceder a Firebase Console
2. **Proyecto Firebase**: Crear un proyecto en [Firebase Console](https://console.firebase.google.com)
3. **Node.js**: Versión 18+ instalada
4. **Dependencias**: Firebase ya está instalado en tu proyecto

## 🚀 Pasos de Configuración

### 1. Configurar proyecto en Firebase Console

#### Crear proyecto (si no existe):
1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Haz clic en "Agregar proyecto"
3. Nombra tu proyecto (ej: "uholidays2")
4. Sigue los pasos del asistente

#### Configurar Authentication:
1. En el panel izquierdo, ve a **Authentication**
2. Haz clic en **Comenzar**
3. Ve a la pestaña **Sign-in method**
4. Habilita **Email/Password**

#### Configurar Firestore Database:
1. En el panel izquierdo, ve a **Firestore Database**
2. Haz clic en **Crear base de datos**
3. Selecciona **Modo de prueba** (temporalmente)
4. Elige una ubicación cercana

#### Configurar aplicación web:
1. En **Configuración del proyecto** (ícono de engranaje)
2. Haz clic en **Agregar aplicación** > **Web**
3. Registra la aplicación con un nombre
4. **IMPORTANTE**: Copia la configuración que aparece

### 2. Configurar variables de entorno

Actualiza tu archivo `.env.local` con los valores de tu proyecto Firebase:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key_aqui
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ABCDEF123
```

### 3. Configurar reglas de Firestore

En Firebase Console > Firestore Database > Reglas, pega el contenido del archivo `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir acceso a usuarios autenticados
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**⚠️ Nota**: Estas son reglas básicas para desarrollo. En producción, usa reglas más específicas.

## 🧪 Probar la Configuración

### Opción 1: Usar la página de prueba
1. Navega a: `http://localhost:3000/firebase-test`
2. Verifica que aparezca "✅ Firebase configurado correctamente"
3. Haz clic en "Probar Firestore"

### Opción 2: Usar el componente de prueba
Agrega este componente a cualquier página:

```tsx
import FirebaseConnectionTest from "@/components/FirebaseConnectionTest";

export default function MiPagina() {
  return (
    <div>
      <FirebaseConnectionTest />
    </div>
  );
}
```

### Opción 3: Usar el hook personalizado
```tsx
import { useFirebase } from "@/hooks/useFirebase";

export default function MiComponente() {
  const { user, loading, signIn, signOut } = useFirebase();

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      {user ? (
        <div>
          <p>Bienvenido: {user.email}</p>
          <button onClick={signOut}>Cerrar Sesión</button>
        </div>
      ) : (
        <div>
          <p>No hay usuario conectado</p>
          {/* Agregar formulario de login aquí */}
        </div>
      )}
    </div>
  );
}
```

## 📁 Archivos Importantes

- **`src/lib/firebase.js`**: Configuración principal de Firebase
- **`src/hooks/useFirebase.ts`**: Hook personalizado para operaciones Firebase
- **`src/components/FirebaseConnectionTest.tsx`**: Componente de prueba
- **`firestore.rules`**: Reglas de seguridad de Firestore
- **`.env.local`**: Variables de entorno (¡NO subir a Git!)

## 🔧 Comandos Útiles

```bash
# Verificar instalación de Firebase
npm list firebase

# Reinstalar Firebase si hay problemas
npm install firebase@latest

# Ejecutar en modo desarrollo
npm run dev

# Ver logs de Firebase (si usas Firebase CLI)
firebase serve --only firestore
```

## ⚠️ Errores Comunes y Soluciones

### Error: "Firebase configuration object is invalid"
- **Causa**: Variables de entorno mal configuradas
- **Solución**: Verifica que todas las variables estén en `.env.local` sin espacios ni comillas extra

### Error: "Firebase app named '[DEFAULT]' already exists"
- **Causa**: Firebase se inicializa múltiples veces
- **Solución**: Ya está solucionado en `firebase.js`

### Error: "Missing or insufficient permissions"
- **Causa**: Reglas de Firestore muy restrictivas
- **Solución**: Actualiza las reglas en Firebase Console

### Error: "Network request failed"
- **Causa**: Problemas de conectividad o configuración de dominio
- **Solución**: Verifica que el dominio esté configurado en Firebase Console

## 🔐 Seguridad

### Para Desarrollo:
- Usa reglas permisivas temporalmente
- Las variables `NEXT_PUBLIC_*` son visibles en el cliente

### Para Producción:
- Implementa reglas específicas por colección
- Usa Firebase Admin SDK para operaciones del servidor
- Configura dominios autorizados
- Habilita App Check para protección adicional

## 📞 Recursos Adicionales

- [Documentación oficial de Firebase](https://firebase.google.com/docs)
- [Firebase con Next.js](https://firebase.google.com/docs/web/setup)
- [Reglas de seguridad de Firestore](https://firebase.google.com/docs/firestore/security/get-started)

---

## 🎯 Estado Actual de tu Proyecto

✅ **Configurado correctamente**:
- Dependencias de Firebase instaladas
- Configuración básica en `firebase.js`
- Variables de entorno configuradas
- Componentes de prueba creados

🔄 **Pendiente** (opcional):
- Configurar reglas de producción
- Implementar autenticación completa
- Integrar con sistema de vacaciones existente

---

*Última actualización: 7 de febrero de 2026*