import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Usuario from './src/models/Usuario.js';
import Categoria from './src/models/Categoria.js';
import Producto from './src/models/Producto.js';
import Orden from './src/models/Orden.js';
import Carrito from './src/models/Carrito.js';

dotenv.config();

const CATEGORIAS = [
  { nombre: 'Computadoras', descripcion: 'Laptops y equipos de cómputo de alto rendimiento', icono: 'laptop_mac' },
  { nombre: 'Monitores', descripcion: 'Pantallas profesionales para trabajo y gaming', icono: 'monitor' },
  { nombre: 'Accesorios', descripcion: 'Teclados, mice y accesorios de productividad', icono: 'mouse' },
  { nombre: 'Muebles', descripcion: 'Sillas y escritorios ergonómicos', icono: 'chair_alt' },
  { nombre: 'Audio', descripcion: 'Audífonos, bocinas y equipos de sonido', icono: 'headphones' },
  { nombre: 'Periféricos', descripcion: 'Cámaras, hubs y dispositivos externos', icono: 'webcam' },
];

const PRODUCTOS = [
  // Computadoras
  { nombre: 'ProBook Ultra 16', descripcion: 'Laptop profesional con Intel Core i9-13900H, 32GB DDR5, 1TB SSD NVMe, pantalla 16" 4K OLED, gráficos NVIDIA RTX 4070', precio: 28999.99, categoria: 'Computadoras', stock: 12 },
  { nombre: 'WorkStation Pro M2', descripcion: 'Estación de trabajo con chip M2 Ultra, 64GB RAM unificada, 2TB SSD, ideal para renderizado 3D y video 8K', precio: 45999.99, categoria: 'Computadoras', stock: 5 },
  { nombre: 'UltraBook Air 14', descripcion: 'Ultrabook delgado de 14" con procesador AMD Ryzen 7, 16GB RAM, 512GB SSD, batería de 15 horas', precio: 18999.99, categoria: 'Computadoras', stock: 25 },
  { nombre: 'Gamer Titan X', descripcion: 'Laptop gaming con RTX 4090, 64GB RAM, 2TB SSD, pantalla 17" 240Hz, teclado mecánico RGB', precio: 38999.99, categoria: 'Computadoras', stock: 8 },
  // Monitores
  { nombre: 'ProView 32" 4K', descripcion: 'Monitor profesional 32" UHD 4K, panel IPS, calibración de fábrica Delta E<2, 100% sRGB, USB-C 96W', precio: 12499.99, categoria: 'Monitores', stock: 15 },
  { nombre: 'UltraWide 34" Curvo', descripcion: 'Monitor ultra panorámico 34" WQHD curvo, 144Hz, 1ms, AMD FreeSync Premium Pro, altavoces integrados', precio: 15999.99, categoria: 'Monitores', stock: 10 },
  { nombre: 'Gaming 27" 240Hz', descripcion: 'Monitor gaming 27" QHD 240Hz, panel OLED, 0.03ms, G-Sync compatible, HDR True Black 600', precio: 18999.99, categoria: 'Monitores', stock: 7 },
  { nombre: 'Portátil 15" USB-C', descripcion: 'Monitor portátil 15.6" FHD, USB-C plug-and-play, peso 700g, ideal para setups móviles', precio: 5499.99, categoria: 'Monitores', stock: 20 },
  // Accesorios
  { nombre: 'Teclado Mecánico RGB', descripcion: 'Teclado mecánico full-size con switches Cherry MX Blue, retroiluminación RGB por tecla, aluminio anodizado', precio: 2899.99, categoria: 'Accesorios', stock: 30 },
  { nombre: 'Mouse Inalámbrico Pro', descripcion: 'Mouse ergonómico inalámbrico con sensor de 26,000 DPI, 8 botones programables, batería 70h, carga rápida', precio: 2199.99, categoria: 'Accesorios', stock: 40 },
  { nombre: 'Alfombrilla XXL Escritorio', descripcion: 'Alfombrilla de escritorio 90x40cm, superficie de tela suave, base antideslizante, bordes cosidos', precio: 699.99, categoria: 'Accesorios', stock: 60, enOferta: true },
  { nombre: 'Webcam 4K Pro', descripcion: 'Cámara web 4K con enfoque automático, micrófono estéreo, campo de visión 90°, obturador de privacidad', precio: 3299.99, categoria: 'Accesorios', stock: 18 },
  // Muebles
  { nombre: 'Silla Ergonómica Pro', descripcion: 'Silla de oficina ergonómica con soporte lumbar ajustable, reposabrazos 4D, malla transpirable, capacidad 150kg', precio: 12499.99, categoria: 'Muebles', stock: 10 },
  { nombre: 'Escritorio Eléctrico Ajustable', descripcion: 'Escritorio de pie con motor eléctrico de doble elevación, rango 72-120cm, tablero 140x70cm, capacidad 100kg', precio: 15999.99, categoria: 'Muebles', stock: 6 },
  { nombre: 'Soporte Monitor Dual', descripcion: 'Brazo articulado para dos monitores de hasta 32", ajuste de altura y rotación, gestión de cables integrada', precio: 3499.99, categoria: 'Muebles', stock: 22 },
  { nombre: 'Base Laptop Ajustable', descripcion: 'Soporte de laptop de aluminio con 6 ángulos ajustables, ventilación integrada, plegable para transporte', precio: 1299.99, categoria: 'Muebles', stock: 35 },
  // Audio
  { nombre: 'Audífonos ANC Premium', descripcion: 'Audífonos over-ear con cancelación de ruido activa híbrida, 40h batería, codec LDAC, plegables', precio: 5499.99, categoria: 'Audio', stock: 20 },
  { nombre: 'Bocina Bluetooth Portátil', descripcion: 'Bocina inalámbrica resistente al agua IP67, sonido 360°, 20h batería, emparejamiento estéreo', precio: 2999.99, categoria: 'Audio', stock: 25, enOferta: true },
  { nombre: 'Micrófono Condenser USB', descripcion: 'Micrófono de condensador para streaming y podcast, patrón cardioide, ganancia ajustable, monitor en tiempo real', precio: 3999.99, categoria: 'Audio', stock: 14 },
  { nombre: 'SoundBar Escritorio', descripcion: 'Barra de sonido compacta para escritorio, Bluetooth 5.3, USB-C, ecualizador integrado, 30W RMS', precio: 2199.99, categoria: 'Audio', stock: 28 },
  // Periféricos
  { nombre: 'Hub USB-C 12 en 1', descripcion: 'Hub multipuerto con HDMI 4K, Ethernet Gigabit, 3x USB-A, lector SD/TF, audio 3.5mm, PD 100W', precio: 1899.99, categoria: 'Periféricos', stock: 45 },
  { nombre: 'Tableta Gráfica Profesional', descripcion: 'Tableta de dibujo con lápiz sin batería, 8192 niveles de presión, área activa 10x6", atajos personalizables', precio: 4499.99, categoria: 'Periféricos', stock: 12 },
  { nombre: 'Lector de Huellas USB', descripcion: 'Lector biométrico con cifrado AES-256, compatible con Windows Hello, plug-and-play, aluminio', precio: 1299.99, categoria: 'Periféricos', stock: 33 },
  { nombre: 'Estación de Carga Múltiple', descripcion: 'Cargador USB-C con 6 puertos (65W total), carga rápida PD 3.0, GaN, indicadores LED, protección contra sobretensión', precio: 1599.99, categoria: 'Periféricos', stock: 50, enOferta: true },
];

