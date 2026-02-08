# 🆕 Configuración para proyecto uholidays3

## 📋 Pasos para obtener las credenciales correctas:

### 1. Ir a Firebase Console
- Ve a: https://console.firebase.google.com
- Selecciona el proyecto **"uholidays3"**

### 2. Acceder a configuración
- Haz clic en el ícono ⚙️ (engranaje) en la barra lateral izquierda
- Selecciona **"Configuración del proyecto"**

### 3. Buscar aplicación web
- Ve a la pestaña **"General"**
- Desplázate hasta **"Tus aplicaciones"**
- Si NO ves una aplicación web (ícono `</>`):
  - Haz clic en **"Agregar aplicación"**
  - Selecciona **"Web" (ícono `</>`)**
  - Dale un nombre (ej: "uholidays-web")
  - NO marcar "También configurar Firebase Hosting"
  - Haz clic en **"Registrar aplicación"**

### 4. Copiar configuración
Verás un código similar a este:

```javascript
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCTkcNYJSDO7uQHTXkOnEA-9Tg9KJ64Dzk",
  authDomain: "uholidays3.firebaseapp.com", 
  projectId: "uholidays3",
  storageBucket: "uholidays3.firebasestorage.app",
  messagingSenderId: "297247688694",
  appId: "1:297247688694:web:dc550d3cdc92987bbee9d7",
  measurementId: "G-NZ04XFTXHS"
};
```

### 5. Actualizar .env.local
Reemplaza estos valores en tu archivo `.env.local`:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCTkcNYJSDO7uQHTXkOnEA-9Tg9KJ64Dzk
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=uholidays3.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=uholidays3
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=uholidays3.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=297247688694
NEXT_PUBLIC_FIREBASE_APP_ID=1:297247688694:web:dc550d3cdc92987bbee9d7
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-NZ04XFTXHS
```

⚠️ **IMPORTANTE**: Usa TUS valores reales, no estos de ejemplo.

### 6. Configurar servicios necesarios

#### Habilitar Authentication:
1. En el menú izquierdo, ve a **"Authentication"**
2. Haz clic en **"Comenzar"**
3. Ve a **"Sign-in method"**
4. Habilita **"Correo electrónico/contraseña"**
5. Guarda los cambios

#### Crear Firestore Database:
1. En el menú izquierdo, ve a **"Firestore Database"**
2. Haz clic en **"Crear base de datos"**
3. Selecciona **"Comenzar en modo de prueba"**
4. Elige una ubicación (recomendado: us-central1)
5. Haz clic en **"Listo"**

### 7. Probar la conexión
Una vez actualizado el `.env.local`:
1. Reinicia el servidor: `npm run dev`
2. Ve a: `http://localhost:3000/firebase-test`
3. Haz clic en **"Ejecutar Diagnóstico Completo"**

---

## 🎯 Resultado esperado:
✅ **Variables OK - Proyecto: uholidays3**
✅ **Firebase App inicializada**  
✅ **Firestore inicializado**
🎉 **¡ÉXITO! Documento creado con ID: [ID_DEL_DOCUMENTO]**

Si ves estos mensajes, Firebase está funcionando correctamente.