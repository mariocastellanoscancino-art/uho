"use client";

import { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useFirebaseAuth } from '@/context/FirebaseAuthContext';

// Interfaces para el sistema de vacaciones
export interface SolicitudVacaciones {
  id: string;
  empleadoId: string;
  empleadoNombre: string;
  fechaInicio: Date;
  fechaFin: Date;
  diasSolicitados: number;
  motivo: string;
  estado: 'pendiente' | 'aprobada' | 'rechazada' | 'cancelada';
  fechaSolicitud: Date;
  aprobadoPor?: string;
  fechaAprobacion?: Date;
  comentariosAprobador?: string;
  tipoVacaciones: 'anuales' | 'personales' | 'medicas' | 'maternidad' | 'paternidad';
  createdAt: Date;
  updatedAt: Date;
}

export interface BalanceVacaciones {
  empleadoId: string;
  anio: number;
  diasAsignados: number;
  diasUtilizados: number;
  diasPendientes: number;
  diasDisponibles: number;
  ultimaActualizacion: Date;
}

export interface HistorialVacaciones {
  id: string;
  solicitudId: string;
  empleadoId: string;
  accion: 'creada' | 'aprobada' | 'rechazada' | 'cancelada' | 'modificada';
  realizadaPor: string;
  fecha: Date;
  comentarios?: string;
  datosAnteriores?: any;
  datosNuevos?: any;
}

