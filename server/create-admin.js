import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

dotenv.config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '.env') });

import Usuario from './src/models/Usuario.js';

async function createAdmin() {
  await mongoose.connect(process.env.MONGODB_URI);
  const existe = await Usuario.findOne({ email: 'josegomezxc14@gmail.com' });
  if (existe) {
    console.log('El usuario ya existe');
    process.exit(0);
  }
  await Usuario.create({
    nombre: 'jose',
    email: 'josegomezxc14@gmail.com',
    password: '123456',
    rol: 'admin'
  });
  console.log('Admin jose creado exitosamente');
  process.exit(0);
}

createAdmin().catch(err => { console.error(err); process.exit(1); });
