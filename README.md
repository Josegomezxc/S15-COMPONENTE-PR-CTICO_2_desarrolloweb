# Tienda Virtual (ProStore)

Sistema web de comercio electrónico virtual especializado en electrónica profesional y soluciones de espacio de trabajo, desarrollado con React (Frontend) y Node.js + Express (Backend) con almacenamiento en MongoDB.

## 🚀 Tecnologías

- **Frontend:** React 19, Vite 8, React Router 7, Axios, Recharts
- **Backend:** Node.js, Express
- **Base de datos:** MongoDB + Mongoose
- **Autenticación:** JWT (JSON Web Token)
- **Internacionalización:** Contexto propio de idioma (`LanguageContext`)
- **Estilos:** Vanilla CSS (Diseño responsive adaptativo)
- **API Testing:** Postman (Colección incluida en `/postman`)

## 📋 Requisitos previos

- Node.js v18 o superior
- MongoDB instalado localmente o cuenta de MongoDB Atlas
- Gestor de paquetes npm

## ⚙️ Instalación y Configuración

```bash
# 1. Clonar el repositorio e instalar dependencias del Backend
cd server
npm install

# 2. Instalar dependencias del Frontend (desde el directorio raíz)
cd ..
npm install
```

### Variables de Entorno

Crear y configurar el archivo `server/.env` con la siguiente estructura:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tienda-virtual
JWT_SECRET=mi_app_tienda_virtual_secret_key_2026
JWT_EXPIRES_IN=7d
```

## 🛠️ Ejecución del Proyecto

El backend y el frontend se ejecutan de manera simultánea en terminales separadas:

```bash
# Terminal 1 - Servidor Backend
cd server
npm run dev

