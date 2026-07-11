import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './src/config/db.js';
import authRoutes from './src/routes/auth.js';
import productoRoutes from './src/routes/productos.js';
import categoriaRoutes from './src/routes/categorias.js';
import carritoRoutes from './src/routes/carrito.js';
import ordenRoutes from './src/routes/ordenes.js';
import dashboardRoutes from './src/routes/dashboard.js';
import usuarioRoutes from './src/routes/usuarios.js';
import newsletterRoutes from './src/routes/newsletter.js';
import activityRoutes from './src/routes/activity.js';
import { errorHandler } from './src/middleware/errorHandler.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/carrito', carritoRoutes);
app.use('/api/ordenes', ordenRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/activity', activityRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API Tienda Virtual funcionando' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
