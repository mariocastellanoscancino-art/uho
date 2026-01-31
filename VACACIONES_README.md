# Módulo de Gestión de Vacaciones

Este módulo proporciona un sistema completo para la gestión de vacaciones de empleados con las siguientes características:

## 🚀 Características

### Dashboard Principal
- **Estadísticas en tiempo real**: Muestra métricas clave como total de empleados, solicitudes pendientes, vacaciones aprobadas y promedio de días por empleado
- **Vista resumida**: Acceso rápido a solicitudes recientes y empleados con menos días disponibles

### Gestión de Solicitudes
- **Crear nuevas solicitudes**: Formulario completo con validación
- **Aprobar/Rechazar solicitudes**: Sistema de aprobación con comentarios
- **Estados de seguimiento**: Pendiente, Aprobado, Rechazado, Cancelado
- **Cálculo automático**: Días hábiles, validación de disponibilidad

### Gestión de Empleados
- **Vista completa**: Lista de todos los empleados con su información de vacaciones
- **Progreso visual**: Barras de progreso para días usados vs disponibles
- **Cálculo de antigüedad**: Automático basado en fecha de ingreso
- **Alertas de disponibilidad**: Código de colores según días restantes

## 🏗️ Arquitectura del Proyecto

```
src/
├── types/
│   └── vacaciones.ts              # Interfaces y tipos TypeScript
├── hooks/
│   └── useVacaciones.ts           # Hook personalizado para lógica de negocio
├── components/
│   └── vacaciones/
│       ├── FormularioSolicitudVacaciones.tsx
│       ├── ListaSolicitudesVacaciones.tsx
│       ├── EstadisticasVacaciones.tsx
│       ├── ListaEmpleados.tsx
│       ├── AlertaVacaciones.tsx
│       └── index.ts               # Barrel export
└── app/
    └── (admin)/
        └── (others-pages)/
            └── vacaciones/
                ├── layout.tsx     # Layout con metadata
                └── page.tsx       # Página principal
```

## 🛠️ Tecnologías Utilizadas

- **Next.js 14+**: Framework React con App Router
- **TypeScript**: Tipado estático
- **Tailwind CSS**: Estilos utilitarios
- **React Hooks**: Estado y efectos
- **Componentes modulares**: Arquitectura reutilizable

## 📋 Buenas Prácticas Implementadas

### 1. Separación de Responsabilidades
- **Tipos**: Definidos en archivos separados para reutilización
- **Lógica de negocio**: Encapsulada en hooks personalizados
- **Componentes**: Modulares y reutilizables
- **UI**: Separada de la lógica de datos

### 2. Validación de Datos
- Validación en el frontend para UX inmediata
- Validación de fechas y disponibilidad
- Manejo de errores con mensajes descriptivos

### 3. Gestión de Estado
- Estado local con useState para UI
- Hook personalizado para lógica compleja
- Manejo de loading states y errores

### 4. Accesibilidad
- Labels apropiados en formularios
- Navegación por teclado
- Colores con suficiente contraste
- ARIA labels donde es necesario

### 5. Responsividad
- Diseño mobile-first
- Grid responsive para diferentes pantallas
- Tablas con scroll horizontal en móviles

## 🎨 Componentes Principales

### FormularioSolicitudVacaciones
- Formulario completo con validación
- Selector de empleados con información contextual
- Cálculo automático de días
- Validación de fechas y disponibilidad

### ListaSolicitudesVacaciones
- Tabla responsive con todas las solicitudes
- Acciones de aprobar/rechazar para administradores
- Estados visuales con código de colores
- Información detallada de cada solicitud

### EstadisticasVacaciones
- Cards con métricas importantes
- Iconos descriptivos
- Colores según el tipo de métrica
- Animaciones suaves

### ListaEmpleados
- Vista completa de empleados
- Barras de progreso para días usados
- Cálculo automático de antigüedad
- Información completa de vacaciones

## 🔧 Configuración y Uso

### 1. Instalación
El módulo está listo para usar, solo asegúrate de tener las dependencias del proyecto instaladas.

### 2. Navegación
Accede a `/admin/vacaciones` para ver el módulo completo.

### 3. Datos de Ejemplo
El módulo incluye datos de ejemplo para demostración. En producción, conecta con tu API backend.

## 🚀 Extensibilidad Futura

### Funcionalidades Sugeridas
- **Integración con calendario**: Mostrar vacaciones en calendario visual
- **Notificaciones**: Email/SMS para aprobaciones y recordatorios
- **Reportes**: Exportación a PDF/Excel de estadísticas
- **Políticas automáticas**: Reglas de negocio configurables
- **Integración con RRHH**: Conectar con sistemas existentes
- **Historial**: Audit trail de cambios y aprobaciones

### Mejoras Técnicas
- **API Integration**: Reemplazar datos mock con endpoints reales
- **Optimización**: React.memo y useMemo para mejor rendimiento
- **Testing**: Unit tests y integration tests
- **Internacionalización**: Soporte multi-idioma
- **PWA**: Funcionalidad offline

## 📊 Estructura de Datos

### Empleado
```typescript
interface Empleado {
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
  departamento: string;
  fechaIngreso: Date;
  diasVacacionesAnuales: number;
  diasVacacionesUsados: number;
  diasVacacionesDisponibles: number;
}
```

### SolicitudVacaciones
```typescript
interface SolicitudVacaciones {
  id: string;
  empleadoId: string;
  fechaInicio: Date;
  fechaFin: Date;
  diasSolicitados: number;
  motivo: string;
  estado: EstadoSolicitud;
  fechaSolicitud: Date;
  comentariosAprobador?: string;
  aprobadoPor?: string;
  fechaAprobacion?: Date;
}
```

## 🎯 Casos de Uso

1. **Empleado solicita vacaciones**
   - Completa formulario con fechas y motivo
   - Sistema valida disponibilidad
   - Solicitud queda pendiente de aprobación

2. **Supervisor aprueba/rechaza**
   - Revisa solicitud con contexto del empleado
   - Puede agregar comentarios
   - Empleado recibe notificación del estado

3. **Administrador monitorea**
   - Ve dashboard con métricas generales
   - Identifica patrones y tendencias
   - Toma decisiones basadas en datos

## 🔒 Consideraciones de Seguridad

- Validación tanto en frontend como backend
- Autorización por roles (empleado vs administrador)
- Audit log de todas las acciones
- Encriptación de datos sensibles
- Backup automático de información

---

**Desarrollado con ❤️ para una mejor gestión de recursos humanos**