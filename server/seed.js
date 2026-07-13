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
  { nombre: 'ProBook Ultra 16', descripcion: 'Laptop profesional con Intel Core i9-13900H, 32GB DDR5, 1TB SSD NVMe, pantalla 16" 4K OLED, gráficos NVIDIA RTX 4070', precio: 1299.99, categoria: 'Computadoras', stock: 12, imagen: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&auto=format&fit=crop&q=80' },
  { nombre: 'WorkStation Pro M2', descripcion: 'Estación de trabajo con chip M2 Ultra, 64GB RAM unificada, 2TB SSD, ideal para renderizado 3D y video 8K', precio: 2499.99, categoria: 'Computadoras', stock: 5, imagen: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600&auto=format&fit=crop&q=80' },
  { nombre: 'UltraBook Air 14', descripcion: 'Ultrabook delgado de 14" con procesador AMD Ryzen 7, 16GB RAM, 512GB SSD, batería de 15 horas', precio: 699.99, categoria: 'Computadoras', stock: 25, imagen: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80' },
  { nombre: 'Gamer Titan X', descripcion: 'Laptop gaming con RTX 4090, 64GB RAM, 2TB SSD, pantalla 17" 240Hz, teclado mecánico RGB', precio: 2199.99, categoria: 'Computadoras', stock: 8, imagen: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80' },
  // Monitores
  { nombre: 'ProView 32" 4K', descripcion: 'Monitor profesional 32" UHD 4K, panel IPS, calibración de fábrica Delta E<2, 100% sRGB, USB-C 96W', precio: 449.99, categoria: 'Monitores', stock: 15, imagen: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80' },
  { nombre: 'UltraWide 34" Curvo', descripcion: 'Monitor ultra panorámico 34" WQHD curvo, 144Hz, 1ms, AMD FreeSync Premium Pro, altavoces integrados', precio: 399.99, categoria: 'Monitores', stock: 10, imagen: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&auto=format&fit=crop&q=80' },
  { nombre: 'Gaming 27" 240Hz', descripcion: 'Monitor gaming 27" QHD 240Hz, panel OLED, 0.03ms, G-Sync compatible, HDR True Black 600', precio: 599.99, categoria: 'Monitores', stock: 7, imagen: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80' },
  { nombre: 'Portátil 15" USB-C', descripcion: 'Monitor portátil 15.6" FHD, USB-C plug-and-play, peso 700g, ideal para setups móviles', precio: 179.99, categoria: 'Monitores', stock: 20, imagen: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=600&auto=format&fit=crop&q=80' },
  // Accesorios
  { nombre: 'Teclado Mecánico RGB', descripcion: 'Teclado mecánico full-size con switches Cherry MX Blue, retroiluminación RGB por tecla, aluminio anodizado', precio: 89.99, categoria: 'Accesorios', stock: 30, imagen: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=80' },
  { nombre: 'Mouse Inalámbrico Pro', descripcion: 'Mouse ergonómico inalámbrico con sensor de 26,000 DPI, 8 botones programables, batería 70h, carga rápida', precio: 59.99, categoria: 'Accesorios', stock: 40, imagen: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80' },
  { nombre: 'Alfombrilla XXL Escritorio', descripcion: 'Alfombrilla de escritorio 90x40cm, superficie de tela suave, base antideslizante, bordes cosidos', precio: 24.99, categoria: 'Accesorios', stock: 60, enOferta: true, imagen: 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?w=600&auto=format&fit=crop&q=80' },
  { nombre: 'Webcam 4K Pro', descripcion: 'Cámara web 4K con enfoque automático, micrófono estéreo, campo de visión 90°, obturador de privacidad', precio: 129.99, categoria: 'Accesorios', stock: 18, imagen: 'https://images.unsplash.com/photo-1628126235206-5260b9ea6441?w=600&auto=format&fit=crop&q=80' },
  // Muebles
  { nombre: 'Silla Ergonómica Pro', descripcion: 'Silla de oficina ergonómica con soporte lumbar ajustable, reposabrazos 4D, malla transpirable, capacidad 150kg', precio: 449.99, categoria: 'Muebles', stock: 10, imagen: 'https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?w=600&auto=format&fit=crop&q=80' },
  { nombre: 'Escritorio Eléctrico Ajustable', descripcion: 'Escritorio de pie con motor eléctrico de doble elevación, rango 72-120cm, tablero 140x70cm, capacidad 100kg', precio: 599.99, categoria: 'Muebles', stock: 6, imagen: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=600&auto=format&fit=crop&q=80' },
  { nombre: 'Soporte Monitor Dual', descripcion: 'Brazo articulado para dos monitores de hasta 32", ajuste de altura y rotación, gestión de cables integrada', precio: 89.99, categoria: 'Muebles', stock: 22, imagen: 'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=600&auto=format&fit=crop&q=80' },
  { nombre: 'Base Laptop Ajustable', descripcion: 'Soporte de laptop de aluminio con 6 ángulos ajustables, ventilación integrada, plegable para transporte', precio: 39.99, categoria: 'Muebles', stock: 35, imagen: 'https://images.unsplash.com/photo-1625766763788-95dcce9bf5ac?w=600&auto=format&fit=crop&q=80' },
  // Audio
  { nombre: 'Audífonos ANC Premium', descripcion: 'Audífonos over-ear con cancelación de ruido activa híbrida, 40h batería, codec LDAC, plegables', precio: 199.99, categoria: 'Audio', stock: 20, imagen: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80' },
  { nombre: 'Bocina Bluetooth Portátil', descripcion: 'Bocina inalámbrica resistente al agua IP67, sonido 360°, 20h batería, emparejamiento estéreo', precio: 89.99, categoria: 'Audio', stock: 25, enOferta: true, imagen: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=80' },
  { nombre: 'Micrófono Condenser USB', descripcion: 'Micrófono de condensador para streaming y podcast, patrón cardioide, ganancia ajustable, monitor en tiempo real', precio: 129.99, categoria: 'Audio', stock: 14, imagen: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&auto=format&fit=crop&q=80' },
  { nombre: 'SoundBar Escritorio', descripcion: 'Barra de sonido compacta para escritorio, Bluetooth 5.3, USB-C, ecualizador integrado, 30W RMS', precio: 79.99, categoria: 'Audio', stock: 28, imagen: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80' },
  // Periféricos
  { nombre: 'Hub USB-C 12 en 1', descripcion: 'Hub multipuerto con HDMI 4K, Ethernet Gigabit, 3x USB-A, lector SD/TF, audio 3.5mm, PD 100W', precio: 49.99, categoria: 'Periféricos', stock: 45, imagen: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=600&auto=format&fit=crop&q=80' },
  { nombre: 'Tableta Gráfica Profesional', descripcion: 'Tableta de dibujo con lápiz sin batería, 8192 niveles de presión, área activa 10x6", atajos personalizables', precio: 199.99, categoria: 'Periféricos', stock: 12, imagen: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=600&auto=format&fit=crop&q=80' },
  { nombre: 'Lector de Huellas USB', descripcion: 'Lector biométrico con cifrado AES-256, compatible con Windows Hello, plug-and-play, aluminio', precio: 39.99, categoria: 'Periféricos', stock: 33, imagen: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&auto=format&fit=crop&q=80' },
  { nombre: 'Estación de Carga Múltiple', descripcion: 'Cargador USB-C con 6 puertos (65W total), carga rápida PD 3.0, GaN, indicadores LED, protección contra sobretensión', precio: 49.99, categoria: 'Periféricos', stock: 50, enOferta: true, imagen: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80' },
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
        imagen: p.imagen || `https://placehold.co/400x300/1a1a2e/ffffff?text=${encodeURIComponent(p.nombre.split(' ').slice(0, 2).join('+'))}`,
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
