# 📚 Explicación Técnica del Módulo de Vacaciones

## 🎯 Arquitectura General del Sistema

El sistema de vacaciones está construido siguiendo una arquitectura **Component-Based** con **Custom Hooks** para la lógica de negocio, utilizando **React Context** para el estado global y **TypeScript** para el tipado estático.

---

## 🏗️ Estructura de Archivos y Propósito

### 📁 **1. Tipos y Interfaces**

**📍 Ubicación:** `/Users/mario/Documents/git/uholidays2/src/types/vacaciones.ts`

**Propósito:** Define el **modelo de datos** completo del sistema
```typescript
// Define los 4 tipos de usuario del sistema
export type TipoUsuario = 'colaborador' | 'encargado_area' | 'jefe_encargado' | 'recursos_humanos';

// Estructura de un usuario con jerarquía organizacional
export interface Usuario {
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
  tipo: TipoUsuario;              // Rol del usuario
  departamento: string;
  fechaIngreso: Date;
  encargadoId?: string;           // Supervisor directo
  jefeId?: string;                // Jefe del supervisor
  equipoIds?: string[];           // Subordinados a cargo
  activo: boolean;
}
```

**¿Para qué sirve?**
- 🎯 **Establece contratos de datos** claros entre componentes
- 🔧 **Habilita autocompletado** e IntelliSense en el IDE
- ⚡ **Previene errores** de tipado en tiempo de desarrollo
- 🧩 **Documenta implícitamente** la estructura de datos

### 📁 **2. Lógica de Negocio (Hook Principal)**

**📍 Ubicación:** `/Users/mario/Documents/git/uholidays2/src/hooks/useVacaciones.ts`

**Propósito:** Es el **cerebro** del sistema, contiene toda la lógica de negocio

#### **🔍 Datos de Prueba**
```typescript
const empleadosEjemplo: Empleado[] = [
  {
    id: '1',
    nombre: 'Arturo',
    apellidos: 'Jimenez',
    diasVacacionesAnuales: 22,     // Días totales del año
    diasVacacionesUsados: 4,       // Días ya consumidos
    diasVacacionesDisponibles: 18, // Días restantes (22 - 4)
  }
  // ... más empleados
];
```

#### **🎭 Control de Visibilidad por Roles**
```typescript
const obtenerEmpleadosVisibles = useCallback((usuario?: Usuario): Empleado[] => {
  switch (usuario.tipo) {
    case 'colaborador':
      // Solo ve su propia información
      return empleados.filter(emp => emp.id === usuario.id);
    
    case 'encargado_area':
      // Ve su equipo directo + él mismo
      const equipoDirecto = usuario.equipoIds || [];
      return empleados.filter(emp => 
        emp.id === usuario.id || equipoDirecto.includes(emp.id)
      );
    
    case 'recursos_humanos':
      // Ve todo el sistema
      return empleados;
  }
}, [empleados]);
```

**¿Para qué sirve?**
- 🔐 **Implementa seguridad** basada en roles
- 🎯 **Filtra datos** según permisos del usuario
- ⚡ **Centraliza lógica de negocio** en un lugar
- 🔄 **Mantiene estado consistente** entre componentes

#### **🛡️ Validación de Disponibilidad**
```typescript
const crearSolicitudVacaciones = useCallback(async (formulario: FormularioVacaciones) => {
  // 1. Verificar que el empleado existe
  const empleado = empleados.find(emp => emp.id === formulario.empleadoId);
  if (!empleado) throw new Error('Empleado no encontrado');

  // 2. Validar días disponibles (REGLA DE NEGOCIO CRÍTICA)
  if (empleado.diasVacacionesDisponibles <= 0) {
    throw new Error(`No tienes días disponibles. Has usado ${empleado.diasVacacionesUsados} de ${empleado.diasVacacionesAnuales}`);
  }

  // 3. Verificar que no exceda el límite
  if (diasSolicitados > empleado.diasVacacionesDisponibles) {
    throw new Error(`Solo tienes ${empleado.diasVacacionesDisponibles} días disponibles.`);
  }
});
```

**¿Para qué sirve?**
- ⚖️ **Aplica reglas de negocio** críticas
- 🚫 **Previene solicitudes inválidas**
- 💬 **Proporciona feedback claro** al usuario
- 🧮 **Maneja cálculos complejos** (días hábiles, fechas)

