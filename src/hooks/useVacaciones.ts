import { useState, useEffect, useCallback } from 'react';
import { Empleado, SolicitudVacaciones, FormularioVacaciones, VacacionesStats, Usuario } from '@/types/vacaciones';
import { useFirebaseVacationsUholidays3 } from '@/hooks/useFirebaseVacationsUholidays3';

// Datos de ejemplo actualizados con la nueva estructura
const empleadosEjemplo: Empleado[] = [
  {
    id: '1',
    numeroEmpleado: 1001,
    nombre: 'Arturo',
    apellidos: 'Jimenez',
    email: 'arturo.jimenez@empresa.com',
    departamento: 'Analista QA',
    fechaIngreso: new Date('2021-01-15'),
    diasVacacionesAnuales: 22,
    diasVacacionesUsados: 4,
    diasVacacionesDisponibles: 18,
  },
  {
    id: '2',
    numeroEmpleado: 1002,
    nombre: 'Patricio',
    apellidos: 'Bustos',
    email: 'patricio.bustos@empresa.com',
    departamento: 'QA',
    fechaIngreso: new Date('2019-03-10'),
    diasVacacionesAnuales: 25,
    diasVacacionesUsados: 25,
    diasVacacionesDisponibles: 0,
  },
  {
    id: '3',
    numeroEmpleado: 1003,
    nombre: 'Gabriel',
    apellidos: 'Rojo',
    email: 'gabriel.rojo@empresa.com',
    departamento: 'Tecnología',
    fechaIngreso: new Date('2018-07-01'),
    diasVacacionesAnuales: 28,
    diasVacacionesUsados: 15,
    diasVacacionesDisponibles: 13,
  },
 
  {
    id: '5',
    numeroEmpleado: 1005,
    nombre: 'Jesus ',
    apellidos: 'Navarro',
    email: 'Jesus.Navarro@empresa.com',
    departamento: 'Recursos Humanos',
    fechaIngreso: new Date('2016-09-01'),
    diasVacacionesAnuales: 28,
    diasVacacionesUsados: 5,
    diasVacacionesDisponibles: 23,
  },
  {
    id: '6',
    numeroEmpleado: 1006,
    nombre: 'Luis Fernando',
    apellidos: 'Pérez Soto',
    email: 'luis.perez@empresa.com',
    departamento: 'Desarrollo',
    fechaIngreso: new Date('2022-02-10'),
    diasVacacionesAnuales: 20,
    diasVacacionesUsados: 3,
    diasVacacionesDisponibles: 17,
  },
  {
    id: '7',
    numeroEmpleado: 1007,
    nombre: 'Sandra Patricia',
    apellidos: 'Ruiz Morales',
    email: 'sandra.ruiz@empresa.com',
    departamento: 'Diseño',
    fechaIngreso: new Date('2020-08-15'),
    diasVacacionesAnuales: 22,
    diasVacacionesUsados: 6,
    diasVacacionesDisponibles: 16,
  },
];

const solicitudesEjemplo: SolicitudVacaciones[] = [
  {
    id: '1',
    numeroSolicitud: 2026001,
    empleadoId: '4', // Patricio Bustos
    fechaInicio: new Date('2026-03-01'),
    fechaFin: new Date('2026-03-07'),
    diasSolicitados: 5,
    motivo: 'Viaje familiar',
    estado: 'pendiente',
    fechaSolicitud: new Date('2026-01-20'),
  },
  {
    id: '2',
    numeroSolicitud: 2026002,
    empleadoId: '1', // Arturo Jimenez
    fechaInicio: new Date('2026-02-15'),
    fechaFin: new Date('2026-02-19'),
    diasSolicitados: 5,
    motivo: 'Descanso personal',
    estado: 'pendiente',
    fechaSolicitud: new Date('2026-01-25'),
  },
  {
    id: '3',
    numeroSolicitud: 2025015,
    empleadoId: '6', // Luis Fernando
    fechaInicio: new Date('2025-12-15'),
    fechaFin: new Date('2025-12-18'),
    diasSolicitados: 4,
    motivo: 'Vacaciones navideñas',
    estado: 'aprobado',
    fechaSolicitud: new Date('2025-11-15'),
    aprobadoPor: 'Patricio Bustos',
    fechaAprobacion: new Date('2025-11-16'),
    comentariosAprobador: 'Aprobado. Buen descanso.'
  },
  {
    id: '4',
    numeroSolicitud: 2025020,
    empleadoId: '7', // Sandra Patricia
    fechaInicio: new Date('2025-11-03'),
    fechaFin: new Date('2025-11-05'),
    diasSolicitados: 3,
    motivo: 'Asuntos personales',
    estado: 'rechazado',
    fechaSolicitud: new Date('2025-10-15'),
    aprobadoPor: 'Patricio Bustos',
    fechaAprobacion: new Date('2025-10-16'),
    comentariosAprobador: 'Conflicto con fechas del proyecto. Solicita otras fechas.'
  },
  {
    id: '5',
    numeroSolicitud: 2026003,
    empleadoId: '2', // María Elena
    fechaInicio: new Date('2026-04-01'),
    fechaFin: new Date('2026-04-05'),
    diasSolicitados: 5,
    motivo: 'Capacitación externa',
    estado: 'aprobado',
    fechaSolicitud: new Date('2026-01-15'),
    aprobadoPor: 'Carlos Roberto Rodríguez',
    fechaAprobacion: new Date('2026-01-16'),
    comentariosAprobador: 'Aprobado para capacitación'
  },
];

