# MembriX Desktop Frontend

Panel de administración institucional para MembriX.

## Instalación

```bash
npm install
```

## Configuración

Copia el archivo `.env.example` a `.env.local` y configura las variables:

```bash
cp .env.example .env.local
```

Edita `.env.local` con la URL de tu API backend:

```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Características

- **Login con Detección de Roles**: Redirige automáticamente según el rol del usuario (institution/admin → dashboard)
- **Solicitud de Alta**: Formulario para que instituciones soliciten registrarse
- **Dashboard Institucional**: Panel de administración con sidebar y navegación
- **Gestión de Miembros**: Vista para administrar miembros y staff (en desarrollo)
- **Gestión de Planes**: Administración de planes de membresía (en desarrollo)
- **Gestión de Eventos**: Organización de eventos (en desarrollo)

## Rutas

- `/` - Redirige a /login
- `/login` - Inicio de sesión
- `/solicitar-alta` - Formulario de solicitud de alta institucional
- `/dashboard` - Panel principal (requiere autenticación)
- `/dashboard/miembros` - Gestión de miembros
- `/dashboard/planes` - Gestión de planes
- `/dashboard/eventos` - Gestión de eventos

## Tecnologías

- Next.js 16.2.1
- React 19
- TypeScript
- Tailwind CSS v4
- React Hook Form + Zod
- Framer Motion
- Lucide React

## Arquitectura

El proyecto sigue la arquitectura de App Router de Next.js con:

- `app/` - Rutas y páginas
- `components/` - Componentes reutilizables
- `contexts/` - Context providers (AuthContext)
- `hooks/` - Custom hooks
- `lib/` - Utilidades

## Integración con Backend

El frontend se conecta al backend de MembriX a través de:

- `POST /auth/login` - Autenticación
- `POST /api/institutions/request-creation` - Solicitud de alta institucional

Asegúrate de que el backend esté corriendo y la variable `NEXT_PUBLIC_API_URL` esté configurada correctamente.

## ✅ Implementación Completada

### Ticket FRONT-07 - Dashboard Institucional

Se han implementado exitosamente las siguientes funcionalidades:

#### ✓ Pantalla de Solicitud de Alta (/solicitar-alta)
- Formulario "Concierge" con validación React Hook Form + Zod
- Campos: Nombre, Tipo, Teléfono, Miembros estimados, Dirección (opcional)
- Integración con endpoint `POST /api/institutions/request-creation`
- Mensaje de éxito tras envío exitoso
- Diseño consistente con el frontend PWA

#### ✓ Login con Redirección Inteligente (/login)
- Detección automática del rol del usuario tras login
- Usuarios con rol `institution` o `admin` → `/dashboard`
- Usuarios regulares → comportamiento estándar
- Sistema de bloqueo temporal tras 3 intentos fallidos

#### ✓ Dashboard Institucional (/dashboard)
- Layout base con sidebar responsive (desktop y mobile)
- Navegación a secciones: Miembros/Staff, Planes, Eventos
- Header con información del usuario y logout
- Página principal con estadísticas placeholder
- Acciones rápidas para gestión
- Cards informativas con animaciones Framer Motion

#### ✓ Secciones del Dashboard
- `/dashboard/miembros` - Gestión de miembros y staff (placeholder)
- `/dashboard/planes` - Administración de planes (placeholder)
- `/dashboard/eventos` - Gestión de eventos (placeholder)

### Estructura del Proyecto

```
desktop-frontend/
├── app/
│   ├── dashboard/
│   │   ├── eventos/
│   │   │   └── page.tsx
│   │   ├── miembros/
│   │   │   └── page.tsx
│   │   ├── planes/
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── solicitar-alta/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── auth/
│   │   ├── InstitutionRequestForm.tsx
│   │   └── LoginForm.tsx
│   ├── dashboard/
│   │   └── DashboardLayout.tsx
│   └── ui/
│       └── WaveBackground.tsx
├── contexts/
│   └── AuthContext.tsx
├── lib/
│   └── utils.ts
├── .env.local
├── .env.example
└── README.md
```

### Notas de Implementación

- **Arquitectura**: Replica la estructura del frontend PWA (Next.js App Router + TypeScript)
- **Estilos**: Tailwind CSS v4 con paleta de colores consistente (verde pantano y beige crema)
- **Validación**: React Hook Form + Zod para todos los formularios
- **Estado**: Context API para autenticación con persistencia en cookies y localStorage
- **Animaciones**: Framer Motion para transiciones suaves
- **Responsive**: Mobile-first con sidebar adaptable

### Testing Realizado

- ✓ Build exitoso sin errores de TypeScript
- ✓ Servidor de desarrollo funcional en puerto 3001
- ✓ Rutas renderizando correctamente
- ✓ Formularios con validación client-side operativos
- ✓ Layout responsive funcionando en mobile y desktop

### Próximos Pasos

1. Implementar la lógica real de gestión de miembros
2. Desarrollar el módulo de planes de membresía
3. Crear la funcionalidad de eventos
4. Conectar con WebSocket para actualizaciones en tiempo real
5. Añadir tests unitarios e integración

---

**Estado**: ✅ Implementación completa y funcional
**Fecha**: Abril 2026
**Desarrollado por**: Copilot CLI