### 📁 **3. Estado Global (Context)**

**📍 Ubicación:** `/Users/mario/Documents/git/uholidays2/src/context/UsuarioContext.tsx`

**Propósito:** Maneja el **usuario activo** y sus **permisos** globalmente

#### **🎭 Sistema de Permisos Granular**
```typescript
const obtenerPermisosPorTipo = (tipo: TipoUsuario): Permisos => {
  switch (tipo) {
    case 'colaborador':
      return {
        consultarSaldoPropio: true,
        crearSolicitudPropia: true,
        aprobarRechazarEquipo: false,    // NO puede aprobar
        visibilidadTotal: false,         // NO ve todo
      };
    
    case 'encargado_area':
      return {
        ...permisosBase,
        aprobarRechazarEquipo: true,     // SÍ puede aprobar equipo
        consultarSolicitudesPendientes: true,
      };
    
    case 'recursos_humanos':
      return {
        ...permisosBase,
        visibilidadTotal: true,          // Ve TODO el sistema
        gestionarEmpleados: true,
        configurarPoliticas: true,
      };
  }
};
```

**¿Para qué sirve?**
- 🌐 **Estado compartido** entre todos los componentes
- 🔐 **Control de acceso** dinámico
- 🎯 **Evita prop drilling** (pasar datos por múltiples niveles)
- ⚡ **Cambio de usuario** en tiempo real para testing

#### **🔄 Cambio de Usuario Dinámico**
```typescript
const [usuarios] = useState<Usuario[]>([
  {
    id: '1',
    tipo: 'colaborador',
    equipoIds: [],
  },
  {
    id: '2', 
    tipo: 'encargado_area',
    equipoIds: ['1', '3', '6'], // Tiene equipo a cargo
  }
]);

const cambiarUsuario = (usuario: Usuario) => {
  setUsuarioActual(usuario);
  setPermisos(obtenerPermisosPorTipo(usuario.tipo));
};
```

**¿Para qué sirve?**
- 🧪 **Testing de roles** sin autenticación real
- 🎭 **Demostración** de funcionalidades por rol
- 🔄 **Cambio de contexto** instantáneo
- 📊 **Pruebas de UX** para diferentes usuarios

### 📁 **4. Componentes de UI**

#### **📋 Formulario de Solicitudes**

**📍 Ubicación:** `/Users/mario/Documents/git/uholidays2/src/components/vacaciones/FormularioSolicitudVacaciones.tsx`

**Propósito:** Captura datos de nuevas solicitudes con validación

```typescript
const validarFormulario = (): boolean => {
  const newErrors: Partial<FormularioVacaciones> = {};

  if (!formulario.empleadoId) {
    newErrors.empleadoId = 'Debe seleccionar un empleado';
  }

  if (formulario.fechaInicio && formulario.fechaFin) {
    const inicio = new Date(formulario.fechaInicio);
    const fin = new Date(formulario.fechaFin);
    
    if (inicio > fin) {
      newErrors.fechaFin = 'La fecha fin debe ser posterior al inicio';
    }

    if (inicio < new Date()) {
      newErrors.fechaInicio = 'No se pueden seleccionar fechas pasadas';
    }
  }

  return Object.keys(newErrors).length === 0;
};
```

**¿Para qué sirve?**
- ✅ **Validación en tiempo real** mientras el usuario escribe
- 🚫 **Previene errores** antes de enviar
- 💬 **Feedback inmediato** con mensajes claros
- 🎯 **UX mejorada** con estados de error visual

#### **📅 Calendario de Selección**

**📍 Ubicación:** `/Users/mario/Documents/git/uholidays2/src/components/vacaciones/CalendarioSelectorDias.tsx`

**Propósito:** Permite selección **visual e intuitiva** de días individuales

```typescript
// Días festivos predeterminados de México
const diasFestivosPredeterminados = [
  new Date(2026, 0, 1),   // Año Nuevo
  new Date(2026, 8, 16),  // Independencia
  new Date(2026, 11, 25), // Navidad
];

const handleDateClick = (date: Date) => {
  if (isDateDisabled(date)) return;

  const dateIndex = selectedDates.findIndex(
    selectedDate => selectedDate.toDateString() === date.toDateString()
  );

  if (dateIndex > -1) {
    // Si ya está seleccionada, la quita
    const newDates = [...selectedDates];
    newDates.splice(dateIndex, 1);
    onDateSelect(newDates);
  } else {
    // Si no está seleccionada, la agrega
    onDateSelect([...selectedDates, date]);
  }
};
```

