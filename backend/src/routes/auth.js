import express from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { User } from '../models/User.js';

export const authRouter = express.Router();

// Validacion de entrada para el registro de usuarios
const registerSchema = z.object({
  name: z.string().trim().min(1, 'Nombre es requerido'),
  email: z.string().trim().email('Correo electrónico inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

authRouter.post('/register', async (req, res, next) => {
  try {
    const validation = registerSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({ error: validation.error.issues[0]?.message || 'Invalid input' });
    }

    const { name, email, password } = validation.data;

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Hash de la contraseña antes de guardar el usuario
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });

    // Retornar datos del usuario sin el hash de la contraseña
    return res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    return next(error);
  }
});
