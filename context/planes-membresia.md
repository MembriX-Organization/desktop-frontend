# Gestión de Planes de Membresía — Panel Administrativo

## Resumen

Implementación completa de la sección `/dashboard/planes` en el panel de administración (`desktop-frontend`), junto con la corrección del endpoint de autenticación de administradores en el backend.

---

## Cambios realizados

### Backend (`backend/`)

#### `src/institucion-membrix/institution.service.ts`
- Se agregó el método `findMyAdminInstitutions(userId: bigint)`.
- Consulta la tabla `Staff` (no `Membership`) filtrando por `role === 'institution'`.
- Retorna las instituciones donde el usuario autenticado es administrador.

#### `src/institucion-membrix/institution.controller.ts`
- Se agregó la ruta `GET /api/institutions/my-admin`.
- Protegida con `JwtAuthGuard`.
- Necesaria porque el endpoint anterior (`/my`) buscaba membresías de socio, no roles administrativos.

---

### Frontend — Panel Administrativo (`desktop-frontend/`)

#### `app/dashboard/page.tsx`
- Cambiado el fetch de `/api/institutions/my` a `/api/institutions/my-admin` para verificar correctamente si el usuario logueado administra alguna institución.

#### `app/dashboard/planes/page.tsx`
- Reemplazado el placeholder "Sección en Desarrollo" por la implementación completa.
- Cambiado el fetch inicial a `/api/institutions/my-admin`.

**Funcionalidades implementadas en la página de planes:**

| Funcionalidad | Detalle |
|---|---|
| Listado de planes | Grid responsivo (1/2/3 columnas). Muestra activos e inactivos (`?includeInactive=true`). |
| Barra de estadísticas | Total de planes, cantidad activos e inactivos. |
| Crear plan | Botón "Nuevo Plan" abre un modal con formulario. |
| Editar plan | Botón "Editar" en cada tarjeta pre-carga el formulario. |
| Toggle isActive | Switch inline en cada tarjeta. Llama `PATCH` con `{ isActive: !plan.isActive }`. Usa update optimista. |
| Empty state | Pantalla con CTA cuando no hay planes creados. |
| Toasts | Notificaciones de éxito/error con auto-dismiss a los 4 segundos. |
| Spinners | En carga inicial, en botones de guardar y en el toggle mientras cambia. |

**Campos del formulario:**

| Campo | Tipo HTML | Validación |
|---|---|---|
| Nombre del plan (`membershipType`) | `text` | Requerido |
| Precio (`price`) | `number` | Requerido, ≥ 0 |
| Duración en meses (`durationInMonths`) | `number` | Requerido, ≥ 1 |
| Días de gracia (`paymentGraceDays`) | `number` | Opcional, ≥ 0 |
| Descripción (`description`) | `textarea` | Opcional |
| Beneficios (`benefits`) | `textarea` | Opcional |
| Estado (`isActive`) | Toggle | Solo visible al editar |

Validación con **React Hook Form + Zod v4** (`z.number({ error: '...' })` — API actualizada respecto a Zod v3).

**Endpoints consumidos:**

| Método | Ruta | Uso |
|---|---|---|
| `GET` | `/api/institutions/my-admin` | Obtener institutionId del admin |
| `GET` | `/api/institutions/:id/membership-data?includeInactive=true` | Listar todos los planes |
| `POST` | `/api/institutions/:id/membership-data` | Crear plan |
| `PATCH` | `/api/institutions/:id/membership-data/:planId` | Editar plan o cambiar isActive |

---

## Decisiones técnicas

- **Endpoint separado `/my-admin`**: se mantuvo `/my` intacto para no romper la PWA (`frontend/`), que lo usa para socios con membresía activa.
- **Update optimista en toggle**: la UI refleja el cambio de estado inmediatamente sin esperar la respuesta del servidor, mejorando la percepción de velocidad.
- **Todo en un archivo**: la página, el modal y las tarjetas están en `planes/page.tsx` sin archivos extra, ya que los componentes son específicos de esta vista y no se reutilizan en otro lugar.
- **Zod v4**: el proyecto usa `zod@^4.3.6`. La opción `invalid_type_error` fue reemplazada por `error` según la nueva API.

---

## Base de datos

Para el entorno de desarrollo se ejecutó manualmente:

```sql
-- Crear institución CALF
INSERT INTO institutions (name, created_at, updated_at)
VALUES ('CALF', NOW(), NOW());

-- Vincular usuario administrador (id=912, brianbarrionuevo0@gmail.com)
INSERT INTO staff (user_id, institution_id, role, created_at, updated_at)
VALUES (912, 435, 'institution', NOW(), NOW());
```

> Institución CALF creada con `id=435`. En producción, la creación de instituciones se gestiona a través del flujo de solicitud de alta existente.