**¿Para qué sirve?**
- 🎯 **Selección visual** más intuitiva que campos de texto
- 📱 **UX móvil-first** con interacciones táctiles
- 🏖️ **Incluye fines de semana** (permitido en el sistema)
- 📆 **Respeta días festivos** mexicanos
- ✨ **Feedback visual** inmediato de días seleccionados

#### **📊 Estadísticas Personales**

**📍 Ubicación:** `/Users/mario/Documents/git/uholidays2/src/components/vacaciones/TarjetasEstadisticasPersonales.tsx`

**Propósito:** Dashboard visual con **alertas de disponibilidad**

```typescript
const getDiasDisponiblesInfo = (empleado: Empleado) => {
  const disponibles = empleado.diasVacacionesDisponibles;
  const porcentajeUsado = (empleado.diasVacacionesUsados / empleado.diasVacacionesAnuales) * 100;

  if (disponibles === 0) {
    return {
      color: 'red',           // 🔴 Sin días
      borderColor: 'border-red-200 dark:border-red-800',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      textColor: 'text-red-900 dark:text-red-200',
      icon: '⚠️'
    };
  } else if (disponibles <= 5) {
    return {
      color: 'orange',        // 🟠 Pocos días
      borderColor: 'border-orange-200 dark:border-orange-800',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      textColor: 'text-orange-900 dark:text-orange-200', 
      icon: '⚡'
    };
  } else {
    return {
      color: 'green',         // 🟢 Suficientes días
      borderColor: 'border-green-200 dark:border-green-800',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-900 dark:text-green-200',
      icon: '✅'
    };
  }
};
```

**¿Para qué sirve?**
- 🚦 **Sistema de alertas visual** por colores
- 📊 **Dashboard personalizado** por empleado
- ⚡ **Información crítica** de un vistazo
- 🎨 **Coherencia visual** con design system

### 📁 **5. Página Principal (Orquestador)**

**📍 Ubicación:** `/Users/mario/Documents/git/uholidays2/src/app/(admin)/(others-pages)/vacaciones/page-content.tsx`

**Propósito:** **Orquestador principal** que conecta todos los componentes

#### **🏠 Sistema de Navegación por Pestañas**
```typescript
type TabType = 'mis-vacaciones' | 'solicitudes' | 'historial' | 'personal' | 'calendario';

const [tabActiva, setTabActiva] = useState<TabType>('mis-vacaciones');

// Renderizado condicional basado en pestaña activa
{tabActiva === 'mis-vacaciones' && (
  <>
    <TarjetasEstadisticasPersonales empleado={empleadoActual} />
    {empleadoActual.diasVacacionesDisponibles > 0 ? (
      <button onClick={() => setModalAbierto(true)}>
        Nueva solicitud
      </button>
    ) : (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        ⚠️ No tienes días disponibles
      </div>
    )}
  </>
)}
```

#### **🎭 Renderizado Condicional por Permisos**
```typescript
// Solo muestra pestaña "Solicitudes" si tiene permisos de aprobación
const tabsVisibles = [
  { id: 'mis-vacaciones', label: 'Mis vacaciones', icon: '📊' },
  
  // Condicional: Solo supervisores ven esta pestaña
  ...(permisos.aprobarRechazarEquipo ? [{
    id: 'solicitudes', 
    label: 'Solicitudes', 
    icon: '📋'
  }] : []),
  
  { id: 'historial', label: 'Historial', icon: '📅' },
];
```

**¿Para qué sirve?**
- 🎭 **Orquesta la experiencia** completa del usuario
- 🔐 **Aplica permisos** a nivel de UI
- 📱 **Navegación intuitiva** por funcionalidades
- 🔄 **Estado sincronizado** entre pestañas

---

---

## 🗂️ Mapa Completo de Archivos del Módulo

