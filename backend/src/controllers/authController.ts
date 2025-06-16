import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { createUser, findUserByEmail } from '../db/queries';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  username : z.string().min(8)
});
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
export const register = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    console.log(process.env.DATABASE_URL);
    const { email, password , username} = registerSchema.parse(req.body);
    const [existingUser] = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [user] = await createUser(email, hashedPassword,username);

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.status(201).json({ message: 'User registered', user: { id: user.id, email: user.email } });
  } catch (error) {
     console.error(error);
    res.status(400).json({ error: 'Invalid input' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const [user] = await findUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.json({ message: 'Logged in', user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Invalid input' });
  }
};