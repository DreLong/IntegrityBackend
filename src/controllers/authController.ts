import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db';
import { User } from '../models/User';

const jwtSecret = process.env.JWT_SECRET || 'temporarySecret';

export const signup = async (req: Request, res: Response): Promise<void> => {
  const { phoneNumber, firstName, lastName, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    res.status(400).json({ message: 'Passwords do not match' });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await pool.query(
      `INSERT INTO users (phoneNumber, firstName, lastName, email, password)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [phoneNumber, firstName, lastName, email, hashedPassword]
    );

    res.status(201).json(newUser.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error registering user' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { phoneNumber, password } = req.body;

  try {
    const user = await pool.query(`SELECT * FROM users WHERE phoneNumber = $1`, [phoneNumber]);

    if (user.rowCount === 0 || !await bcrypt.compare(password, user.rows[0].password)) {
      res.status(400).json({ message: 'Invalid phone number or password' });
      return;
    }

    const token = jwt.sign({ id: user.rows[0].id }, jwtSecret, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
};