### **📂 Estructura del Proyecto**
```
/Users/mario/Documents/git/uholidays2/
│
├── 📄 REQUIREMENTS.md                     # Documento de requerimientos
├── 📄 CODIGO_EXPLICACION.md              # Esta explicación técnica
├── 📄 VACACIONES_README.md               # Documentación del módulo
│
├── 📁 src/
│   ├── 📁 types/
│   │   └── 📄 vacaciones.ts              # 🎯 Interfaces y tipos TypeScript
│   │
│   ├── 📁 hooks/
│   │   └── 📄 useVacaciones.ts           # 🧠 Lógica de negocio principal
│   │
│   ├── 📁 context/
│   │   └── 📄 UsuarioContext.tsx         # 🌐 Estado global de usuario
│   │
│   ├── 📁 components/
│   │   └── 📁 vacaciones/
│   │       ├── 📄 index.ts               # Barrel exports
│   │       ├── 📄 FormularioSolicitudVacaciones.tsx     # 📋 Formulario principal
│   │       ├── 📄 CalendarioSelectorDias.tsx            # 📅 Calendario interactivo
│   │       ├── 📄 TarjetasEstadisticasPersonales.tsx    # 📊 Dashboard personal
│   │       ├── 📄 ListaSolicitudesVacaciones.tsx        # 📝 Tabla de solicitudes
│   │       ├── 📄 EstadisticasVacaciones.tsx            # 📈 Métricas generales
│   │       ├── 📄 AlertaVacaciones.tsx                  # ⚠️ Sistema de alertas
│   │       ├── 📄 ModalNuevaSolicitud.tsx               # 🔲 Modal formulario
│   │       ├── 📄 ModalCancelarSolicitud.tsx            # ❌ Modal cancelación
│   │       ├── 📄 SelectorUsuario.tsx                   # 👤 Cambio de usuario
│   │       ├── 📄 ListaSolicitudesPendientes.tsx        # ⏳ Solicitudes por aprobar
│   │       ├── 📄 HistorialVacaciones.tsx               # 📜 Historial completo
│   │       ├── 📄 TablaSolicitudesPersonales.tsx        # 📋 Tabla personal
│   │       ├── 📄 VistaPersonal.tsx                     # 👁️ Vista empleado
│   │       └── 📄 InstruccionesPrueba.tsx              # ❓ Guía de uso
│   │
│   └── 📁 app/
│       └── 📁 (admin)/
│           └── 📁 (others-pages)/
│               └── 📁 vacaciones/
│                   ├── 📄 layout.tsx     # Layout con metadata
│                   ├── 📄 page.tsx       # Página principal con Provider
│                   └── 📄 page-content.tsx # 🎭 Orquestador principal
│
└── 📁 public/                            # Archivos estáticos
    └── 📁 images/                        # Imágenes del proyecto
```

### **🎯 Archivos por Función**

#### **🏗️ Arquitectura Base**
| Archivo | Ubicación | Propósito |
|---------|-----------|-----------|
| `vacaciones.ts` | `/src/types/` | 📋 Definiciones TypeScript |
| `useVacaciones.ts` | `/src/hooks/` | 🧠 Lógica de negocio |
| `UsuarioContext.tsx` | `/src/context/` | 🌐 Estado global |

#### **📱 Interfaz de Usuario**
| Archivo | Ubicación | Propósito |
|---------|-----------|-----------|
| `page-content.tsx` | `/src/app/(admin)/(others-pages)/vacaciones/` | 🎭 Controlador principal |
| `FormularioSolicitudVacaciones.tsx` | `/src/components/vacaciones/` | 📋 Crear solicitudes |
| `CalendarioSelectorDias.tsx` | `/src/components/vacaciones/` | 📅 Seleccionar fechas |
| `TarjetasEstadisticasPersonales.tsx` | `/src/components/vacaciones/` | 📊 Dashboard personal |
| `ListaSolicitudesVacaciones.tsx` | `/src/components/vacaciones/` | 📝 Ver solicitudes |

#### **🔧 Componentes de Apoyo**
| Archivo | Ubicación | Propósito |
|---------|-----------|-----------|
| `AlertaVacaciones.tsx` | `/src/components/vacaciones/` | ⚠️ Mensajes usuario |
| `ModalNuevaSolicitud.tsx` | `/src/components/vacaciones/` | 🔲 Modal formulario |
| `SelectorUsuario.tsx` | `/src/components/vacaciones/` | 👤 Testing roles |
| `InstruccionesPrueba.tsx` | `/src/components/vacaciones/` | ❓ Ayuda usuario |

