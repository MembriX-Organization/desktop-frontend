# Cambios en el Flujo de Autenticación - Desktop Frontend

## 📝 Resumen de Cambios

Se ha actualizado el flujo de autenticación del panel de control de instituciones para que siga el mismo patrón que el frontend principal, con la adición de un paso intermedio para el registro de instituciones.

---

## 🔄 Nuevo Flujo de Usuario

```
┌──────────────────────────────────────────────────────────────────────────┐
│                        FLUJO DE AUTENTICACIÓN                             │
└──────────────────────────────────────────────────────────────────────────┘

1️⃣  /login
    ↓
    ├─ Usuario existente → Inicia sesión
    └─ Usuario nuevo → Clic en "Regístrate"
    
2️⃣  /register (NUEVO)
    ↓
    ├─ Completa formulario (nombre, email, contraseña)
    ├─ Sistema envía código OTP por email
    └─ Usuario ingresa código de 6 dígitos
    
3️⃣  Auto-login después de verificación
    ↓
    Redirige a /dashboard
    
4️⃣  /dashboard - Verifica institución
    ↓
    ├─ SIN INSTITUCIÓN → Muestra InstitutionPromptCard
    │   └─ Botón: "Registrar mi Institución"
    │       └─ Redirige a /solicitar-alta
    │
    └─ CON INSTITUCIÓN → Dashboard completo
        └─ Estadísticas, acciones rápidas, etc.
    
5️⃣  /solicitar-alta (si viene desde el prompt)
    ↓
    ├─ Formulario de institución (nombre, tipo, teléfono, etc.)
    ├─ Envía solicitud al backend
    └─ Confirmación de envío exitoso
```

---

## 📂 Archivos Creados

### 1. `/app/register/page.tsx`
- **Propósito**: Página de registro de usuarios
- **Características**:
  - Layout idéntico al frontend principal
  - WaveBackground animado
  - Blobs decorativos

### 2. `/components/auth/RegisterForm.tsx`
- **Propósito**: Formulario completo de registro
- **Características**:
  - Validación con Zod
  - Medidor de fortaleza de contraseña
  - Verificación OTP por email
  - Auto-login después de verificación
  - Animaciones con Framer Motion

### 3. `/components/auth/InstitutionPromptCard.tsx`
- **Propósito**: Pantalla intermedia después del login
- **Características**:
  - Diseño atractivo y profesional
  - Lista de beneficios del registro
  - Botón CTA: "Registrar mi Institución"
  - Animaciones smooth

---

## ✏️ Archivos Modificados

### 1. `/components/auth/LoginForm.tsx`
**Cambios realizados:**
- ✅ Texto actualizado: "Panel de Control de Instituciones"
- ✅ Eliminado enlace "¿Eres una institución?"
- ✅ Link de registro cambiado a `/register`
- ✅ Simplificado el checkbox "Recordarme"

**Antes:**
```tsx
<p className="text-gray-500 mt-2 text-sm">Panel de administración institucional</p>
...
<Link href="/solicitar-alta">Solicita el alta</Link>
```

**Después:**
```tsx
<p className="text-gray-500 mt-2 text-sm">Panel de Control de Instituciones</p>
...
<Link replace href="/register">Regístrate</Link>
```

### 2. `/app/dashboard/page.tsx`
**Cambios realizados:**
- ✅ Agregado hook `useState` y `useEffect`
- ✅ Verificación de institución en el backend
- ✅ Renderizado condicional:
  - Sin institución → `<InstitutionPromptCard />`
  - Con institución → Dashboard completo
- ✅ Loading state mientras verifica

**Lógica añadida:**
```tsx
const [hasInstitution, setHasInstitution] = useState<boolean | null>(null);

useEffect(() => {
  const checkInstitution = async () => {
    const res = await fetch(`${apiUrl}/api/institutions/my-institution`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    if (res.ok) {
      const data = await res.json();
      setHasInstitution(!!data.institution);
    } else {
      setHasInstitution(false);
    }
  };
  
  if (token) checkInstitution();
}, [token]);
```

---

## 🎨 Características del Diseño

### InstitutionPromptCard
- **Icono**: Building2 en gradiente verde
- **Título personalizado**: Saluda al usuario por nombre
- **Descripción**: Explica el propósito del panel
- **Lista de beneficios**: 4 puntos destacados
- **CTA**: Botón grande con animaciones hover

### RegisterForm
- **Validación en tiempo real**
- **Indicadores visuales**:
  - ✅ Verde cuando el campo es válido
  - ❌ Rojo cuando hay errores
- **Password strength meter**: 5 niveles
- **OTP Screen**: Diseño limpio para verificación

---

## 🔐 Seguridad

1. **Validación robusta** con Zod schema
2. **Password requirements**:
   - Mínimo 8 caracteres
   - Al menos 1 mayúscula
   - Al menos 1 número
3. **Verificación por email** obligatoria
4. **Token-based authentication**
5. **Bloqueo temporal** después de 3 intentos fallidos (LoginForm)

---

## 🚀 Próximos Pasos

Para que el flujo funcione completamente, asegúrate de:

1. ✅ Backend tiene endpoint `/auth/register`
2. ✅ Backend tiene endpoint `/auth/verify`
3. ✅ Backend envía emails con códigos OTP
4. ✅ Backend tiene endpoint `/api/institutions/my-institution`
5. ✅ Backend puede asociar instituciones a usuarios autenticados

---

## �� Responsive Design

Todos los componentes son totalmente responsive:
- **Mobile**: Stack vertical, botones completos
- **Tablet**: Layout adaptado
- **Desktop**: Diseño óptimo con máximo aprovechamiento del espacio

---

## 🎭 Animaciones

- **Framer Motion** para todas las transiciones
- **Blob animations** en backgrounds
- **Hover effects** en botones y cards
- **Scale & fade** en entradas/salidas
- **Smooth transitions** entre estados

---

*Documento generado automáticamente - Fecha: 6 de Abril 2026*
