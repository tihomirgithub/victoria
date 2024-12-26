import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';
import * as bcrypt from 'bcryptjs';

// Define the user interface
interface User {
  id: number;
  name: string;
  password: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, password } = req.body as { name: string; password: string };

  if (!name || !password) {
    return res.status(400).json({ error: 'Name and password are required' });
  }

  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'nextjs_db',
    });

    const [rows] = await connection.execute(
      'SELECT id, name, password FROM users WHERE name = ?',
      [name]
    );

    const users = rows as User[];

    await connection.end();

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);
   
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const role = user.id === 1 ? 'admin' : 'user';

    return res.status(200).json({ id: user.id, name: user.name, role });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}