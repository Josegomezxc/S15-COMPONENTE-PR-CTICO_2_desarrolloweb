# Tienda Virtual

Sistema web de tienda virtual desarrollado con React y Node.js como proyecto universitario.

## Tecnologías

- **Frontend:** React 19, Vite 8, React Router, Axios
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

### Backend

```bash
cd server
npm install
```

Configurar variables de entorno en `server/.env`:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tienda-virtual
JWT_SECRET=mi_app_tienda_virtual_secret_key_2026
JWT_EXPIRES_IN=7d
```

### Frontend

```bash
npm install
```

## Ejecución

### Backend (desde la raíz del proyecto)

```bash
cd server
npm run dev
```

El servidor se ejecutará en `http://localhost:5000`

### Frontend (desde la raíz del proyecto)

```bash
npm run dev
```

La aplicación se ejecutará en `http://localhost:5173`

## API Endpoints

### Autenticación

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/api/auth/register` | Registrar usuario | No |
| POST | `/api/auth/login` | Iniciar sesión | No |
| GET | `/api/auth/profile` | Obtener perfil | JWT |

### Productos

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | `/api/productos` | Listar productos | No |
| GET | `/api/productos/:id` | Obtener producto | No |
| POST | `/api/productos` | Crear producto | Admin |
| PUT | `/api/productos/:id` | Actualizar producto | Admin |
| DELETE | `/api/productos/:id` | Eliminar producto | Admin |

### Categorías

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | `/api/categorias` | Listar categorías | No |
| POST | `/api/categorias` | Crear categoría | Admin |
| PUT | `/api/categorias/:id` | Actualizar categoría | Admin |
| DELETE | `/api/categorias/:id` | Eliminar categoría | Admin |

## Script del seed de datos

Para crear un usuario administrador y datos de prueba, ejecuta en el backend:

```bash
node seed.js
```

## Estructura del proyecto

```
mi-app/
├── server/                  # Backend
│   ├── src/
│   │   ├── config/          # Conexión a MongoDB
│   │   ├── controllers/     # Lógica de negocio
│   │   ├── middleware/       # Auth, manejo de errores
│   │   ├── models/          # Modelos Mongoose
│   │   ├── routes/          # Rutas de la API
│   │   └── validations/     # Validaciones
│   ├── index.js             # Punto de entrada
│   └── package.json
├── src/                     # Frontend
│   ├── components/          # Componentes reutilizables
│   ├── contexts/            # Contexto de autenticación
│   ├── pages/               # Páginas de la aplicación
│   └── services/            # Cliente API (Axios)
├── postman/                 # Colección de Postman
└── package.json
```

## Funcionalidades

- Registro e inicio de sesión con JWT
- Protección de rutas privadas y de administrador
- CRUD completo de productos
- Categorización de productos
- Filtrado de productos por categoría
- Diseño responsivo
- Validaciones en frontend y backend
- Manejo de errores

## Diseño en Figma

[Enlace al prototipo en Figma](https://www.figma.com/design/)

## Licencia

Proyecto académico - Universidad
