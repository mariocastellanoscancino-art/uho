import { useState, useEffect, useCallback } from 'react';
import { Empleado, SolicitudVacaciones, FormularioVacaciones, VacacionesStats, Usuario } from '@/types/vacaciones';

// Datos de ejemplo actualizados con la nueva estructura
const empleadosEjemplo: Empleado[] = [
  {
    id: '1',
    nombre: 'Francisco Javier',
    apellidos: 'Velazquez Servin',
    email: 'francisco.velazquez@empresa.com',
    departamento: 'Analista QA',
    fechaIngreso: new Date('2021-01-15'),
    diasVacacionesAnuales: 22,
    diasVacacionesUsados: 2,
    diasVacacionesDisponibles: 20,
  },
  {
    id: '2',
    nombre: 'María Elena',
    apellidos: 'González López',
    email: 'maria.gonzalez@empresa.com',
    departamento: 'QA',
    fechaIngreso: new Date('2019-03-10'),
    diasVacacionesAnuales: 25,
    diasVacacionesUsados: 8,
    diasVacacionesDisponibles: 17,
  },
  {
    id: '3',
    nombre: 'Carlos Roberto',
    apellidos: 'Rodríguez Martín',
    email: 'carlos.rodriguez@empresa.com',
    departamento: 'Tecnología',
    fechaIngreso: new Date('2018-07-01'),
    diasVacacionesAnuales: 28,
    diasVacacionesUsados: 15,
    diasVacacionesDisponibles: 13,
  },
  {
    id: '4',
    nombre: 'Patricio',
    apellidos: 'Bustos',
    email: 'patricio.bustos@empresa.com',
    departamento: 'Project Manager',
    fechaIngreso: new Date('2017-05-15'),
    diasVacacionesAnuales: 22,
    diasVacacionesUsados: 0,
    diasVacacionesDisponibles: 22,
  },
  {
    id: '5',
    nombre: 'Ana Sofía',
    apellidos: 'Martínez Vega',
    email: 'ana.martinez@empresa.com',
    departamento: 'Recursos Humanos',
    fechaIngreso: new Date('2016-09-01'),
    diasVacacionesAnuales: 28,
    diasVacacionesUsados: 5,
    diasVacacionesDisponibles: 23,
  },
  {
    id: '6',
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
    empleadoId: '1', // Francisco Javier
    fechaInicio: new Date('2026-02-15'),
    fechaFin: new Date('2026-02-19'),
    diasSolicitados: 5,
    motivo: 'Descanso personal',
    estado: 'pendiente',
    fechaSolicitud: new Date('2026-01-25'),
  },
  {
    id: '3',
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
      }

      if (diasSolicitados > empleado.diasVacacionesDisponibles) {
        throw new Error('No tiene suficientes días de vacaciones disponibles');
      }

      if (fechaInicio > fechaFin) {
        throw new Error('La fecha de inicio no puede ser posterior a la fecha de fin');
      }

      if (fechaInicio < new Date()) {
        throw new Error('La fecha de inicio no puede ser anterior a hoy');
      }

      const nuevaSolicitud: SolicitudVacaciones = {
        id: Date.now().toString(),
        empleadoId: formulario.empleadoId,
        fechaInicio,
        fechaFin,
        diasSolicitados,
        motivo: formulario.motivo,
        estado: 'pendiente',
        fechaSolicitud: new Date(),
      };

      setSolicitudes(prev => [...prev, nuevaSolicitud]);
      
      // Actualizar días disponibles del empleado
      setEmpleados(prev => prev.map(emp => 
        emp.id === formulario.empleadoId 
          ? { ...emp, diasVacacionesDisponibles: emp.diasVacacionesDisponibles - diasSolicitados }
          : emp
      ));

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
      setSolicitudes(prev => prev.map(sol => 
        sol.id === solicitudId 
          ? { 
              ...sol, 
              estado: 'aprobado' as const,
              comentariosAprobador: comentarios,
              aprobadoPor: 'Admin', // En un proyecto real, obtener del contexto de usuario
              fechaAprobacion: new Date()
            }
          : sol
      ));
    } catch (err) {
      setError('Error al aprobar la solicitud');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const rechazarSolicitud = useCallback(async (solicitudId: string, comentarios: string) => {
    try {
      setLoading(true);
      const solicitud = solicitudes.find(s => s.id === solicitudId);
      
      if (solicitud) {
        // Devolver los días al empleado
        setEmpleados(prev => prev.map(emp => 
          emp.id === solicitud.empleadoId 
            ? { ...emp, diasVacacionesDisponibles: emp.diasVacacionesDisponibles + solicitud.diasSolicitados }
            : emp
        ));
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
    } catch (err) {
      setError('Error al rechazar la solicitud');
      throw err;
    } finally {
      setLoading(false);
    }
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
    loading,
    error,
    crearSolicitudVacaciones,
    aprobarSolicitud,
    rechazarSolicitud,
    obtenerEstadisticas,
    calcularDiasHabiles,
    // Nuevas funciones para manejo de roles
    obtenerEmpleadosVisibles,
    obtenerSolicitudesVisibles,
    obtenerSolicitudesPendientesAprobacion,
  };
};