const USUARIOS = [
  { nombre: 'Admin Principal', email: 'admin@tienda.com', password: '123456', rol: 'admin' },
  { nombre: 'Admin Soporte', email: 'soporte@tienda.com', password: '123456', rol: 'admin' },
  { nombre: 'Carlos López', email: 'cliente@tienda.com', password: '123456', rol: 'cliente' },
  { nombre: 'María García', email: 'maria@email.com', password: '123456', rol: 'cliente' },
];

const DIRECCIONES = [
  'Av. Reforma 222, Col. Juárez, Ciudad de México, 06600',
  'Calle 5 de Mayo 120, Col. Centro, Guadalajara, 44100',
  'Blvd. Díaz Ordaz 150, Col. San Pedro, Monterrey, 66220',
  'Av. Universidad 1000, Col. Santa Cruz, Puebla, 72000',
];

const ESTADOS_ORDEN = ['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'];

function randomDate(monthsAgo) {
  const d = new Date();
  d.setMonth(d.getMonth() - monthsAgo);
  d.setDate(Math.floor(Math.random() * 28) + 1);
  d.setHours(Math.floor(Math.random() * 12) + 8);
  d.setMinutes(Math.floor(Math.random() * 60));
  return d;
}

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a MongoDB');

    await Promise.all([
      Usuario.deleteMany({}),
      Categoria.deleteMany({}),
      Producto.deleteMany({}),
      Orden.deleteMany({}),
      Carrito.deleteMany({}),
    ]);
    console.log('Datos anteriores eliminados');

    // Crear usuarios
    const usuariosData = await Promise.all(
      USUARIOS.map((u) => {
        const usuario = new Usuario(u);
        return usuario.save();
      })
    );
    console.log(`${usuariosData.length} usuarios creados`);

    const [admin1, admin2, cliente1, cliente2] = usuariosData;

    // Crear categorías
    const categoriasData = await Promise.all(
      CATEGORIAS.map((c) => Categoria.create(c))
    );
    console.log(`${categoriasData.length} categorías creadas`);

    const catMap = Object.fromEntries(
      categoriasData.map((c) => [c.nombre, c._id])
    );

    // Crear productos con imágenes realistas
    const productosData = await Producto.create(
      PRODUCTOS.map((p) => ({
        ...p,
        categoria: catMap[p.categoria],
        imagen: `https://placehold.co/400x300/1a1a2e/ffffff?text=${encodeURIComponent(p.nombre.split(' ').slice(0, 2).join('+'))}`,
      }))
    );
    console.log(`${productosData.length} productos creados`);

    // Crear órdenes históricas (12 órdenes)
    const ordenesData = [
      // Cliente 1 - 6 órdenes
      {
        usuario: cliente1._id, items: [
          { producto: productosData[0]._id, nombre: productosData[0].nombre, precio: productosData[0].precio, cantidad: 1 },
          { producto: productosData[8]._id, nombre: productosData[8].nombre, precio: productosData[8].precio, cantidad: 2 },
        ],
        total: productosData[0].precio + productosData[8].precio * 2,
        estado: 'entregado', direccionEnvio: DIRECCIONES[0], createdAt: randomDate(5),
      },
      {
        usuario: cliente1._id, items: [
          { producto: productosData[4]._id, nombre: productosData[4].nombre, precio: productosData[4].precio, cantidad: 1 },
        ],
        total: productosData[4].precio,
        estado: 'entregado', direccionEnvio: DIRECCIONES[0], createdAt: randomDate(4),
      },
      {
        usuario: cliente1._id, items: [
          { producto: productosData[12]._id, nombre: productosData[12].nombre, precio: productosData[12].precio, cantidad: 1 },
          { producto: productosData[13]._id, nombre: productosData[13].nombre, precio: productosData[13].precio, cantidad: 1 },
        ],
        total: productosData[12].precio + productosData[13].precio,
        estado: 'entregado', direccionEnvio: DIRECCIONES[0], createdAt: randomDate(3),
      },
      {
        usuario: cliente1._id, items: [
          { producto: productosData[16]._id, nombre: productosData[16].nombre, precio: productosData[16].precio, cantidad: 1 },
        ],
        total: productosData[16].precio,
        estado: 'enviado', direccionEnvio: DIRECCIONES[0], createdAt: randomDate(1.5),
      },
      {
        usuario: cliente1._id, items: [
          { producto: productosData[20]._id, nombre: productosData[20].nombre, precio: productosData[20].precio, cantidad: 3 },
          { producto: productosData[23]._id, nombre: productosData[23].nombre, precio: productosData[23].precio, cantidad: 2 },
        ],
        total: productosData[20].precio * 3 + productosData[23].precio * 2,
        estado: 'pagado', direccionEnvio: DIRECCIONES[0], createdAt: randomDate(0.5),
      },
      {
        usuario: cliente1._id, items: [
          { producto: productosData[3]._id, nombre: productosData[3].nombre, precio: productosData[3].precio, cantidad: 1 },
        ],
        total: productosData[3].precio,
        estado: 'pendiente', direccionEnvio: DIRECCIONES[0], createdAt: randomDate(0.1),
      },
      // Cliente 2 - 4 órdenes
      {
        usuario: cliente2._id, items: [
          { producto: productosData[1]._id, nombre: productosData[1].nombre, precio: productosData[1].precio, cantidad: 1 },
        ],
        total: productosData[1].precio,
        estado: 'entregado', direccionEnvio: DIRECCIONES[2], createdAt: randomDate(4),
      },
      {
        usuario: cliente2._id, items: [
          { producto: productosData[5]._id, nombre: productosData[5].nombre, precio: productosData[5].precio, cantidad: 2 },
          { producto: productosData[9]._id, nombre: productosData[9].nombre, precio: productosData[9].precio, cantidad: 3 },
        ],
        total: productosData[5].precio * 2 + productosData[9].precio * 3,
        estado: 'entregado', direccionEnvio: DIRECCIONES[2], createdAt: randomDate(3),
      },
      {
        usuario: cliente2._id, items: [
          { producto: productosData[18]._id, nombre: productosData[18].nombre, precio: productosData[18].precio, cantidad: 1 },
          { producto: productosData[21]._id, nombre: productosData[21].nombre, precio: productosData[21].precio, cantidad: 1 },
        ],
        total: productosData[18].precio + productosData[21].precio,
        estado: 'enviado', direccionEnvio: DIRECCIONES[2], createdAt: randomDate(1),
      },
      {
        usuario: cliente2._id, items: [
          { producto: productosData[10]._id, nombre: productosData[10].nombre, precio: productosData[10].precio, cantidad: 5 },
          { producto: productosData[14]._id, nombre: productosData[14].nombre, precio: productosData[14].precio, cantidad: 2 },
        ],
        total: productosData[10].precio * 5 + productosData[14].precio * 2,
        estado: 'cancelado', direccionEnvio: DIRECCIONES[2], createdAt: randomDate(2),
      },
      // Admin 1 - 2 órdenes de prueba
      {
        usuario: admin1._id, items: [
          { producto: productosData[2]._id, nombre: productosData[2].nombre, precio: productosData[2].precio, cantidad: 2 },
        ],
        total: productosData[2].precio * 2,
        estado: 'pagado', direccionEnvio: DIRECCIONES[3], createdAt: randomDate(0.3),
      },
      {
        usuario: admin1._id, items: [
          { producto: productosData[19]._id, nombre: productosData[19].nombre, precio: productosData[19].precio, cantidad: 1 },
        ],
        total: productosData[19].precio,
        estado: 'entregado', direccionEnvio: DIRECCIONES[3], createdAt: randomDate(2),
      },
    ];

    await Orden.create(ordenesData);
    console.log(`${ordenesData.length} órdenes creadas`);

    console.log('\n✓ Seed completado exitosamente!');
    console.log('\nCredenciales de prueba:');
    console.log('  Admin:   admin@tienda.com / 123456');
    console.log('  Admin 2: soporte@tienda.com / 123456');
    console.log('  Cliente: cliente@tienda.com / 123456');
    console.log('  Cliente: maria@email.com    / 123456');
    console.log(`\n  ${PRODUCTOS.length} productos en ${CATEGORIAS.length} categorías`);
    console.log(`  ${ordenesData.length} órdenes históricas`);

    process.exit(0);
  } catch (error) {
    console.error('Error en seed:', error);
    process.exit(1);
  }
};

seed();