#### **📊 Visualización de Datos**
| Archivo | Ubicación | Propósito |
|---------|-----------|-----------|
| `EstadisticasVacaciones.tsx` | `/src/components/vacaciones/` | 📈 Métricas globales |
| `HistorialVacaciones.tsx` | `/src/components/vacaciones/` | 📜 Registro histórico |
| `ListaSolicitudesPendientes.tsx` | `/src/components/vacaciones/` | ⏳ Aprobaciones pendientes |
| `TablaSolicitudesPersonales.tsx` | `/src/components/vacaciones/` | 📋 Solicitudes propias |

#### **🎛️ Gestión y Control**
| Archivo | Ubicación | Propósito |
|---------|-----------|-----------|
| `ModalCancelarSolicitud.tsx` | `/src/components/vacaciones/` | ❌ Cancelar solicitudes |
| `VistaPersonal.tsx` | `/src/components/vacaciones/` | 👁️ Info empleado |
| `layout.tsx` | `/src/app/(admin)/(others-pages)/vacaciones/` | 🏗️ Layout página |
| `page.tsx` | `/src/app/(admin)/(others-pages)/vacaciones/` | 🌐 Provider wrapper |

---

## 🔍 Ubicaciones Específicas por Funcionalidad

### **🎯 Para Modificar Lógica de Negocio:**
📂 **Archivo:** `/Users/mario/Documents/git/uholidays2/src/hooks/useVacaciones.ts`
- Líneas 1-50: Datos de ejemplo
- Líneas 130-170: Control de visibilidad por roles
- Líneas 245-320: Validaciones de disponibilidad
- Líneas 350-400: Funciones de aprobación/rechazo

### **🎨 Para Modificar UI/Estilos:**
📂 **Directorio:** `/Users/mario/Documents/git/uholidays2/src/components/vacaciones/`
- `FormularioSolicitudVacaciones.tsx`: Formularios
- `TarjetasEstadisticasPersonales.tsx`: Cards estadísticas
- `CalendarioSelectorDias.tsx`: Calendario
- `AlertaVacaciones.tsx`: Mensajes y alertas

### **🔐 Para Modificar Permisos:**
📂 **Archivo:** `/Users/mario/Documents/git/uholidays2/src/context/UsuarioContext.tsx`
- Líneas 15-60: Definición de permisos por rol
- Líneas 80-120: Datos de usuarios de prueba
- Líneas 140-171: Provider y hooks

### **🛠️ Para Agregar Nuevos Tipos:**
📂 **Archivo:** `/Users/mario/Documents/git/uholidays2/src/types/vacaciones.ts`
- Líneas 1-15: Tipos de usuario y permisos
- Líneas 16-35: Interface Usuario
- Líneas 36-50: Interface Empleado
- Líneas 51-70: Interface SolicitudVacaciones

### **📊 Para Modificar Navegación:**
📂 **Archivo:** `/Users/mario/Documents/git/uholidays2/src/app/(admin)/(others-pages)/vacaciones/page-content.tsx`
- Líneas 20-50: Definición de pestañas
- Líneas 350-400: Renderizado condicional por pestañas
- Líneas 180-220: Control de permisos por UI

---

## 🔧 Archivos de Configuración

### **📋 Documentación:**
- `/Users/mario/Documents/git/uholidays2/REQUIREMENTS.md` - Requerimientos completos
- `/Users/mario/Documents/git/uholidays2/VACACIONES_README.md` - Guía de usuario
- `/Users/mario/Documents/git/uholidays2/CODIGO_EXPLICACION.md` - Esta explicación

### **⚙️ Configuración del Proyecto:**
- `/Users/mario/Documents/git/uholidays2/package.json` - Dependencias
- `/Users/mario/Documents/git/uholidays2/tsconfig.json` - TypeScript config
- `/Users/mario/Documents/git/uholidays2/next.config.ts` - Next.js config
- `/Users/mario/Documents/git/uholidays2/tailwind.config.js` - Tailwind config

---

## 🔧 Patrones de Diseño Implementados

### **1. Custom Hook Pattern** 🎣
```typescript
// ✅ Beneficios:
// - Lógica reutilizable
// - Separación de responsabilidades
// - Testing independiente
// - Estado encapsulado

const { 
  empleados,
  solicitudes,
  crearSolicitudVacaciones,
  loading,
  error 
} = useVacaciones(usuarioActual);
```

