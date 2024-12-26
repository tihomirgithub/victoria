import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';
import * as bcrypt from 'bcryptjs';

// Load environment variables
require('dotenv').config();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, password } = req.body as { name: string; password: string };

  // Validate input
  if (!name || !password) {
    return res.status(400).json({ error: 'Name and password are required' });
  }

  try {
    // Connect to the database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: Number(process.env.DB_PORT || 3306),
    });

    // Check if the user already exists
    const [existingUsers] = await connection.execute(
      'SELECT id FROM users1 WHERE name = ?',
      [name]
    );

    if ((existingUsers as any[]).length > 0) {
      await connection.end();
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user
    const [result] = await connection.execute(
      'INSERT INTO users1 (name, password) VALUES (?, ?)',
      [name, hashedPassword]
    );

    await connection.end();

    // Respond with success
    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}