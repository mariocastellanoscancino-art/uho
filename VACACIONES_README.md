# 🏖️ Sistema de Gestión de Vacaciones

Un sistema completo de gestión de solicitudes de vacaciones desarrollado con Next.js 14+, TypeScript y Tailwind CSS.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?logo=typescript)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## � Tabla de Contenidos

- [Características](#-características)
- [Demo y Capturas](#-demo-y-capturas)
- [Instalación](#-instalación)
- [Arquitectura](#-arquitectura)
- [Funcionalidades](#-funcionalidades)
- [Usuarios de Prueba](#-usuarios-de-prueba)
- [Tecnologías](#-tecnologías)
- [Estructura del Proyecto](#-estructura-del-proyecto)

## ✨ Características

### 🎯 Funcionalidades Clave
- ✅ **Sistema de roles granular** (Colaborador, Encargado, Jefe, RRHH)
- ✅ **Validación inteligente de días disponibles** con alertas visuales
- ✅ **Calendario interactivo** para selección de fechas
- ✅ **Dashboard con estadísticas en tiempo real**
- ✅ **Flujo de aprobación multinivel**
- ✅ **Historial completo de solicitudes**
- ✅ **Interfaz completamente responsive**
- ✅ **Modo oscuro/claro**

### 🚀 Características Técnicas
- **Framework**: Next.js 14+ con App Router y Turbopack
- **Lenguaje**: TypeScript para type-safety completa
- **Estilos**: Tailwind CSS con sistema de diseño consistente
- **Estado**: Context API + Custom Hooks pattern
- **Validaciones**: Dual (frontend + backend)
- **UI/UX**: Mobile-first, accesible (ARIA), animaciones suaves

## 🖥️ Demo y Capturas

### Dashboard Principal
*Vista con estadísticas personales y sistema de alertas por colores*

### Validación de Días Disponibles
*Sistema inteligente que previene solicitudes cuando no hay días suficientes*

### Selector de Fechas Interactivo
*Calendario con validación automática de días hábiles y festivos*

## 📦 Instalación

### Prerequisitos
- Node.js 18+ 
- npm/yarn/pnpm
- Git

### Quick Start
```bash
# Clonar repositorio
git clone https://github.com/mariocastellanoscancino-art/uho.git
cd uholidays2

# Instalar dependencias
npm install

# Desarrollo con Turbopack
npm run dev

# Abrir navegador en http://localhost:3000/vacaciones
```

## 🏗️ Arquitectura

### Patrones de Diseño
- **Component-Based Architecture**: Componentes modulares y reutilizables
- **Custom Hooks Pattern**: Lógica de negocio encapsulada
- **Context + Reducer**: Gestión de estado predecible
- **Barrel Exports**: Imports organizados y limpios

### Estructura de Componentes
```
src/
├── app/(admin)/(others-pages)/vacaciones/
│   ├── page.tsx                    # Página principal
│   └── page-content.tsx            # Contenido con navegación por tabs
├── components/vacaciones/
│   ├── AlertaVacaciones.tsx        # Componente de alertas
│   ├── CalendarioSelectorDias.tsx  # Calendario interactivo
│   ├── EstadisticasVacaciones.tsx  # Dashboard de métricas
│   ├── FormularioSolicitudVacaciones.tsx
│   ├── HistorialVacaciones.tsx
│   ├── TarjetasEstadisticasPersonales.tsx # Tarjetas con validación visual
│   └── VistaPersonal.tsx           # Vista principal del empleado
├── hooks/
│   └── useVacaciones.ts            # Hook principal con validaciones
├── context/
│   └── UsuarioContext.tsx          # Contexto de usuarios y roles
└── types/
    └── vacaciones.ts               # Definiciones TypeScript
```

## 🎮 Funcionalidades

### 1. 📊 Dashboard Inteligente
```typescript
// Validación visual automática
const getDiasDisponiblesInfo = (empleado: Empleado) => {
  const dias = empleado.diasVacacionesDisponibles;
  
  if (dias <= 0) return { color: 'red', mensaje: 'Sin días disponibles' };
  if (dias <= 5) return { color: 'orange', mensaje: 'Pocos días restantes' };
  return { color: 'green', mensaje: 'Días suficientes' };
};
```

### 2. ✅ Validación Multinivel
- **Frontend**: Validación inmediata en UI
- **Backend**: Validación en `useVacaciones` hook
- **Visual**: Sistema de colores y alertas
- **UX**: Mensajes descriptivos y acciones sugeridas

### 3. 🎭 Sistema de Roles

| Rol | Permisos | Casos de Uso |
|-----|----------|--------------|
| **👤 Colaborador** | Ver/Crear propias | Solicitudes personales |
| **👨‍💼 Encargado de Área** | + Aprobar equipo | Gestión de área |
| **🏢 Jefe de Encargado** | + Acceso ampliado | Supervisión general |
| **👑 Recursos Humanos** | Acceso completo | Administración total |

### 4. 📅 Gestión Avanzada de Fechas
- **Selección múltiple** no consecutiva
- **Validación automática** de días hábiles
- **Cálculo inteligente** de períodos
- **Prevención** de solapamientos

## 👥 Usuarios de Prueba

| Usuario | Rol | Días Disponibles | Caso de Uso |
|---------|-----|------------------|-------------|
| **Arturo Jimenez** | Colaborador | 20 días | ✅ Flujo normal completo |
| **Patricio Bustos** | Encargado | **0 días** | ❌ Validación sin días |
| **Gabriel Rojo** | Jefe | 13 días | 🔄 Aprobaciones multinivel |
| **Jesús Navarro** | RRHH | 15 días | 👑 Acceso administrativo |
| **María González** | Encargado | 18 días | 👥 Gestión de equipo |

## 🛠️ Tecnologías

### Stack Principal
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Next.js** | 16.1.6 | Framework React full-stack |
| **TypeScript** | 5.0+ | Type safety y mejor DX |
| **Tailwind CSS** | 3.0+ | Utility-first styling |
| **React** | 18+ | UI Library con hooks |

### Herramientas de Desarrollo
- **Turbopack**: Compilador ultra-rápido
- **ESLint + Prettier**: Calidad de código
- **PostCSS**: Procesamiento CSS avanzado


### Patrones y Arquitectura
- **Component Composition**: Componentes reutilizables
- **Separation of Concerns**: UI, lógica y datos separados
- **Error Boundaries**: Manejo robusto de errores
- **Performance**: Lazy loading y memoización

## 🔧 Configuración Avanzada

### Variables de Entorno (Opcional)
```env
# .env.local
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_DEBUG_MODE=true
```

### Personalización de Validaciones
```typescript
// src/hooks/useVacaciones.ts - Configuración
const CONFIG_VACACIONES = {
  diasMinimos: 1,
  diasMaximos: 15,
  anticipacionMinima: 7, // días
  validarFinDeSemana: true,
  validarFestivos: true
};
```

### Customización de Roles
```typescript
// src/types/vacaciones.ts
export type TipoUsuario = 
  | 'colaborador' 
  | 'encargado_area' 
  | 'jefe_encargado' 
  | 'recursos_humanos'
  | 'custom_role'; // Agregar nuevos roles
```

## 🧪 Testing y Calidad

### Casos de Prueba Implementados
- ✅ **Validación días disponibles**: Casos con 0, pocos y suficientes días
- ✅ **Flujo de aprobación**: Desde solicitud hasta aprobación final
- ✅ **Cambio de roles**: Comportamiento según permisos
- ✅ **Responsividad**: Móvil, tablet y desktop
- ✅ **Accesibilidad**: Navegación por teclado y screen readers

### Ejecutar Validaciones
```bash
# Build de producción (valida TypeScript)
npm run build

# Linting (calidad de código)
npm run lint

# Formateo automático
npm run format
```

## 📈 Métricas y Performance

### Optimizaciones Incluidas
- **Bundle Size**: Optimizado con tree shaking
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Componentes lazy-loaded
- **CSS**: Purging automático de Tailwind

### Core Web Vitals
- **FCP**: < 1.5s (First Contentful Paint)
- **LCP**: < 2.5s (Largest Contentful Paint)
- **CLS**: < 0.1 (Cumulative Layout Shift)
- **FID**: < 100ms (First Input Delay)

## 🚀 Deployment

### Build de Producción
```bash
# Generar build optimizado
npm run build

# Preview local del build
npm start

# Analizar bundle (opcional)
npm run analyze
```

### Configuración para Hosting

#### Vercel (Recomendado)
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs"
}
```

#### Docker (Alternativa)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔄 Versionado y Changelog

### Versión Actual: 1.0.0 (2026-02-06)

#### ✅ Características Implementadas
- Sistema completo de gestión de vacaciones
- Validación inteligente con alertas visuales  
- Componente de calendario interactivo
- Sistema de roles y permisos granular
- Dashboard con estadísticas en tiempo real
- Interfaz responsive y accesible

#### 🐛 Correcciones
- Validación correcta de días hábiles
- Cálculo automático de períodos vacacionales
- Responsividad en dispositivos móviles
- Navegación por teclado en formularios

### Próximas Versiones (Roadmap)

#### v1.1 - Integración Backend
- [ ] API REST endpoints
- [ ] Base de datos PostgreSQL/MongoDB
- [ ] Autenticación JWT
- [ ] Middleware de autorización

#### v1.2 - Características Avanzadas
- [ ] Notificaciones push/email
- [ ] Exportación de reportes (PDF/Excel)
- [ ] Calendario visual anual
- [ ] Políticas de vacaciones configurables

#### v1.3 - Mobile App
- [ ] React Native app
- [ ] Sincronización offline
- [ ] Notificaciones móviles
- [ ] Biometría/Face ID

## 🤝 Contribuir

### Convenciones de Desarrollo
- **Commits**: Conventional Commits format
  ```
  feat: nueva funcionalidad
  fix: corrección de bug
  docs: cambios en documentación
  style: formateo, sin cambios de lógica
  refactor: refactorización de código
  test: añadir o corregir tests
  ```

### Workflow de Contribución
1. **Fork** el repositorio
2. **Crear rama** feature (`git checkout -b feature/amazing-feature`)
3. **Commit** cambios (`git commit -m 'feat: add amazing feature'`)
4. **Push** a rama (`git push origin feature/amazing-feature`)
5. **Crear** Pull Request con descripción detallada

### Estándares de Código
- **TypeScript**: Tipado estricto, sin `any`
- **ESLint**: Configuración extendida de Next.js
- **Prettier**: Formateo consistente
- **Componentes**: Props tipadas, JSDoc comments
- **Testing**: Unit tests para lógica crítica

## 🛡️ Seguridad y Privacidad

### Medidas de Seguridad Implementadas
- **Validación Dual**: Frontend + Backend validation
- **Type Safety**: TypeScript elimina errores comunes  
- **Input Sanitization**: Prevención de XSS
- **Role-Based Access**: Permisos granulares
- **Error Handling**: No exposición de datos sensibles

### Consideraciones para Producción
- [ ] HTTPS obligatorio
- [ ] Rate limiting en APIs
- [ ] Logs de auditoría
- [ ] Backup automático
- [ ] Encriptación de datos sensibles
- [ ] GDPR compliance

## 📊 Estructura de Datos

### Interfaces TypeScript

```typescript
// Empleado principal
interface Empleado {
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
  departamento: string;
  puesto: string;
  tipoUsuario: TipoUsuario;
  fechaIngreso: Date;
  salario?: number;
  diasVacacionesAnuales: number;
  diasVacacionesUsados: number;
  diasVacacionesDisponibles: number;
  antiguedadAnios: number;
  activo: boolean;
}

// Solicitud de vacaciones
interface SolicitudVacaciones {
  id: string;
  empleadoId: string;
  empleado: Empleado;
  fechaInicio: Date;
  fechaFin: Date;
  diasSolicitados: number;
  diasHabilesSolicitados: number;
  motivo: string;
  estado: EstadoSolicitud;
  fechaSolicitud: Date;
  comentariosEmpleado?: string;
  comentariosAprobador?: string;
  aprobadoPor?: string;
  fechaAprobacion?: Date;
  fechaRechazo?: Date;
  motivoRechazo?: string;
}

// Estados y tipos
type EstadoSolicitud = 'pendiente' | 'aprobada' | 'rechazada' | 'cancelada';
type TipoUsuario = 'colaborador' | 'encargado_area' | 'jefe_encargado' | 'recursos_humanos';
```

## 📚 Documentación Adicional

### Guías Específicas
- [� Guía de Componentes](./docs/COMPONENTS.md)
- [🔧 Configuración Avanzada](./docs/CONFIG.md)  
- [🧪 Guía de Testing](./docs/TESTING.md)
- [🚀 Deploy Guide](./docs/DEPLOYMENT.md)

### API Reference (Futuro)
- [📡 Endpoints REST](./docs/API.md)
- [🔐 Autenticación](./docs/AUTH.md)
- [📊 Webhooks](./docs/WEBHOOKS.md)

## �🎯 Casos de Uso Detallados

### 1. Flujo Colaborador → Solicitud Nueva
```mermaid
graph TD
    A[Empleado accede] → B[Ve días disponibles]
    B → C{¿Tiene días?}
    C →|Sí| D[Abre formulario]
    C →|No| E[Ve alerta roja]
    D → F[Selecciona fechas]
    F → G[Valida disponibilidad]
    G → H[Confirma solicitud]
    H → I[Estado: Pendiente]
```

### 2. Flujo Aprobación Multinivel
```mermaid
graph TD
    A[Solicitud creada] → B[Notifica a Encargado]
    B → C{¿Encargado disponible?}
    C →|Sí| D[Encargado aprueba]
    C →|No| E[Escala a Jefe]
    D → F[Estado: Aprobada]
    E → G[Jefe revisa]
    G → H[Decisión final]
```

## 👥 Equipo y Créditos

### Desarrollo Principal
- **Mario Castellanos** - *Full Stack Developer*  
  - GitHub: [@mariocastellanoscancino-art](https://github.com/mariocastellanoscancino-art)
  - Especialidades: React/Next.js, TypeScript, UI/UX

### Agradecimientos
- **Diseño**: Inspirado en sistemas modernos de RRHH (BambooHR, Workday)
- **Icons**: [Heroicons](https://heroicons.com/) para iconografía consistente
- **Colors**: [Tailwind CSS](https://tailwindcss.com/) palette
- **Patterns**: React patterns de [Kent C. Dodds](https://kentcdodds.com/)

### Stack Inspiration
- **Architecture**: Inspired by [Vercel](https://vercel.com/) templates
- **TypeScript**: Best practices from [Total TypeScript](https://totaltypescript.com/)
- **Components**: Design system patterns from [Radix UI](https://www.radix-ui.com/)

## 📞 Soporte y Contacto

### Canales de Soporte
- 🐛 **Issues**: [GitHub Issues](https://github.com/mariocastellanoscancino-art/uho/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/mariocastellanoscancino-art/uho/discussions)  
- 📧 **Email**: mario.castellanos@empresa.com
- 💼 **LinkedIn**: [Mario Castellanos](https://linkedin.com/in/mario-castellanos)

### FAQ

**Q: ¿Funciona sin internet?**  
A: Actualmente no. En v1.3 se añadirá soporte PWA offline.

**Q: ¿Se puede integrar con Active Directory?**  
A: Sí, en v1.1 se añadirá soporte SSO/LDAP.

**Q: ¿Soporta múltiples idiomas?**  
A: Por ahora solo español. i18n en roadmap para v1.2.

**Q: ¿Hay límite de empleados?**  
A: No hay límite técnico. Performance optimizada para 1000+ empleados.

## 📄 Licencia

Este proyecto está bajo la **Licencia MIT** - ver [LICENSE.md](LICENSE.md) para detalles completos.

```
MIT License

Copyright (c) 2026 Mario Castellanos

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

<div align="center">

## 🌟 ¿Te gusta este proyecto?

[![GitHub Stars](https://img.shields.io/github/stars/mariocastellanoscancino-art/uho?style=social)](https://github.com/mariocastellanoscancino-art/uho/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/mariocastellanoscancino-art/uho?style=social)](https://github.com/mariocastellanoscancino-art/uho/network/members)
[![GitHub Issues](https://img.shields.io/github/issues/mariocastellanoscancino-art/uho)](https://github.com/mariocastellanoscancino-art/uho/issues)

**Dale una ⭐ si te pareció útil este proyecto!**

[🚀 Ver Demo Live](https://uholidays.vercel.app/vacaciones) • 
[📖 Documentación](https://github.com/mariocastellanoscancino-art/uho/wiki) • 
[🐛 Reportar Bug](https://github.com/mariocastellanoscancino-art/uho/issues/new?template=bug_report.md) • 
[✨ Solicitar Feature](https://github.com/mariocastellanoscancino-art/uho/issues/new?template=feature_request.md)

---

**Desarrollado con ❤️ en México 🇲🇽**  
*"Simplificando la gestión de recursos humanos, una línea de código a la vez"*

</div>