### **2. Context Provider Pattern** 🌐
```typescript
// ✅ Beneficios:
// - Estado global sin Redux
// - Evita prop drilling
// - Performance optimizada
// - API simple

<UsuarioProvider>
  <VacacionesPageContent />
</UsuarioProvider>
```

### **3. Compound Components Pattern** 🧩
```typescript
// ✅ Beneficios:
// - Componentes cohesivos
// - API declarativa
// - Flexibilidad de composición
// - Reutilización

<TarjetasEstadisticasPersonales empleado={empleado} />
<CalendarioSelectorDias 
  selectedDates={fechas}
  onDateSelect={setFechas} 
/>
```

### **4. Render Props Pattern** 🎭
```typescript
// ✅ Beneficios:
// - Lógica compartida
// - UI flexible
// - Inversión de control
// - Testabilidad

{empleadoActual.diasVacacionesDisponibles > 0 ? (
  <ButtonNuevaSolicitud />
) : (
  <AlertasinDias />
)}
```

---

## 🧮 Cálculos y Lógica de Negocio

### **📊 Cálculo de Días Hábiles**
```typescript
const calcularDiasHabiles = (fechaInicio: Date, fechaFin: Date): number => {
  let dias = 0;
  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);
  
  for (let fecha = new Date(inicio); fecha <= fin; fecha.setDate(fecha.getDate() + 1)) {
    const diaSemana = fecha.getDay();
    if (diaSemana !== 0 && diaSemana !== 6) { // Excluye fines de semana
      dias++;
    }
  }
  
  return dias;
};
```

### **⚖️ Validación de Disponibilidad**
```typescript
// Regla de negocio crítica
if (empleado.diasVacacionesDisponibles <= 0) {
  throw new Error(`No tienes días disponibles. Has usado ${empleado.diasVacacionesUsados} de ${empleado.diasVacacionesAnuales}`);
}

// Validación de exceso
if (diasSolicitados > empleado.diasVacacionesDisponibles) {
  throw new Error(`Solo tienes ${empleado.diasVacacionesDisponibles} días disponibles.`);
}
```

### **🎯 Filtrado por Jerarquía**
```typescript
// Algoritmo de visibilidad basado en roles
const obtenerSolicitudesVisibles = (usuario: Usuario): SolicitudVacaciones[] => {
  switch (usuario.tipo) {
    case 'colaborador':
      return solicitudes.filter(sol => sol.empleadoId === usuario.id);
    
    case 'encargado_area':
      const equipoDirecto = usuario.equipoIds || [];
      return solicitudes.filter(sol => 
        sol.empleadoId === usuario.id || equipoDirecto.includes(sol.empleadoId)
      );
    
    case 'recursos_humanos':
      return solicitudes; // Ve todo
  }
};
```

---

## 🎨 Sistema de Design System

### **🚦 Código de Colores por Estado**
```typescript
// Disponibilidad de vacaciones
const colorScheme = {
  disponible: 'green',    // > 5 días
  advertencia: 'orange',  // 1-5 días  
  critico: 'red',        // 0 días
  informativo: 'blue',   // Neutral
};

// Estados de solicitudes
const statusColors = {
  pendiente: 'yellow',   // Esperando aprobación
  aprobado: 'green',     // Confirmada
  rechazado: 'red',      // Denegada
  cancelado: 'gray',     // Anulada
};
```

### **📱 Responsive Design**
```typescript
// Tailwind CSS classes adaptables
const responsiveClasses = {
  mobile: 'grid grid-cols-1 gap-4',      // Una columna
  tablet: 'md:grid-cols-2 md:gap-6',    // Dos columnas
  desktop: 'lg:grid-cols-3 lg:gap-8',   // Tres columnas
};
```

---

## ⚡ Optimizaciones de Performance

### **🔄 Memoización con `useCallback`**
```typescript
// Evita re-renderizados innecesarios
const obtenerEmpleadosVisibles = useCallback((usuario?: Usuario): Empleado[] => {
  // ... lógica compleja
}, [empleados]); // Solo se recalcula si cambian los empleados
```

### **📊 Cálculos Lazy**
```typescript
// Solo calcula cuando es necesario
const empleadoActual = useMemo(() => 
  empleados.find(emp => emp.id === usuarioActual?.id)
, [empleados, usuarioActual?.id]);
```

