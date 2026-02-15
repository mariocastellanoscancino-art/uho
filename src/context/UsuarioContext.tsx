"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Usuario, TipoUsuario, Permisos } from '@/types/vacaciones';

interface UsuarioContextType {
  usuarioActual: Usuario | null;
  permisos: Permisos;
  cambiarUsuario: (usuario: Usuario) => void;
  obtenerPermisosPorTipo: (tipo: TipoUsuario) => Permisos;
}

const UsuarioContext = createContext<UsuarioContextType | undefined>(undefined);

// Función para obtener permisos según el tipo de usuario
const obtenerPermisosPorTipo = (tipo: TipoUsuario): Permisos => {
  const permisosBase: Permisos = {
    // Permisos básicos (todos los tipos)
    consultarSaldoPropio: true,
    crearSolicitudPropia: true,
    cancelarSolicitudPropia: true,
    consultarHistorialPropio: true,
    
    // Permisos de supervisión (inicialmente false)
    aprobarRechazarEquipo: false,
    consultarSolicitudesPendientes: false,
    consultarHistorialArea: false,
    consultarInformacionPersonal: false,
    
    // Permisos de jefe (inicialmente false)
    aprobarCuandoEncargadoAusente: false,
    visibilidadTodosSubordinados: false,
    
    // Permisos de RRHH (inicialmente false)
    visibilidadTotal: false,
    gestionarEmpleados: false,
    configurarPoliticas: false,
    generarReportes: false,
  };

  switch (tipo) {
    case 'colaborador':
      return permisosBase; // Solo permisos básicos

    case 'encargado_area':
      return {
        ...permisosBase,
        aprobarRechazarEquipo: true,
        consultarSolicitudesPendientes: true,
        consultarHistorialArea: true,
        consultarInformacionPersonal: true,
      };

    case 'jefe_encargado':
      return {
        ...permisosBase,
        aprobarRechazarEquipo: true,
        consultarSolicitudesPendientes: true,
        consultarHistorialArea: true,
        consultarInformacionPersonal: true,
        aprobarCuandoEncargadoAusente: true,
        visibilidadTodosSubordinados: true,
      };

    case 'recursos_humanos':
      return {
        ...permisosBase,
        aprobarRechazarEquipo: true,
        consultarSolicitudesPendientes: true,
        consultarHistorialArea: true,
        consultarInformacionPersonal: true,
        visibilidadTotal: true,
        gestionarEmpleados: true,
        configurarPoliticas: true,
        generarReportes: true,
      };

    default:
      return permisosBase;
  }
};

// Datos de ejemplo de usuarios con diferentes roles
const usuariosEjemplo: Usuario[] = [
  {
    id: '1',
    nombre: 'Arturo',
    apellidos: 'Jimenez',
    email: 'arturo.jimenez@empresa.com',
    tipo: 'colaborador',
    departamento: 'Analista QA',
    fechaIngreso: new Date('2021-01-15'),
    encargadoId: '2',
    jefeId: '3',
    activo: true,
  },
  {
    id: '2',
    nombre: 'Patricio',
    apellidos: 'Bustos',
    email: 'patricio.bustos@empresa.com',
    tipo: 'encargado_area',
    departamento: 'Project Manager',
    fechaIngreso: new Date('2019-03-10'),
    jefeId: '3',
    equipoIds: ['1', '4'],
    activo: true,
  },
  {
    id: '3',
    nombre: 'Gabriel',
    apellidos: 'Rojo',
    email: 'gabriel.rojo@empresa.com',
    tipo: 'jefe_encargado',
    departamento: 'TI',
    fechaIngreso: new Date('2018-07-01'),
    equipoIds: ['1', '2', '4', '5'],
    activo: true,
  },
  
  {
    id: '5',
    nombre: 'Jesus ',
    apellidos: 'Navarro',
    email: 'Jesus.Navarro@empresa.com',
    tipo: 'recursos_humanos',
    departamento: 'Recursos Humanos',
    fechaIngreso: new Date('2016-09-01'),
    activo: true,
  },
];

interface Props {
  children: ReactNode;
}

export const UsuarioProvider: React.FC<Props> = ({ children }) => {
  // Por defecto, usar Patricio Bustos (encargado) para ver mejor funcionalidad
  const [usuarioActual, setUsuarioActual] = useState<Usuario | null>(
    usuariosEjemplo.find(u => u.nombre === 'Patricio') || usuariosEjemplo[2]
  );

  const permisos = usuarioActual ? obtenerPermisosPorTipo(usuarioActual.tipo) : obtenerPermisosPorTipo('colaborador');

  const cambiarUsuario = (usuario: Usuario) => {
    setUsuarioActual(usuario);
  };

  const value: UsuarioContextType = {
    usuarioActual,
    permisos,
    cambiarUsuario,
    obtenerPermisosPorTipo,
  };

  return (
    <UsuarioContext.Provider value={value}>
      {children}
    </UsuarioContext.Provider>
  );
};

export const useUsuario = (): UsuarioContextType => {
  const context = useContext(UsuarioContext);
  if (context === undefined) {
    throw new Error('useUsuario must be used within a UsuarioProvider');
  }
  return context;
};

export { UsuarioContext, usuariosEjemplo };