export function useFirebaseVacations() {
  const { currentUser, userProfile } = useFirebaseAuth();
  const [solicitudes, setSolicitudes] = useState<SolicitudVacaciones[]>([]);
  const [balance, setBalance] = useState<BalanceVacaciones | null>(null);
  const [historial, setHistorial] = useState<HistorialVacaciones[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Crear nueva solicitud de vacaciones
  const crearSolicitud = async (datosolicitud: Omit<SolicitudVacaciones, 'id' | 'empleadoId' | 'empleadoNombre' | 'estado' | 'fechaSolicitud' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    if (!currentUser || !userProfile) {
      throw new Error('Usuario no autenticado');
    }

    try {
      setLoading(true);
      setError(null);

      const nuevaSolicitud: Omit<SolicitudVacaciones, 'id'> = {
        ...datosolicitud,
        empleadoId: currentUser.uid,
        empleadoNombre: `${userProfile.nombre} ${userProfile.apellidos}`,
        estado: 'pendiente',
        fechaSolicitud: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Convertir fechas para Firestore
      const solicitudParaFirestore = {
        ...nuevaSolicitud,
        fechaInicio: Timestamp.fromDate(nuevaSolicitud.fechaInicio),
        fechaFin: Timestamp.fromDate(nuevaSolicitud.fechaFin),
        fechaSolicitud: Timestamp.fromDate(nuevaSolicitud.fechaSolicitud),
        createdAt: Timestamp.fromDate(nuevaSolicitud.createdAt),
        updatedAt: Timestamp.fromDate(nuevaSolicitud.updatedAt),
      };

      const docRef = await addDoc(collection(db, 'solicitudes_vacaciones'), solicitudParaFirestore);

      // Crear entrada en historial
      await addDoc(collection(db, 'historial_vacaciones'), {
        solicitudId: docRef.id,
        empleadoId: currentUser.uid,
        accion: 'creada',
        realizadaPor: currentUser.uid,
        fecha: Timestamp.fromDate(new Date()),
        comentarios: `Solicitud creada: ${datosolicitud.diasSolicitados} días desde ${datosolicitud.fechaInicio.toLocaleDateString()} hasta ${datosolicitud.fechaFin.toLocaleDateString()}`,
      });

      return docRef.id;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear solicitud';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Aprobar solicitud (solo supervisores)
  const aprobarSolicitud = async (solicitudId: string, comentarios?: string): Promise<void> => {
    if (!currentUser || !userProfile?.permisos.aprobarRechazarEquipo) {
      throw new Error('Sin permisos para aprobar solicitudes');
    }

    try {
      setLoading(true);
      setError(null);

      const batch = writeBatch(db);
      const solicitudRef = doc(db, 'solicitudes_vacaciones', solicitudId);

      // Actualizar solicitud
      batch.update(solicitudRef, {
        estado: 'aprobada',
        aprobadoPor: currentUser.uid,
        fechaAprobacion: Timestamp.fromDate(new Date()),
        comentariosAprobador: comentarios || '',
        updatedAt: Timestamp.fromDate(new Date()),
      });

      // Crear entrada en historial
      const historialRef = doc(collection(db, 'historial_vacaciones'));
      batch.set(historialRef, {
        solicitudId,
        empleadoId: currentUser.uid,
        accion: 'aprobada',
        realizadaPor: currentUser.uid,
        fecha: Timestamp.fromDate(new Date()),
        comentarios: comentarios || 'Solicitud aprobada',
      });

      await batch.commit();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al aprobar solicitud';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Rechazar solicitud (solo supervisores)
  const rechazarSolicitud = async (solicitudId: string, motivo: string): Promise<void> => {
    if (!currentUser || !userProfile?.permisos.aprobarRechazarEquipo) {
      throw new Error('Sin permisos para rechazar solicitudes');
    }

    try {
      setLoading(true);
      setError(null);

      const batch = writeBatch(db);
      const solicitudRef = doc(db, 'solicitudes_vacaciones', solicitudId);

      // Actualizar solicitud
      batch.update(solicitudRef, {
        estado: 'rechazada',
        aprobadoPor: currentUser.uid,
        fechaAprobacion: Timestamp.fromDate(new Date()),
        comentariosAprobador: motivo,
        updatedAt: Timestamp.fromDate(new Date()),
      });

      // Crear entrada en historial
      const historialRef = doc(collection(db, 'historial_vacaciones'));
      batch.set(historialRef, {
        solicitudId,
        empleadoId: currentUser.uid,
        accion: 'rechazada',
        realizadoPor: currentUser.uid,
        fecha: Timestamp.fromDate(new Date()),
        comentarios: `Solicitud rechazada: ${motivo}`,
      });

      await batch.commit();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al rechazar solicitud';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cancelar solicitud propia
  const cancelarSolicitud = async (solicitudId: string, motivo?: string): Promise<void> => {
    if (!currentUser) {
      throw new Error('Usuario no autenticado');
    }

    try {
      setLoading(true);
      setError(null);

      const batch = writeBatch(db);
      const solicitudRef = doc(db, 'solicitudes_vacaciones', solicitudId);

      // Actualizar solicitud
      batch.update(solicitudRef, {
        estado: 'cancelada',
        comentariosAprobador: motivo || 'Cancelada por el empleado',
        updatedAt: Timestamp.fromDate(new Date()),
      });

      // Crear entrada en historial
      const historialRef = doc(collection(db, 'historial_vacaciones'));
      batch.set(historialRef, {
        solicitudId,
        empleadoId: currentUser.uid,
        accion: 'cancelada',
        realizadaPor: currentUser.uid,
        fecha: Timestamp.fromDate(new Date()),
        comentarios: motivo || 'Solicitud cancelada por el empleado',
      });

      await batch.commit();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cancelar solicitud';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Calcular balance de vacaciones
  const calcularBalance = async (empleadoId?: string): Promise<BalanceVacaciones | null> => {
    const targetEmpleadoId = empleadoId || currentUser?.uid;
    if (!targetEmpleadoId) return null;

    try {
      const anioActual = new Date().getFullYear();
      
      // Obtener solicitudes aprobadas del año actual
      const solicitudesQuery = query(
        collection(db, 'solicitudes_vacaciones'),
        where('empleadoId', '==', targetEmpleadoId),
        where('estado', '==', 'aprobada')
      );

      const solicitudesSnapshot = await getDocs(solicitudesQuery);
      let diasUtilizados = 0;

      solicitudesSnapshot.forEach((doc) => {
        const data = doc.data();
        const fechaInicio = data.fechaInicio.toDate();
        if (fechaInicio.getFullYear() === anioActual) {
          diasUtilizados += data.diasSolicitados;
        }
      });

      // Obtener días asignados del perfil del empleado
      const empleadoDoc = await getDocs(query(
        collection(db, 'empleados'),
        where('uid', '==', targetEmpleadoId)
      ));

      let diasAsignados = 20; // Default
      if (!empleadoDoc.empty) {
        diasAsignados = empleadoDoc.docs[0].data().diasVacacionesAnuales || 20;
      }

      // Calcular días pendientes (solicitudes pendientes)
      const solicitudesPendientesQuery = query(
        collection(db, 'solicitudes_vacaciones'),
        where('empleadoId', '==', targetEmpleadoId),
        where('estado', '==', 'pendiente')
      );

      const pendientesSnapshot = await getDocs(solicitudesPendientesQuery);
      let diasPendientes = 0;

      pendientesSnapshot.forEach((doc) => {
        const data = doc.data();
        const fechaInicio = data.fechaInicio.toDate();
        if (fechaInicio.getFullYear() === anioActual) {
          diasPendientes += data.diasSolicitados;
        }
      });

      const balance: BalanceVacaciones = {
        empleadoId: targetEmpleadoId,
        anio: anioActual,
        diasAsignados,
        diasUtilizados,
        diasPendientes,
        diasDisponibles: diasAsignados - diasUtilizados - diasPendientes,
        ultimaActualizacion: new Date(),
      };

      if (targetEmpleadoId === currentUser?.uid) {
        setBalance(balance);
      }

      return balance;
    } catch (err) {
      console.error('Error calculando balance:', err);
      return null;
    }
  };

  // Configurar listeners en tiempo real
  useEffect(() => {
    if (!currentUser) return;

    let unsubscribeSolicitudes: (() => void) | undefined;
    let unsubscribeHistorial: (() => void) | undefined;

    // Listener para solicitudes
    if (userProfile?.permisos.consultarSolicitudesPendientes || userProfile?.permisos.visibilidadTotal) {
      // Ver todas las solicitudes si tiene permisos
      const solicitudesQuery = query(
        collection(db, 'solicitudes_vacaciones'),
        orderBy('fechaSolicitud', 'desc')
      );

      unsubscribeSolicitudes = onSnapshot(solicitudesQuery, (snapshot) => {
        const solicitudesData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            fechaInicio: data.fechaInicio.toDate(),
            fechaFin: data.fechaFin.toDate(),
            fechaSolicitud: data.fechaSolicitud.toDate(),
            fechaAprobacion: data.fechaAprobacion?.toDate(),
            createdAt: data.createdAt.toDate(),
            updatedAt: data.updatedAt.toDate(),
          } as SolicitudVacaciones;
        });
        setSolicitudes(solicitudesData);
      });
    } else {
      // Ver solo solicitudes propias
      const misSolicitudesQuery = query(
        collection(db, 'solicitudes_vacaciones'),
        where('empleadoId', '==', currentUser.uid),
        orderBy('fechaSolicitud', 'desc')
      );

      unsubscribeSolicitudes = onSnapshot(misSolicitudesQuery, (snapshot) => {
        const solicitudesData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            fechaInicio: data.fechaInicio.toDate(),
            fechaFin: data.fechaFin.toDate(),
            fechaSolicitud: data.fechaSolicitud.toDate(),
            fechaAprobacion: data.fechaAprobacion?.toDate(),
            createdAt: data.createdAt.toDate(),
            updatedAt: data.updatedAt.toDate(),
          } as SolicitudVacaciones;
        });
        setSolicitudes(solicitudesData);
      });
    }

    // Listener para historial (si tiene permisos)
    if (userProfile?.permisos.consultarHistorialArea || userProfile?.permisos.visibilidadTotal) {
      const historialQuery = query(
        collection(db, 'historial_vacaciones'),
        orderBy('fecha', 'desc')
      );

      unsubscribeHistorial = onSnapshot(historialQuery, (snapshot) => {
        const historialData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            fecha: data.fecha.toDate(),
          } as HistorialVacaciones;
        });
        setHistorial(historialData);
      });
    }

    // Calcular balance inicial
    calcularBalance();

    return () => {
      if (unsubscribeSolicitudes) unsubscribeSolicitudes();
      if (unsubscribeHistorial) unsubscribeHistorial();
    };
  }, [currentUser, userProfile]);

  return {
    solicitudes,
    balance,
    historial,
    loading,
    error,
    crearSolicitud,
    aprobarSolicitud,
    rechazarSolicitud,
    cancelarSolicitud,
    calcularBalance,
    refrescarDatos: () => {
      if (currentUser) {
        calcularBalance();
      }
    },
  };
}