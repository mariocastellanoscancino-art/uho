"use client";

import { useState, useEffect } from 'react';
import { 
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  emailVerified: boolean;
}

interface UseFirebaseReturn {
  user: FirebaseUser | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  addDocument: (collectionName: string, data: any) => Promise<string>;
  getDocument: (collectionName: string, docId: string) => Promise<any>;
  updateDocument: (collectionName: string, docId: string, data: any) => Promise<void>;
  getDocuments: (collectionName: string, whereClause?: any) => Promise<any[]>;
}

export function useFirebase(): UseFirebaseReturn {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          emailVerified: firebaseUser.emailVerified
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      setError(null);
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, displayName?: string): Promise<void> => {
    try {
      setError(null);
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      if (displayName && userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear cuenta');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setError(null);
      await firebaseSignOut(auth);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cerrar sesión');
      throw err;
    }
  };

  const addDocument = async (collectionName: string, data: any): Promise<string> => {
    try {
      if (!user) throw new Error('Usuario no autenticado');
      
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
        createdBy: user.uid
      });
      
      return docRef.id;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al agregar documento');
      throw err;
    }
  };

  const getDocument = async (collectionName: string, docId: string): Promise<any> => {
    try {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        throw new Error('Documento no encontrado');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener documento');
      throw err;
    }
  };

  const updateDocument = async (collectionName: string, docId: string, data: any): Promise<void> => {
    try {
      if (!user) throw new Error('Usuario no autenticado');
      
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
        updatedBy: user.uid
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar documento');
      throw err;
    }
  };

  const getDocuments = async (collectionName: string, whereClause?: any): Promise<any[]> => {
    try {
      let q;
      if (whereClause) {
        q = query(collection(db, collectionName), where(whereClause.field, whereClause.operator, whereClause.value));
      } else {
        q = query(collection(db, collectionName));
      }
      
      const querySnapshot = await getDocs(q);
      const documents: any[] = [];
      
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      
      return documents;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener documentos');
      throw err;
    }
  };

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    addDocument,
    getDocument,
    updateDocument,
    getDocuments
  };
}