# Terminal 2 - Cliente Frontend
npm run dev
```

- **Servidor Backend API:** [http://localhost:5000](http://localhost:5000)
- **Cliente Frontend Web:** [http://localhost:5173](http://localhost:5173)

## 🗄️ Sembrado de Datos (Seed)

El proyecto incluye un script automatizado para poblar la base de datos con categorías, usuarios e imágenes temáticas reales y de alta calidad para cada producto desde Unsplash.

```bash
cd server
node seed.js
```

### Credenciales de Acceso de Prueba
- **Rol Administrador:** `admin@tienda.com` / `123456`
- **Rol Cliente:** `cliente@tienda.com` / `123456`

---

## 🌟 Funcionalidades Clave Añadidas y Refactorizadas

### 1. 🌐 Internacionalización y Localización Completa (ES / EN)
- **Traductor en Navbar:** Un botón dinámico para alternar el idioma de la aplicación instantáneamente entre español e inglés de forma reactiva y fluida.
- **Traducción Estática:** Localización al 100% de páginas corporativas e informativas ([About.jsx](file:///src/pages/About.jsx), [Carreras.jsx](file:///src/pages/Carreras.jsx), [Terminos.jsx](file:///src/pages/Terminos.jsx), [Privacidad.jsx](file:///src/pages/Privacidad.jsx)), alertas de suscripción, notificaciones de error y pantallas de autenticación.
- **Localización Dinámica de Base de Datos:** Traduce de forma reactiva sobre la marcha la información de productos y categorías cargada dinámicamente desde MongoDB (nombres, categorías y especificaciones técnicas), asegurando una experiencia completamente libre de fragmentos de idioma mezclados.

### 2. 📈 Dashboard Administrativo y Gráfico de Líneas Interactivo
- **Gráfico de Líneas SVG:** Rediseño estético y responsivo para mostrar las tendencias de ventas con un trazado de línea suave, un fondo de rejilla de precios dinámicos y un degradado de área interactivo.
- **Nodos Interactivos (Tooltips):** Cada punto de datos muestra el precio y período exacto de venta a través de un tooltip al posicionar el cursor encima.
- **Filtro de Período Funcional (Weekly / Monthly):** Pestañas de alternancia completamente funcionales que consultan al backend y grafican las ventas agrupadas por **Días (Semanal)** o **Meses (Mensual)** cronológicamente.

### 3. 📱 Diseño Adaptativo y Bento Grid
- Se optimizó el responsive y el flujo móvil/tableta mediante el uso de CSS Grid y Flexbox.
- Se implementaron rejillas auto-adaptables (`auto-fit`/`auto-fill`) para las tarjetas de estadísticas del panel, la cuadrícula del catálogo de productos y los detalles de las órdenes.

### 4. 🏷️ Iconografía de Categorías Localizada
- Se corrigió el bug de solapamiento de texto del icono de "Periféricos" al cambiar la etiqueta a un identificador compatible con Material Symbols (`videocam`), previniendo la renderización del texto "CAM".
- Estandarización de la barra lateral del catálogo para cargar iconos correctos y temáticos para todas las categorías.

---

## 📂 Estructura del Directorio

```
mi-app/
├── postman/                      # Colecciones de Postman para pruebas de API
├── public/                       # Recursos estáticos públicos del cliente
├── server/                       # Backend de Node.js + Express
│   ├── src/
│   │   ├── config/               # Configuración de base de datos
│   │   ├── controllers/          # Controladores (Auth, Dashboard, Productos, etc.)
│   │   ├── middleware/           # Protectores de rutas y validación de roles
│   │   ├── models/               # Modelos Mongoose (Usuario, Producto, Categoria, Orden, etc.)
│   │   └── routes/               # Enrutadores Express
│   ├── index.js                  # Punto de entrada del servidor
│   └── seed.js                   # Script para poblar la base de datos
├── src/                          # Frontend de React + Vite
│   ├── components/               # Componentes compartidos (Navbar, Footer, Sidebar, etc.)
│   ├── contexts/                 # Contextos globales (AuthContext, LanguageContext, CartContext)
│   ├── i18n/                     # Diccionarios de internacionalización (es.js, en.js)
│   ├── pages/                    # Páginas principales del flujo web
│   ├── services/                 # Configuración de cliente Axios (api.js)
│   └── index.css                 # Sistema de diseño y hoja de estilos global
├── index.html                    # Plantilla base HTML5
├── package.json                  # Script y dependencias de NPM
└── README.md                     # Documentación general del proyecto
```

## 🔌 Principales Rutas de la API

### Autenticación y Usuarios
- `POST /api/auth/register` - Registro de nuevos usuarios.
- `POST /api/auth/login` - Inicio de sesión.
- `GET /api/auth/profile` - Obtener datos del perfil activo.
- `PUT /api/usuarios/perfil` - Editar datos de perfil.
- `PUT /api/usuarios/cambiar-password` - Actualizar contraseña.

### Productos y Categorías
- `GET /api/productos` - Listar catálogo de productos (soporta filtros de búsqueda, categoría y rango de precios).
- `GET /api/productos/:id` - Detalle individual de producto.
- `POST /api/productos` - Crear nuevo producto (Solo Admin).
- `PUT /api/productos/:id` - Modificar producto (Solo Admin).
- `DELETE /api/productos/:id` - Eliminar producto (Solo Admin).
- `GET /api/categorias` - Listar categorías existentes.

### Carrito y Órdenes
- `GET /api/carrito` - Listar items del carrito por usuario.
- `POST /api/carrito` - Añadir item al carrito.
- `PUT /api/carrito/:productoId` - Modificar cantidades de un item.
- `DELETE /api/carrito/:productoId` - Quitar un item del carrito.
- `POST /api/ordenes` - Generar una orden de compra (reduce inventario).
- `GET /api/ordenes` - Listado de órdenes de compra del usuario.
- `GET /api/ordenes/:id` - Ver detalles de una compra en específico.
- `PUT /api/ordenes/:id/estado` - Modificar el estado de entrega de una orden (Solo Admin).

### Mensajes de Soporte y Contacto
- `POST /api/contacto` - Enviar mensaje desde formulario de soporte.
- `GET /api/contacto/mis-mensajes` - Listar consultas enviadas por el cliente.
- `GET /api/contacto/todas` - Listar consultas del sitio para resolución (Solo Admin).
- `PUT /api/contacto/:id/responder` - Enviar respuesta a un ticket de soporte (Solo Admin).

### Estadísticas del Dashboard
- `GET /api/dashboard/stats` - Obtener resumen numérico de transacciones y listas de tendencias ordenadas diaria/mensual (Solo Admin).

---

## 📝 Licencia

Proyecto de carácter académico y universitario desarrollado con fines formativos.