### **🎯 Renderizado Condicional**
```typescript
// Evita renderizar componentes innecesarios
{tabActiva === 'mis-vacaciones' && <ComponentePesado />}
{permisos.aprobarRechazarEquipo && <TablaAprobaciones />}
```

---

## 🧪 Estrategia de Testing

### **🎯 Testing por Capas**
```typescript
// 1. Unidad: Hook de lógica de negocio
describe('useVacaciones', () => {
  test('valida disponibilidad correctamente', () => {
    const empleado = { diasVacacionesDisponibles: 0 };
    expect(() => crearSolicitud(empleado, 5)).toThrow();
  });
});

// 2. Integración: Componentes con contexto
describe('VacacionesPage', () => {
  test('muestra alerta cuando no hay días', () => {
    render(<VacacionesPage />, { wrapper: UsuarioProvider });
    expect(screen.getByText(/no tienes días/i)).toBeInTheDocument();
  });
});

// 3. E2E: Flujos completos
describe('Flujo de solicitud', () => {
  test('usuario puede crear solicitud exitosa', () => {
    cy.login('colaborador');
    cy.visit('/vacaciones');
    cy.get('[data-testid=nueva-solicitud]').click();
    cy.fillForm({ fechas: ['2026-03-01'], motivo: 'Descanso' });
    cy.submit();
    cy.should('contain', 'Solicitud creada');
  });
});
```

---

## 🔮 Evolución del Código

### **📈 Escalabilidad Implementada**

#### **1. Arquitectura Modular**
```
components/
  vacaciones/
    ├── index.ts          # Barrel exports
    ├── forms/            # Formularios
    ├── displays/         # Visualización  
    ├── modals/           # Modales
    └── shared/           # Componentes compartidos
```

#### **2. Tipos Extensibles**
```typescript
// Fácil agregar nuevos tipos sin breaking changes
type TipoUsuario = 'colaborador' | 'encargado_area' | 'jefe_encargado' | 'recursos_humanos' | 'admin_global';

interface Permisos {
  // Permisos existentes...
  
  // Nuevos permisos se agregan aquí
  nuevaFuncionalidad?: boolean;
}
```

#### **3. Hooks Composables**
```typescript
// Hooks especializados que se pueden combinar
const useVacacionesBasic = () => { /* lógica básica */ };
const useVacacionesAdvanced = () => { /* + validaciones */ };  
const useVacacionesReports = () => { /* + reportes */ };

// En componentes:
const component = () => {
  const basic = useVacacionesBasic();
  const advanced = useVacacionesAdvanced();
  // Composición según necesidades
};
```

---

## 💡 Decisiones de Diseño Clave

### **🎯 ¿Por qué Custom Hook en lugar de Redux?**
- ✅ **Menos boilerplate:** No actions, reducers, stores
- ✅ **TypeScript nativo:** Tipos automáticos
- ✅ **Más simple:** Lógica encapsulada en un lugar
- ✅ **Performance:** Solo re-renderiza lo necesario

### **🎭 ¿Por qué Context en lugar de Props?**
- ✅ **Evita prop drilling:** Usuario disponible en cualquier nivel
- ✅ **Cambio dinámico:** Testing de roles sin refresh
- ✅ **Permisos reactivos:** UI se actualiza automáticamente
- ✅ **API limpia:** `useUsuario()` en cualquier componente

### **📅 ¿Por qué calendario custom en lugar de librería?**
- ✅ **Control total:** Días festivos mexicanos
- ✅ **UX específica:** Selección múltiple de días individuales  
- ✅ **Peso mínimo:** Solo funcionalidades necesarias
- ✅ **Estilo coherente:** Integración perfecta con Tailwind

### **🔧 ¿Por qué TypeScript estricto?**
- ✅ **Menos bugs:** Errores en desarrollo, no producción
- ✅ **Refactoring seguro:** IDE puede refactorizar automáticamente
- ✅ **Documentación viva:** Interfaces documentan el código
- ✅ **IntelliSense:** Autocompletado perfecto

---

## 🎓 Conclusiones y Aprendizajes

### **✅ Lo que funciona bien:**

1. **Separación de responsabilidades clara**
   - Hook = Lógica de negocio
   - Context = Estado global  
   - Components = UI pura
   - Types = Contratos de datos

