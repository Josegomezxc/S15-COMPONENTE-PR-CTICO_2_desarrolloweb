import { body } from 'express-validator';

export const validarProducto = [
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),
  body('descripcion')
    .notEmpty().withMessage('La descripción es obligatoria'),
  body('precio')
    .notEmpty().withMessage('El precio es obligatorio')
    .isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo'),
  body('categoria')
    .notEmpty().withMessage('La categoría es obligatoria')
    .isMongoId().withMessage('Categoría no válida'),
  body('stock')
    .notEmpty().withMessage('El stock es obligatorio')
    .isInt({ min: 0 }).withMessage('El stock debe ser un número entero positivo')
];