export const useVacaciones = (usuarioActual?: Usuario) => {
  const [empleados, setEmpleados] = useState<Empleado[]>(empleadosEjemplo);
  const [solicitudes, setSolicitudes] = useState<SolicitudVacaciones[]>(solicitudesEjemplo);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Función para generar número de empleado único
  const generarNumeroEmpleado = useCallback((empleados: Empleado[]): number => {
    const numerosExistentes = empleados
      .map(emp => emp.numeroEmpleado)
      .filter(num => num !== undefined)
      .sort((a, b) => b - a);
    
    if (numerosExistentes.length === 0) {
      return 1001; // Primer número si no hay empleados
    }
    
    return numerosExistentes[0] + 1; // Siguiente número disponible
  }, []);

  // Función para asegurar que todos los empleados tengan números
  const asegurarNumerosEmpleados = useCallback((empleadosArray: Empleado[]): Empleado[] => {
    return empleadosArray.map(emp => {
      if (!emp.numeroEmpleado) {
        return {
          ...emp,
          numeroEmpleado: generarNumeroEmpleado(empleadosArray.filter(e => e.numeroEmpleado))
        };
      }
      return emp;
    });
  }, [generarNumeroEmpleado]);
  
  // Hook de Firebase para persistencia
  const {
    loading: firebaseLoading,
    error: firebaseError,
    solicitudes: solicitudesFirebase,
    crearSolicitudVacaciones: crearEnFirebase,
    obtenerSolicitudes: obtenerDeFirebase,
    actualizarEstadoSolicitud: actualizarEnFirebase,
    actualizarEmpleado: actualizarEmpleadoEnFirebase
  } = useFirebaseVacationsUholidays3();

  // Cargar solicitudes de Firebase al inicializar
  useEffect(() => {
    const cargarSolicitudesFirebase = async () => {
      try {
        const solicitudesDB = await obtenerDeFirebase();
        if (solicitudesDB && solicitudesDB.length > 0) {
          // Combinar solicitudes locales con las de Firebase, evitando duplicados
          setSolicitudes(prev => {
            const existingIds = prev.map(s => s.id);
            const nuevasSolicitudes = solicitudesDB.filter(s => !existingIds.includes(s.id));
            return [...prev, ...nuevasSolicitudes];
          });
        }
      } catch (error) {
        console.warn('No se pudieron cargar solicitudes de Firebase:', error);
      }
    };

    cargarSolicitudesFirebase();
  }, []);

  // Asegurar que todos los empleados tengan números correctos
  useEffect(() => {
    setEmpleados(prev => asegurarNumerosEmpleados(prev));
  }, [asegurarNumerosEmpleados]);

  // Función para obtener empleados según el tipo de usuario
  const obtenerEmpleadosVisibles = useCallback((usuario?: Usuario): Empleado[] => {
    if (!usuario) return empleados;

    switch (usuario.tipo) {
      case 'colaborador':
        // Solo puede ver su propia información
        return empleados.filter(emp => emp.id === usuario.id);
      
      case 'encargado_area':
        // Puede ver su equipo directo + él mismo
        const equipoDirecto = usuario.equipoIds || [];
        return empleados.filter(emp => 
          emp.id === usuario.id || equipoDirecto.includes(emp.id)
        );
      
      case 'jefe_encargado':
        // Puede ver todos sus subordinados + él mismo
        const todosSubordinados = usuario.equipoIds || [];
        return empleados.filter(emp => 
          emp.id === usuario.id || todosSubordinados.includes(emp.id)
        );
      
      case 'recursos_humanos':
        // Puede ver todos los empleados
        return empleados;
      
      default:
        return empleados.filter(emp => emp.id === usuario.id);
    }
  }, [empleados]);

  // Función para obtener solicitudes según el tipo de usuario
  const obtenerSolicitudesVisibles = useCallback((usuario?: Usuario): SolicitudVacaciones[] => {
    if (!usuario) return solicitudes;

    switch (usuario.tipo) {
      case 'colaborador':
        // Solo puede ver sus propias solicitudes
        return solicitudes.filter(sol => sol.empleadoId === usuario.id);
      
      case 'encargado_area':
        // Puede ver solicitudes de su equipo + las propias
        const equipoDirecto = usuario.equipoIds || [];
        return solicitudes.filter(sol => 
          sol.empleadoId === usuario.id || equipoDirecto.includes(sol.empleadoId)
        );
      
      case 'jefe_encargado':
        // Puede ver solicitudes de todos sus subordinados + las propias
        const todosSubordinados = usuario.equipoIds || [];
        return solicitudes.filter(sol => 
          sol.empleadoId === usuario.id || todosSubordinados.includes(sol.empleadoId)
        );
      
      case 'recursos_humanos':
        // Puede ver todas las solicitudes
        return solicitudes;
      
      default:
        return solicitudes.filter(sol => sol.empleadoId === usuario.id);
    }
  }, [solicitudes]);

  // Función para obtener solicitudes pendientes de aprobación
  const obtenerSolicitudesPendientesAprobacion = useCallback((usuario?: Usuario): SolicitudVacaciones[] => {
    if (!usuario) return [];

    const solicitudesVisibles = obtenerSolicitudesVisibles(usuario);
    
    switch (usuario.tipo) {
      case 'encargado_area':
      case 'jefe_encargado':
        // Solicitudes pendientes de su equipo (excluyendo las propias)
        return solicitudesVisibles.filter(sol => 
          sol.estado === 'pendiente' && sol.empleadoId !== usuario.id
        );
      
      case 'recursos_humanos':
        // Todas las solicitudes pendientes (puede aprobar cualquiera)
        return solicitudesVisibles.filter(sol => sol.estado === 'pendiente');
      
      default:
        return [];
    }
  }, [obtenerSolicitudesVisibles]);

  const calcularDiasHabiles = useCallback((fechaInicio: Date, fechaFin: Date): number => {
    let dias = 0;
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    
    for (let fecha = new Date(inicio); fecha <= fin; fecha.setDate(fecha.getDate() + 1)) {
      const diaSemana = fecha.getDay();
      if (diaSemana !== 0 && diaSemana !== 6) { // No es domingo (0) ni sábado (6)
        dias++;
      }
    }
    
    return dias;
  }, []);

  const crearSolicitudVacaciones = useCallback(async (formulario: FormularioVacaciones) => {
    try {
      setLoading(true);
      setError(null);

      const empleado = empleados.find(emp => emp.id === formulario.empleadoId);
      if (!empleado) {
        throw new Error('Empleado no encontrado');
      }

      // Validar que el empleado tenga días de vacaciones disponibles
      if (empleado.diasVacacionesDisponibles <= 0) {
        throw new Error(`Lo siento, no tienes días de vacaciones disponibles. Has utilizado ${empleado.diasVacacionesUsados} de ${empleado.diasVacacionesAnuales} días asignados para este año.`);
      }

      // Para formularios con fechas individuales
      let diasSolicitados: number;
      let fechaInicio: Date;
      let fechaFin: Date;

      if ('fechasSeleccionadas' in formulario && formulario.fechasSeleccionadas) {
        // Nuevo formato con días seleccionados individualmente
        const fechasSeleccionadas = formulario.fechasSeleccionadas as Date[];
        if (fechasSeleccionadas.length === 0) {
          throw new Error('Debe seleccionar al menos un día');
        }

        diasSolicitados = fechasSeleccionadas.length;
        
        // Validar que los días solicitados no excedan los días disponibles
        if (diasSolicitados > empleado.diasVacacionesDisponibles) {
          throw new Error(`No puedes solicitar ${diasSolicitados} días. Solo tienes ${empleado.diasVacacionesDisponibles} días disponibles.`);
        }
        
        // Ordenar fechas para obtener inicio y fin
        const fechasOrdenadas = [...fechasSeleccionadas].sort((a, b) => a.getTime() - b.getTime());
        fechaInicio = fechasOrdenadas[0];
        fechaFin = fechasOrdenadas[fechasOrdenadas.length - 1];

        // Validar que no haya fines de semana seleccionados
        // Comentado: Ahora se permite seleccionar fines de semana y días festivos
        // const tienenFinesDeSemana = fechasSeleccionadas.some(fecha => {
        //   const day = fecha.getDay();
        //   return day === 0 || day === 6;
        // });

        // if (tienenFinesDeSemana) {
        //   throw new Error('No se pueden seleccionar fines de semana');
        // }
      } else {
        // Formato original con rango de fechas
        fechaInicio = new Date(formulario.fechaInicio);
        fechaFin = new Date(formulario.fechaFin);
        diasSolicitados = calcularDiasHabiles(fechaInicio, fechaFin);
        
        // Validar que los días solicitados no excedan los días disponibles
        if (diasSolicitados > empleado.diasVacacionesDisponibles) {
          throw new Error(`No puedes solicitar ${diasSolicitados} días. Solo tienes ${empleado.diasVacacionesDisponibles} días disponibles.`);
        }
      }

      if (fechaInicio > fechaFin) {
        throw new Error('La fecha de inicio no puede ser posterior a la fecha de fin');
      }

      if (fechaInicio < new Date()) {
        throw new Error('La fecha de inicio no puede ser anterior a hoy');
      }

      // Generar número de solicitud secuencial
      const añoActual = new Date().getFullYear();
      const solicitudesDelAño = solicitudes.filter(s => {
        const fechaSol = new Date(s.fechaSolicitud);
        return fechaSol.getFullYear() === añoActual;
      });
      const siguienteNumero = solicitudesDelAño.length + 1;
      const numeroSolicitud = parseInt(`${añoActual}${siguienteNumero.toString().padStart(3, '0')}`);

      const nuevaSolicitud: SolicitudVacaciones = {
        id: Date.now().toString(),
        numeroSolicitud,
        empleadoId: formulario.empleadoId,
        fechaInicio,
        fechaFin,
        diasSolicitados,
        motivo: formulario.motivo,
        estado: 'pendiente',
        fechaSolicitud: new Date(),
      };

      // 🔥 GUARDAR EN FIREBASE
      try {
        console.log('💾 Guardando solicitud en Firebase...');
        const firebaseId = await crearEnFirebase(nuevaSolicitud);
        console.log('✅ Solicitud guardada en Firebase avec ID:', firebaseId);
        
        // Actualizar la solicitud con el ID de Firebase
        nuevaSolicitud.id = firebaseId;
      } catch (firebaseErr) {
        console.warn('⚠️ Error guardando en Firebase:', firebaseErr);
        // Continuar con el flujo local incluso si Firebase falla
      }

      setSolicitudes(prev => [...prev, nuevaSolicitud]);
      
      // Actualizar días disponibles del empleado
      setEmpleados(prev => prev.map(emp => 
        emp.id === formulario.empleadoId 
          ? { ...emp, diasVacacionesDisponibles: emp.diasVacacionesDisponibles - diasSolicitados }
          : emp
      ));

      console.log('🎉 Solicitud creada exitosamente:', nuevaSolicitud);
      return nuevaSolicitud;
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error desconocido';
      setError(mensaje);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [empleados, calcularDiasHabiles]);

  const aprobarSolicitud = useCallback(async (solicitudId: string, comentarios?: string) => {
    try {
      setLoading(true);
      
      // 🔥 ACTUALIZAR EN FIREBASE PRIMERO
      try {
        console.log('💾 Aprobando solicitud en Firebase...', solicitudId);
        await actualizarEnFirebase(solicitudId, 'aprobado', comentarios);
        console.log('✅ Solicitud aprobada en Firebase');
      } catch (firebaseErr) {
        console.warn('⚠️ Error aprobando en Firebase:', firebaseErr);
        // Continuar con actualización local aunque Firebase falle
      }

      // Actualizar solicitud en el estado local con toda la información
      setSolicitudes(prev => prev.map(sol => 
        sol.id === solicitudId 
          ? { 
              ...sol, 
              estado: 'aprobado' as const,
              comentariosAprobador: comentarios || 'Aprobado',
              aprobadoPor: usuarioActual?.nombre || 'Admin',
              fechaAprobacion: new Date()
            }
          : sol
      ));
      
      console.log('✅ Estado de solicitud actualizado a aprobado:', solicitudId);

      // 🔥 ACTUALIZAR DÍAS DEL EMPLEADO CUANDO SE APRUEBA
      const solicitud = solicitudes.find(s => s.id === solicitudId);
      if (solicitud) {
        const empleadoActualizado = empleados.find(emp => emp.id === solicitud.empleadoId);
        if (empleadoActualizado) {
          const nuevosDiasUsados = empleadoActualizado.diasVacacionesUsados + solicitud.diasSolicitados;
          
          // Actualizar en Firebase
          try {
            await actualizarEmpleadoEnFirebase(solicitud.empleadoId, {
              diasVacacionesUsados: nuevosDiasUsados
            });
            console.log('✅ Empleado actualizado en Firebase');
          } catch (firebaseErr) {
            console.warn('⚠️ Error actualizando empleado en Firebase:', firebaseErr);
          }

          // Actualizar estado local
          setEmpleados(prev => prev.map(emp => 
            emp.id === solicitud.empleadoId 
              ? { 
                  ...emp, 
                  diasVacacionesUsados: nuevosDiasUsados,
                  // Los días disponibles ya se descontaron al crear la solicitud
                }
              : emp
          ));
          console.log(`💼 Días actualizados para empleado ${solicitud.empleadoId}: +${solicitud.diasSolicitados} días usados`);
        }
      }

      console.log('🎉 Solicitud aprobada exitosamente:', solicitudId);
    } catch (err) {
      setError('Error al aprobar la solicitud');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [actualizarEnFirebase, actualizarEmpleadoEnFirebase, solicitudes, empleados, usuarioActual]);

  const rechazarSolicitud = useCallback(async (solicitudId: string, comentarios: string) => {
    try {
      setLoading(true);
      const solicitud = solicitudes.find(s => s.id === solicitudId);
      
      // Actualizar en Firebase primero
      await actualizarEnFirebase(solicitudId, 'rechazado', comentarios);

      if (solicitud) {
        const empleadoActualizado = empleados.find(emp => emp.id === solicitud.empleadoId);
        if (empleadoActualizado) {
          const nuevosDiasDisponibles = empleadoActualizado.diasVacacionesDisponibles + solicitud.diasSolicitados;
          
          // Actualizar en Firebase
          try {
            await actualizarEmpleadoEnFirebase(solicitud.empleadoId, {
              diasVacacionesDisponibles: nuevosDiasDisponibles
            });
            console.log('✅ Empleado actualizado en Firebase (días restaurados)');
          } catch (firebaseErr) {
            console.warn('⚠️ Error actualizando empleado en Firebase:', firebaseErr);
          }

          // Devolver los días al empleado en estado local
          setEmpleados(prev => prev.map(emp => 
            emp.id === solicitud.empleadoId 
              ? { ...emp, diasVacacionesDisponibles: nuevosDiasDisponibles }
              : emp
          ));
          console.log(`💼 Días restaurados para empleado ${solicitud.empleadoId}: +${solicitud.diasSolicitados} días disponibles`);
        }
      }

      setSolicitudes(prev => prev.map(sol => 
        sol.id === solicitudId 
          ? { 
              ...sol, 
              estado: 'rechazado' as const,
              comentariosAprobador: comentarios,
              aprobadoPor: 'Admin',
              fechaAprobacion: new Date()
            }
          : sol
      ));

      console.log('🚫 Solicitud rechazada exitosamente:', solicitudId);
    } catch (err) {
      setError('Error al rechazar la solicitud');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [actualizarEnFirebase, actualizarEmpleadoEnFirebase, solicitudes, empleados, usuarioActual]);

  const eliminarSolicitud = useCallback(async (solicitudId: string, motivo?: string) => {
    try {
      setLoading(true);
      const solicitud = solicitudes.find(s => s.id === solicitudId);
      
      if (!solicitud) {
        throw new Error('Solicitud no encontrada');
      }

      if (solicitud.estado !== 'pendiente') {
        throw new Error('Solo se pueden cancelar solicitudes pendientes');
      }

      // Devolver los días al empleado
      setEmpleados(prev => prev.map(emp => 
        emp.id === solicitud.empleadoId 
          ? { ...emp, diasVacacionesDisponibles: emp.diasVacacionesDisponibles + solicitud.diasSolicitados }
          : emp
      ));

      // En un sistema real, aquí se registraría el motivo de cancelación
      // Por ahora, simplemente eliminamos la solicitud
      setSolicitudes(prev => prev.filter(sol => sol.id !== solicitudId));
      
      // Log del motivo para debugging (en producción esto iría a una base de datos)
      if (motivo) {
        console.log(`Solicitud ${solicitudId} cancelada. Motivo: ${motivo}`);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cancelar la solicitud');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [solicitudes]);

  const obtenerHistorialCompleto = useCallback((usuario?: Usuario) => {
    let historial = solicitudes.filter(s => 
      s.estado === 'aprobado' || s.estado === 'rechazado'
    );
    
    console.log('🔍 obtenerHistorialCompleto - Total solicitudes:', solicitudes.length);
    console.log('🔍 obtenerHistorialCompleto - Historial filtrado (aprobadas/rechazadas):', historial.length);
    console.log('🔍 obtenerHistorialCompleto - Usuario:', usuario?.nombre, usuario?.tipo);
    
    if (!usuario) {
      return historial.sort((a, b) => {
        const fechaA = a.fechaAprobacion || a.fechaSolicitud;
        const fechaB = b.fechaAprobacion || b.fechaSolicitud;
        return fechaB.getTime() - fechaA.getTime();
      });
    }

    // Si es RH, puede ver todo el historial
    if (usuario.tipo === 'recursos_humanos') {
      console.log('📊 RH viendo historial completo:', historial.length, 'registros');
      return historial.sort((a, b) => {
        const fechaA = a.fechaAprobacion || a.fechaSolicitud;
        const fechaB = b.fechaAprobacion || b.fechaSolicitud;
        return fechaB.getTime() - fechaA.getTime();
      });
    }

    // Si es jefe o encargado, puede ver el historial de su equipo
    if (usuario.tipo === 'jefe_encargado' || usuario.tipo === 'encargado_area') {
      const equipoIds = usuario.equipoIds || [];
      historial = historial.filter(s => 
        s.empleadoId === usuario.id || equipoIds.includes(s.empleadoId)
      );
      console.log('👔 Jefe/Encargado viendo historial del equipo:', historial.length, 'registros');
    } else {
      // Colaborador normal solo ve su propio historial
      historial = historial.filter(s => s.empleadoId === usuario.id);
      console.log('👤 Colaborador viendo historial propio:', historial.length, 'registros');
    }
    
    // Ordenar por fecha de aprobación/rechazo más reciente
    return historial.sort((a, b) => {
      const fechaA = a.fechaAprobacion || a.fechaSolicitud;
      const fechaB = b.fechaAprobacion || b.fechaSolicitud;
      return fechaB.getTime() - fechaA.getTime();
    });
  }, [solicitudes]);

  const obtenerEstadisticas = useCallback((): VacacionesStats => {
    const solicitudesPendientes = solicitudes.filter(s => s.estado === 'pendiente').length;
    const vacacionesAprobadas = solicitudes.filter(s => s.estado === 'aprobado').length;
    const diasPromedioPorEmpleado = empleados.reduce((acc, emp) => acc + emp.diasVacacionesUsados, 0) / empleados.length;

    return {
      totalEmpleados: empleados.length,
      solicitudesPendientes,
      vacacionesAprobadas,
      diasPromedioPorEmpleado: Math.round(diasPromedioPorEmpleado * 100) / 100,
    };
  }, [empleados, solicitudes]);

  return {
    empleados,
    solicitudes,
    loading: loading || firebaseLoading,
    error: error || firebaseError,
    crearSolicitudVacaciones,
    aprobarSolicitud,
    rechazarSolicitud,
    eliminarSolicitud,
    obtenerEstadisticas,
    calcularDiasHabiles,
    // Nuevas funciones para manejo de roles
    obtenerEmpleadosVisibles,
    obtenerSolicitudesVisibles,
    obtenerSolicitudesPendientesAprobacion,
    obtenerHistorialCompleto,
  };
};