2. **Sistema de permisos granular**
   - Fácil agregar nuevos roles
   - Permisos específicos por funcionalidad
   - UI reactiva a cambios de permisos

3. **Validaciones robustas**
   - Frontend + Backend validation
   - Mensajes de error descriptivos
   - Prevención proactiva de errores

4. **UX intuitiva**
   - Colores consistentes por estado
   - Feedback visual inmediato
   - Navegación clara por pestañas

### **🔮 Oportunidades de mejora:**

1. **Performance avanzada**
   - `React.memo` para componentes pesados
   - Virtualization para listas largas
   - Code splitting por rutas

2. **Testing más completo**
   - Unit tests para todos los hooks
   - Integration tests para flujos críticos
   - E2E tests automatizados

3. **Funcionalidades enterprise**
   - Notificaciones en tiempo real
   - Exportación de reportes
   - Integración con APIs externas
   - Audit logs completos

---

**🚀 El módulo de vacaciones demuestra cómo construir una aplicación React moderna, escalable y mantenible utilizando las mejores prácticas de la industria.**

---

## 📍 Índice de Ubicaciones Rápidas

### **🔍 Buscar por Funcionalidad:**

| **Quiero modificar...** | **Archivo a editar** | **Ubicación completa** |
|-------------------------|---------------------|------------------------|
| 🧠 **Lógica de negocio** | `useVacaciones.ts` | `/Users/mario/Documents/git/uholidays2/src/hooks/useVacaciones.ts` |
| 🎭 **Roles y permisos** | `UsuarioContext.tsx` | `/Users/mario/Documents/git/uholidays2/src/context/UsuarioContext.tsx` |
| 📋 **Formularios** | `FormularioSolicitudVacaciones.tsx` | `/Users/mario/Documents/git/uholidays2/src/components/vacaciones/FormularioSolicitudVacaciones.tsx` |
| 📅 **Calendario** | `CalendarioSelectorDias.tsx` | `/Users/mario/Documents/git/uholidays2/src/components/vacaciones/CalendarioSelectorDias.tsx` |
| 📊 **Dashboard** | `TarjetasEstadisticasPersonales.tsx` | `/Users/mario/Documents/git/uholidays2/src/components/vacaciones/TarjetasEstadisticasPersonales.tsx` |
| 🎛️ **Navegación** | `page-content.tsx` | `/Users/mario/Documents/git/uholidays2/src/app/(admin)/(others-pages)/vacaciones/page-content.tsx` |
| 🎯 **Tipos de datos** | `vacaciones.ts` | `/Users/mario/Documents/git/uholidays2/src/types/vacaciones.ts` |
| ⚠️ **Alertas** | `AlertaVacaciones.tsx` | `/Users/mario/Documents/git/uholidays2/src/components/vacaciones/AlertaVacaciones.tsx` |

### **📂 Estructura Rápida:**
```bash
# Archivos principales del módulo
/src/hooks/useVacaciones.ts              # 🧠 Lógica central
/src/context/UsuarioContext.tsx          # 🌐 Estado global  
/src/types/vacaciones.ts                 # 🎯 Definiciones
/src/components/vacaciones/              # 📁 Todos los componentes UI
/src/app/(admin)/(others-pages)/vacaciones/  # 📁 Páginas y layouts
```

### **⚡ Comandos de Terminal para Navegación Rápida:**
```bash
# Ir al directorio principal
cd /Users/mario/Documents/git/uholidays2

# Editar archivo específico
code src/hooks/useVacaciones.ts                    # Lógica principal
code src/context/UsuarioContext.tsx                # Permisos  
code src/components/vacaciones/                     # Componentes
code src/app/\(admin\)/\(others-pages\)/vacaciones/ # Páginas
```

### **🔧 Para Desarrollo:**
| **Tarea** | **Archivos a revisar** |
|-----------|----------------------|
| **Agregar nuevo rol** | `vacaciones.ts` → `UsuarioContext.tsx` → `useVacaciones.ts` |
| **Nueva validación** | `useVacaciones.ts` → `FormularioSolicitudVacaciones.tsx` |
| **Nuevo componente** | `/src/components/vacaciones/` → `index.ts` (barrel export) |
| **Nueva pestaña** | `page-content.tsx` → agregar componente correspondiente |

---

*Documentación creada el 6 de febrero de 2026 - Actualizada con ubicaciones exactas de archivos*
