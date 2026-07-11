import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Usuario from './src/models/Usuario.js';
import Categoria from './src/models/Categoria.js';
import Producto from './src/models/Producto.js';
import Orden from './src/models/Orden.js';
import Carrito from './src/models/Carrito.js';

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a MongoDB');

    await Usuario.deleteMany({});
    await Categoria.deleteMany({});
    await Producto.deleteMany({});
    await Orden.deleteMany({});
    await Carrito.deleteMany({});
    console.log('Datos anteriores eliminados');

    const admin = await Usuario.create({
      nombre: 'Admin',
      email: 'admin@tienda.com',
      password: '123456',
      rol: 'admin'
    });
    console.log('Admin creado:', admin.email);

    const cliente = await Usuario.create({
      nombre: 'Cliente',
      email: 'cliente@tienda.com',
      password: '123456',
      rol: 'cliente'
    });
    console.log('Cliente creado:', cliente.email);

    const electronica = await Categoria.create({
      nombre: 'Electrónicos',
      descripcion: 'Productos electrónicos y tecnología'
    });

    const ropa = await Categoria.create({
      nombre: 'Ropa',
      descripcion: 'Prendas de vestir y accesorios'
    });

    const hogar = await Categoria.create({
      nombre: 'Hogar',
      descripcion: 'Artículos para el hogar'
    });

    const deportes = await Categoria.create({
      nombre: 'Deportes',
      descripcion: 'Equipamiento deportivo'
    });
    console.log('Categorías creadas');

    await Producto.create([
      {
        nombre: 'Laptop Gamer Pro',
        descripcion: 'Laptop de alto rendimiento con RTX 4070, 32GB RAM, 1TB SSD',
        precio: 25999.99,
        categoria: electronica._id,
        stock: 10,
        imagen: 'https://placehold.co/400x300/2563eb/ffffff?text=Laptop'
      },
      {
        nombre: 'Audífonos Bluetooth',
        descripcion: 'Audífonos inalámbricos con cancelación de ruido activa',
        precio: 2499.99,
        categoria: electronica._id,
        stock: 25,
        imagen: 'https://placehold.co/400x300/2563eb/ffffff?text=Audifonos'
      },
      {
        nombre: 'Camiseta Algodón',
        descripcion: 'Camiseta de algodón orgánico, disponible en varios colores',
        precio: 399.99,
        categoria: ropa._id,
        stock: 50,
        imagen: 'https://placehold.co/400x300/7c3aed/ffffff?text=Camiseta'
      },
      {
        nombre: 'Chaqueta Impermeable',
        descripcion: 'Chaqueta resistente al agua ideal para actividades al aire libre',
        precio: 1899.99,
        categoria: ropa._id,
        stock: 15,
        imagen: 'https://placehold.co/400x300/7c3aed/ffffff?text=Chaqueta'
      },
      {
        nombre: 'Set de Sartenes Antiadherentes',
        descripcion: 'Juego de 5 sartenes con recubrimiento antiadherente profesional',
        precio: 3499.99,
        categoria: hogar._id,
        stock: 20,
        imagen: 'https://placehold.co/400x300/059669/ffffff?text=Sartenes'
      },
      {
        nombre: 'Bicicleta Montaña',
        descripcion: 'Bicicleta todo terreno con suspensión delantera y 21 velocidades',
        precio: 8999.99,
        categoria: deportes._id,
        stock: 8,
        imagen: 'https://placehold.co/400x300/dc2626/ffffff?text=Bicicleta'
      }
    ]);
    console.log('Productos creados');

    const productos = await Producto.find();

    const hoy = new Date();
    const hace1Mes = new Date(hoy);
    hace1Mes.setMonth(hace1Mes.getMonth() - 1);
    const hace2Meses = new Date(hoy);
    hace2Meses.setMonth(hace2Meses.getMonth() - 2);
    const hace3Meses = new Date(hoy);
    hace3Meses.setMonth(hace3Meses.getMonth() - 3);

    await Orden.create([
      {
        usuario: cliente._id,
        items: [
          { producto: productos[1]._id, nombre: productos[1].nombre, precio: productos[1].precio, cantidad: 2 },
          { producto: productos[2]._id, nombre: productos[2].nombre, precio: productos[2].precio, cantidad: 1 }
        ],
        total: productos[1].precio * 2 + productos[2].precio,
        estado: 'entregado',
        createdAt: hace3Meses
      },
      {
        usuario: cliente._id,
        items: [
          { producto: productos[0]._id, nombre: productos[0].nombre, precio: productos[0].precio, cantidad: 1 }
        ],
        total: productos[0].precio,
        estado: 'entregado',
        createdAt: hace2Meses
      },
      {
        usuario: cliente._id,
        items: [
          { producto: productos[4]._id, nombre: productos[4].nombre, precio: productos[4].precio, cantidad: 2 }
        ],
        total: productos[4].precio * 2,
        estado: 'enviado',
        createdAt: hace1Mes
      },
      {
        usuario: admin._id,
        items: [
          { producto: productos[3]._id, nombre: productos[3].nombre, precio: productos[3].precio, cantidad: 1 },
          { producto: productos[5]._id, nombre: productos[5].nombre, precio: productos[5].precio, cantidad: 1 }
        ],
        total: productos[3].precio + productos[5].precio,
        estado: 'pagado',
        createdAt: hoy
      }
    ]);
    console.log('Órdenes de prueba creadas');

    console.log('\nSeed completado exitosamente!');
    console.log('\nCredenciales de prueba:');
    console.log('Admin - admin@tienda.com / 123456');
    console.log('Cliente - cliente@tienda.com / 123456');

    process.exit(0);
  } catch (error) {
    console.error('Error en seed:', error);
    process.exit(1);
  }
};

seed();
