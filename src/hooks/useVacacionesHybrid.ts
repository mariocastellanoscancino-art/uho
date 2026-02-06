"use client";

import { useState, useEffect, useCallback } from 'react';
import { useVacaciones as useVacacionesOriginal } from '@/hooks/useVacaciones';
import { useFirebaseVacations } from '@/hooks/useFirebaseVacations';
import { useFirebaseAuth } from '@/context/FirebaseAuthContext';
import { 
  SolicitudVacaciones as SolicitudFirebase,
  BalanceVacaciones 
} from '@/hooks/useFirebaseVacations';
import { 
  SolicitudVacaciones, 
  FormularioVacaciones, 
  Empleado 
} from '@/types/vacaciones';

// Hook híbrido que combina el sistema actual con Firebase
export function useVacacionesHybrid() {
  // Hooks originales
  const originalVacaciones = useVacacionesOriginal();
  
  // Hooks de Firebase
  const firebaseVacaciones = useFirebaseVacations();
  const { currentUser, userProfile } = useFirebaseAuth();
  
  // Estado local para manejar la transición
  const [useFirebaseData, setUseFirebaseData] = useState(false);
  
  // Función para convertir solicitud de Firebase a formato original
  const convertFirebaseToOriginal = (solicitudFB: SolicitudFirebase): SolicitudVacaciones => {
    return {
      id: solicitudFB.id,
      empleadoId: solicitudFB.empleadoId,
      empleadoNombre: solicitudFB.empleadoNombre,
      fechaInicio: solicitudFB.fechaInicio,
      fechaFin: solicitudFB.fechaFin,
      diasSolicitados: solicitudFB.diasSolicitados,
      motivo: solicitudFB.motivo,
      estado: solicitudFB.estado as 'pendiente' | 'aprobada' | 'rechazada',
      fechaSolicitud: solicitudFB.fechaSolicitud,
      aprobadoPor: solicitudFB.aprobadoPor,
      fechaAprobacion: solicitudFB.fechaAprobacion,
      comentariosAprobador: solicitudFB.comentariosAprobador,
    };
  };
  
  // Función para convertir formulario a formato Firebase
  const convertFormToFirebase = (form: FormularioVacaciones) => {
    return {
      fechaInicio: form.fechaInicio,
      fechaFin: form.fechaFin,
      diasSolicitados: form.diasSolicitados,
      motivo: form.motivo,
      tipoVacaciones: 'anuales' as const,
    };
  };

  // Función híbrida para crear solicitud
  const crearSolicitudVacaciones = useCallback(async (formData: FormularioVacaciones): Promise<boolean> => {
    try {
      if (currentUser && userProfile) {
        // Si hay usuario Firebase, usar Firebase
        console.log('💾 Guardando en Firebase:', formData);
        const firebaseData = convertFormToFirebase(formData);
        await firebaseVacaciones.crearSolicitud(firebaseData);
        setUseFirebaseData(true);
        return true;
      } else {
        // Si no hay usuario Firebase, usar sistema original
        console.log('📝 Usando sistema local:', formData);
        return originalVacaciones.crearSolicitudVacaciones(formData);
      }
    } catch (error) {
      console.error('Error creando solicitud:', error);
      // Fallback al sistema original si Firebase falla
      return originalVacaciones.crearSolicitudVacaciones(formData);
    }
  }, [currentUser, userProfile, firebaseVacaciones, originalVacaciones]);

  // Función híbrida para aprobar solicitud
  const aprobarSolicitud = useCallback(async (solicitudId: string, comentarios?: string): Promise<boolean> => {
    try {
      if (useFirebaseData && currentUser) {
        console.log('✅ Aprobando en Firebase:', solicitudId);
        await firebaseVacaciones.aprobarSolicitud(solicitudId, comentarios);
        return true;
      } else {
        console.log('✅ Aprobando en sistema local:', solicitudId);
        return originalVacaciones.aprobarSolicitud(solicitudId, comentarios);
      }
    } catch (error) {
      console.error('Error aprobando solicitud:', error);
      return originalVacaciones.aprobarSolicitud(solicitudId, comentarios);
    }
  }, [useFirebaseData, currentUser, firebaseVacaciones, originalVacaciones]);

  // Función híbrida para rechazar solicitud
  const rechazarSolicitud = useCallback(async (solicitudId: string, motivo: string): Promise<boolean> => {
    try {
      if (useFirebaseData && currentUser) {
        console.log('❌ Rechazando en Firebase:', solicitudId);
        await firebaseVacaciones.rechazarSolicitud(solicitudId, motivo);
        return true;
      } else {
        console.log('❌ Rechazando en sistema local:', solicitudId);
        return originalVacaciones.rechazarSolicitud(solicitudId, motivo);
      }
    } catch (error) {
      console.error('Error rechazando solicitud:', error);
      return originalVacaciones.rechazarSolicitud(solicitudId, motivo);
    }
  }, [useFirebaseData, currentUser, firebaseVacaciones, originalVacaciones]);

  // Función híbrida para cancelar solicitud
  const cancelarSolicitud = useCallback(async (solicitudId: string, motivo?: string): Promise<boolean> => {
    try {
      if (useFirebaseData && currentUser) {
        console.log('🚫 Cancelando en Firebase:', solicitudId);
        await firebaseVacaciones.cancelarSolicitud(solicitudId, motivo);
        return true;
      } else {
        console.log('🚫 Cancelando en sistema local:', solicitudId);
        return originalVacaciones.cancelarSolicitud(solicitudId, motivo);
      }
    } catch (error) {
      console.error('Error cancelando solicitud:', error);
      return originalVacaciones.cancelarSolicitud(solicitudId, motivo);
    }
  }, [useFirebaseData, currentUser, firebaseVacaciones, originalVacaciones]);

  // Determinar qué datos usar
  const solicitudes = useFirebaseData && firebaseVacaciones.solicitudes.length > 0 
    ? firebaseVacaciones.solicitudes.map(convertFirebaseToOriginal)
    : originalVacaciones.solicitudes;

  const loading = useFirebaseData ? firebaseVacaciones.loading : originalVacaciones.loading;
  const error = useFirebaseData ? firebaseVacaciones.error : originalVacaciones.error;

  // Crear empleado Firebase desde usuario actual si no existe
  useEffect(() => {
    if (currentUser && userProfile && !useFirebaseData) {
      console.log('👤 Usuario Firebase detectado:', userProfile.nombre);
      setUseFirebaseData(true);
    }
  }, [currentUser, userProfile, useFirebaseData]);

  return {
    // Datos híbridos
    solicitudes,
    empleados: originalVacaciones.empleados,
    loading,
    error,
    
    // Funciones híbridas
    crearSolicitudVacaciones,
    aprobarSolicitud,
    rechazarSolicitud,
    cancelarSolicitud,
    
    // Estados adicionales
    usingFirebase: useFirebaseData,
    firebaseUser: userProfile,
    firebaseBalance: firebaseVacaciones.balance,
    
    // Funciones originales como fallback
    ...originalVacaciones,
  };
}