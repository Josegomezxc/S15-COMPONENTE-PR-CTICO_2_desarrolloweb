# Tienda Virtual

Sistema web de tienda virtual desarrollado con React y Node.js como proyecto universitario.

## Tecnologías

- **Frontend:** React 19, Vite 8, React Router, Axios, Recharts
- **Backend:** Node.js, Express
- **Base de datos:** MongoDB + Mongoose
- **Autenticación:** JWT (JSON Web Token)
- **Diseño:** Figma
- **Testing de API:** Postman

## Requisitos previos

- Node.js v18 o superior
- MongoDB (local o Atlas)
- npm

## Instalación

```bash
# Backend
cd server
npm install

# Frontend (desde la raíz)
npm install
```

Configurar variables de entorno en `server/.env`:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tienda-virtual
JWT_SECRET=mi_app_tienda_virtual_secret_key_2026
JWT_EXPIRES_IN=7d
```

## Ejecución

```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
npm run dev
```

Backend: `http://localhost:5000`
Frontend: `http://localhost:5173`

## Seed de datos

```bash
cd server && node seed.js
```

### Credenciales de prueba
- **Admin:** admin@tienda.com / 123456
- **Cliente:** cliente@tienda.com / 123456

## Funcionalidades

### Autenticación y Usuarios
- Registro e inicio de sesión con JWT
- Perfil de usuario (editar nombre, email)
- Cambio de contraseña
- Roles: administrador y cliente

### Productos
- Catálogo público con filtro por categoría
- Vista detalle con selector de cantidad
- CRUD completo (solo admin)
- Categorización de productos

### Carrito de Compras
- Agregar/quitar productos
- Actualizar cantidades
- Persistencia por usuario
- Indicador con badge en navbar

### Órdenes
- Crear orden desde el carrito (descuenta stock)
- Listado de órdenes del usuario
- Detalle de orden con productos
- Administración de estados (admin): pendiente, pagado, enviado, entregado, cancelado

### Dashboard (Admin)
- Tarjetas con estadísticas (productos, órdenes, usuarios, ventas)
- Gráfico de barras: ventas por mes
- Gráfico de pastel: productos por categoría
- Gráfico de barras: órdenes por estado

## API Endpoints

### Autenticación
| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/api/auth/register` | Registrar | No |
| POST | `/api/auth/login` | Login | No |
| GET | `/api/auth/profile` | Perfil | JWT |

### Usuarios
| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | `/api/usuarios/perfil` | Obtener perfil | JWT |
| PUT | `/api/usuarios/perfil` | Actualizar perfil | JWT |
| PUT | `/api/usuarios/cambiar-password` | Cambiar password | JWT |

### Productos
| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | `/api/productos` | Listar | No |
| GET | `/api/productos/:id` | Detalle | No |
| POST | `/api/productos` | Crear | Admin |
| PUT | `/api/productos/:id` | Actualizar | Admin |
| DELETE | `/api/productos/:id` | Eliminar | Admin |

### Categorías
| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | `/api/categorias` | Listar | No |
| POST | `/api/categorias` | Crear | Admin |
| PUT | `/api/categorias/:id` | Actualizar | Admin |
| DELETE | `/api/categorias/:id` | Eliminar | Admin |

### Carrito (protegido)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/carrito` | Ver carrito |
| POST | `/api/carrito` | Agregar producto |
| PUT | `/api/carrito/:productoId` | Actualizar cantidad |
| DELETE | `/api/carrito/:productoId` | Quitar producto |
| DELETE | `/api/carrito` | Vaciar carrito |

### Órdenes (protegido)
| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/api/ordenes` | Crear orden | JWT |
| GET | `/api/ordenes` | Mis órdenes | JWT |
| GET | `/api/ordenes/:id` | Detalle | JWT |
| GET | `/api/ordenes/todas` | Todas | Admin |
| PUT | `/api/ordenes/:id/estado` | Cambiar estado | Admin |

### Dashboard
| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | `/api/dashboard/stats` | Estadísticas | Admin |

## Estructura del proyecto

```
mi-app/
├── server/                       # Backend
│   ├── src/
│   │   ├── config/               # Conexión MongoDB
│   │   ├── controllers/          # Lógica de negocio
│   │   ├── middleware/            # Auth, errores
│   │   ├── models/               # Mongoose: Usuario, Producto, Categoria, Carrito, Orden
│   │   ├── routes/               # Rutas API
│   │   └── validations/          # Validaciones
│   ├── index.js
│   ├── seed.js
│   └── package.json
├── src/                          # Frontend
│   ├── components/               # Navbar, Footer, ProductCard, etc.
│   ├── contexts/                 # AuthContext, CartContext
│   ├── pages/                    # Dashboard, Login, Register, Productos, Carrito, etc.
│   └── services/                 # Axios API client
├── postman/                      # Colección Postman
└── package.json
```

## Diseño en Figma

[Enlace al prototipo en Figma](https://www.figma.com/design/)

## Licencia

Proyecto académico
