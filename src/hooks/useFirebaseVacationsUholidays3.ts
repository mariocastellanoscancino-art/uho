"use client";

import { useState } from 'react';
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  doc, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { SolicitudVacaciones, Empleado } from '@/types/vacaciones';

export function useFirebaseVacationsUholidays3() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [solicitudes, setSolicitudes] = useState<SolicitudVacaciones[]>([]);

  // Crear nueva solicitud de vacaciones en Firebase uholidays3
  const crearSolicitudVacaciones = async (solicitud: Omit<SolicitudVacaciones, 'id' | 'fechaCreacion'>) => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔄 Creando solicitud en uholidays3...');

      const nuevaSolicitud = {
        ...solicitud,
        fechaCreacion: serverTimestamp(),
        estado: 'pendiente',
        proyecto: 'uholidays3'
      };

      const docRef = await addDoc(collection(db, 'solicitudes_vacaciones'), nuevaSolicitud);
      
      console.log('✅ Solicitud creada en uholidays3 con ID:', docRef.id);
      
      // Actualizar estado local
      const solicitudConId = {
        ...solicitud,
        id: docRef.id,
        fechaCreacion: new Date(),
        estado: 'pendiente' as const
      };
      
      setSolicitudes(prev => [solicitudConId, ...prev]);
      
      return docRef.id;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear solicitud';
      setError(errorMessage);
      console.error('❌ Error creando solicitud en uholidays3:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Obtener todas las solicitudes de vacaciones
  const obtenerSolicitudes = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔄 Obteniendo solicitudes de uholidays3...');

      const q = query(
        collection(db, 'solicitudes_vacaciones'),
        orderBy('fechaCreacion', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const solicitudesData: SolicitudVacaciones[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        solicitudesData.push({
          id: doc.id,
          empleadoId: data.empleadoId || '',
          diasSolicitados: data.diasSolicitados || 0,
          motivo: data.motivo || '',
          estado: data.estado || 'pendiente',
          fechaSolicitud: data.fechaSolicitud?.toDate() || new Date(),
          fechaCreacion: data.fechaCreacion?.toDate() || new Date(),
          fechaInicio: new Date(data.fechaInicio),
          fechaFin: new Date(data.fechaFin),
          comentarios: data.comentarios || '',
          fechaAprobacion: data.fechaAprobacion?.toDate()
        } as SolicitudVacaciones);
      });

      setSolicitudes(solicitudesData);
      console.log('✅ Solicitudes obtenidas de uholidays3:', solicitudesData.length);
      return solicitudesData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener solicitudes';
      setError(errorMessage);
      console.error('❌ Error obteniendo solicitudes de uholidays3:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Aprobar o rechazar solicitud
  const actualizarEstadoSolicitud = async (id: string, estado: 'aprobado' | 'rechazado', comentarios?: string) => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔄 Actualizando solicitud en uholidays3:', id, estado);

      const solicitudRef = doc(db, 'solicitudes_vacaciones', id);
      await updateDoc(solicitudRef, {
        estado,
        comentarios: comentarios || '',
        fechaActualizacion: serverTimestamp()
      });

      console.log('✅ Solicitud actualizada en uholidays3:', id, estado);
      
      // Actualizar el estado local
      setSolicitudes(prev => 
        prev.map(solicitud => 
          solicitud.id === id 
            ? { ...solicitud, estado, comentarios }
            : solicitud
        )
      );

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar solicitud';
      setError(errorMessage);
      console.error('❌ Error actualizando solicitud en uholidays3:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar empleado en Firebase
  const actualizarEmpleado = async (empleadoId: string, datosEmpleado: Partial<Empleado>) => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔄 Actualizando empleado en uholidays3:', empleadoId);

      // En un sistema real, aquí actualizaríamos la colección de empleados
      // Por ahora, solo logueamos los cambios
      console.log('📊 Datos de empleado actualizados:', datosEmpleado);

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar empleado';
      setError(errorMessage);
      console.error('❌ Error actualizando empleado en uholidays3:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Probar conexión a Firebase
  const probarConexion = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔄 Probando conexión a uholidays3...');

      // Crear documento de prueba
      const docRef = await addDoc(collection(db, 'test_connection'), {
        mensaje: 'Prueba de conexión desde sistema de vacaciones',
        timestamp: serverTimestamp(),
        fecha: new Date().toISOString(),
        proyecto: 'uholidays3'
      });

      console.log('✅ Conexión exitosa a uholidays3. ID de prueba:', docRef.id);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error de conexión';
      setError(errorMessage);
      console.error('❌ Error de conexión a uholidays3:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    solicitudes,
    crearSolicitudVacaciones,
    obtenerSolicitudes,
    actualizarEstadoSolicitud,
    actualizarEmpleado,
    probarConexion
  };
}