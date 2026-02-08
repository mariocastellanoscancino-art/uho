export type TipoUsuario = 'colaborador' | 'encargado_area' | 'jefe_encargado' | 'recursos_humanos';

export interface Usuario {
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
  tipo: TipoUsuario;
  departamento: string;
  fechaIngreso: Date;
  encargadoId?: string; // ID del encargado directo
  jefeId?: string; // ID del jefe del encargado
  equipoIds?: string[]; // IDs de subordinados directos (para encargados y jefes)
  activo: boolean;
}

export interface Empleado {
  id: string;
  numeroEmpleado: number; // Nuevo campo para mostrar ID numérico
  nombre: string;
  apellidos: string;
  email: string;
  departamento: string;
  fechaIngreso: Date;
  diasVacacionesAnuales: number;
  diasVacacionesUsados: number;
  diasVacacionesDisponibles: number;
  usuario?: Usuario; // Relación con usuario
}

export interface Permisos {
  // Permisos básicos (todos los tipos)
  consultarSaldoPropio: boolean;
  crearSolicitudPropia: boolean;
  cancelarSolicitudPropia: boolean;
  consultarHistorialPropio: boolean;
  
  // Permisos de supervisión (encargado y jefe)
  aprobarRechazarEquipo: boolean;
  consultarSolicitudesPendientes: boolean;
  consultarHistorialArea: boolean;
  consultarInformacionPersonal: boolean;
  
  // Permisos de jefe (jefe del encargado)
  aprobarCuandoEncargadoAusente: boolean;
  visibilidadTodosSubordinados: boolean;
  
  // Permisos de RRHH
  visibilidadTotal: boolean;
  gestionarEmpleados: boolean;
  configurarPoliticas: boolean;
  generarReportes: boolean;
}

export interface SolicitudVacaciones {
  id: string;
  numeroSolicitud?: number; // Nuevo campo para mostrar ID numérico
  empleadoId: string;
  fechaInicio: Date;
  fechaFin: Date;
  diasSolicitados: number;
  motivo: string;
  estado: EstadoSolicitud;
  fechaSolicitud: Date;
  fechaRespuesta?: Date; // Nueva fecha de respuesta
  comentarios?: string; // Campo para comentarios generales
  comentariosAprobador?: string;
  motivoRechazo?: string; // Nuevo motivo de rechazo
  aprobadoPor?: string;
  fechaAprobacion?: Date;
}

export type EstadoSolicitud = 'pendiente' | 'aprobado' | 'rechazado' | 'cancelado';

export interface FormularioVacaciones {
  empleadoId: string;
  fechaInicio: string;
  fechaFin: string;
  motivo: string;
  fechasSeleccionadas?: Date[]; // Nuevo campo para selección individual de días
}

export interface VacacionesStats {
  totalEmpleados: number;
  solicitudesPendientes: number;
  vacacionesAprobadas: number;
  diasPromedioPorEmpleado: number;
}