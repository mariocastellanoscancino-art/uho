// Configuración de Firebase para el sistema de vacaciones
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuración del proyecto Firebase uholidays3
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Log de configuración para depuración
console.log('🔧 Configuración Firebase:', {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    hasApiKey: !!firebaseConfig.apiKey,
    hasAppId: !!firebaseConfig.appId
});

// Inicializar Firebase
let app;
try {
    app = initializeApp(firebaseConfig);
    console.log('🔥 Firebase inicializado correctamente');
} catch (error) {
    console.error('❌ Error al inicializar Firebase:', error);
    throw error;
}

// Inicializar servicios
export const auth = getAuth(app);
export const db = getFirestore(app);

// Log de confirmación
console.log('✅ Firebase configurado para proyecto:', firebaseConfig.projectId);
