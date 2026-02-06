"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

// Interfaces TypeScript
interface PerfilUsuario {
  uid: string;
  email: string;
  nombre: string;
  apellidos: string;
  departamento: string;
  puesto: string;
  fechaIngreso: Date;
  diasVacacionesAnuales: number;
  diasDisponibles: number;
  supervisor?: string;
  permisos: {
    solicitarVacaciones: boolean;
    aprobarRechazarEquipo: boolean;
    consultarSolicitudesPendientes: boolean;
    consultarHistorialArea: boolean;
    consultarInformacionPersonal: boolean;
    visibilidadTotal: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface FirebaseAuthContextType {
  currentUser: User | null;
  userProfile: PerfilUsuario | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, userData: Partial<PerfilUsuario>) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (updates: Partial<PerfilUsuario>) => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const FirebaseAuthContext = createContext<FirebaseAuthContextType>({} as FirebaseAuthContextType);

export function useFirebaseAuth() {
  const context = useContext(FirebaseAuthContext);
  if (!context) {
    throw new Error('useFirebaseAuth debe ser usado dentro de FirebaseAuthProvider');
  }
  return context;
}

export function FirebaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<PerfilUsuario | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar perfil de usuario desde Firestore
  const loadUserProfile = async (user: User): Promise<PerfilUsuario | null> => {
    try {
      const userDoc = await getDoc(doc(db, 'empleados', user.uid));
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        return {
          uid: user.uid,
          email: user.email || '',
          ...data,
          fechaIngreso: data.fechaIngreso?.toDate() || new Date(),
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as PerfilUsuario;
      }
      
      // Si no existe perfil, crear uno básico
      const newProfile: PerfilUsuario = {
        uid: user.uid,
        email: user.email || '',
        nombre: user.displayName?.split(' ')[0] || '',
        apellidos: user.displayName?.split(' ').slice(1).join(' ') || '',
        departamento: '',
        puesto: '',
        fechaIngreso: new Date(),
        diasVacacionesAnuales: 20,
        diasDisponibles: 20,
        permisos: {
          solicitarVacaciones: true,
          aprobarRechazarEquipo: false,
          consultarSolicitudesPendientes: false,
          consultarHistorialArea: false,
          consultarInformacionPersonal: true,
          visibilidadTotal: false,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(doc(db, 'empleados', user.uid), {
        ...newProfile,
        fechaIngreso: newProfile.fechaIngreso,
        createdAt: newProfile.createdAt,
        updatedAt: newProfile.updatedAt,
      });

      return newProfile;
    } catch (error) {
      console.error('Error cargando perfil de usuario:', error);
      return null;
    }
  };

  // Función de login
  const login = async (email: string, password: string): Promise<void> => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  // Función de registro
  const register = async (email: string, password: string, userData: Partial<PerfilUsuario>): Promise<void> => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    
    if (userData.nombre) {
      await updateProfile(user, {
        displayName: `${userData.nombre} ${userData.apellidos || ''}`.trim()
      });
    }

    const newProfile: PerfilUsuario = {
      uid: user.uid,
      email: user.email || email,
      nombre: userData.nombre || '',
      apellidos: userData.apellidos || '',
      departamento: userData.departamento || '',
      puesto: userData.puesto || '',
      fechaIngreso: userData.fechaIngreso || new Date(),
      diasVacacionesAnuales: userData.diasVacacionesAnuales || 20,
      diasDisponibles: userData.diasDisponibles || userData.diasVacacionesAnuales || 20,
      supervisor: userData.supervisor,
      permisos: userData.permisos || {
        solicitarVacaciones: true,
        aprobarRechazarEquipo: false,
        consultarSolicitudesPendientes: false,
        consultarHistorialArea: false,
        consultarInformacionPersonal: true,
        visibilidadTotal: false,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(doc(db, 'empleados', user.uid), {
      ...newProfile,
      fechaIngreso: newProfile.fechaIngreso,
      createdAt: newProfile.createdAt,
      updatedAt: newProfile.updatedAt,
    });
  };

  // Función de logout
  const logout = async (): Promise<void> => {
    await signOut(auth);
    setUserProfile(null);
  };

  // Actualizar perfil de usuario
  const updateUserProfile = async (updates: Partial<PerfilUsuario>): Promise<void> => {
    if (!currentUser) throw new Error('No hay usuario autenticado');

    const updatedData = {
      ...updates,
      updatedAt: new Date(),
    };

    await updateDoc(doc(db, 'empleados', currentUser.uid), updatedData);
    await refreshUserProfile();
  };

  // Refrescar perfil de usuario
  const refreshUserProfile = async (): Promise<void> => {
    if (currentUser) {
      const profile = await loadUserProfile(currentUser);
      setUserProfile(profile);
    }
  };

  // Effect para manejar cambios de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        setLoading(true);
        setCurrentUser(user);

        if (user) {
          const profile = await loadUserProfile(user);
          setUserProfile(profile);
        } else {
          setUserProfile(null);
        }
      } catch (error) {
        console.error('Error en onAuthStateChanged:', error);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const value: FirebaseAuthContextType = {
    currentUser,
    userProfile,
    loading,
    login,
    register,
    logout,
    updateUserProfile,
    refreshUserProfile,
  };

  return (
    <FirebaseAuthContext.Provider value={value}>
      {children}
    </FirebaseAuthContext.Provider>
  );
}

export type { PerfilUsuario, FirebaseAuthContextType };
