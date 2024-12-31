import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';
import { serialize } from 'cookie'; // Correct import for the `cookie` library

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { name, password } = req.body;

      // Validate input
      if (!name || !password) {
        return res.status(400).json({ error: 'Name and password are required.' });
      }

      // Query database for user
      const [rows]: any = await db.query(
        'SELECT * FROM users WHERE name = ? AND password = ?',
        [name, password]
      );

      // Check if user exists
      if (Array.isArray(rows) && rows.length > 0) {
        const user = rows[0];

        // Set cookie
        const serializedCookie = serialize('user', String(user.name), {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production', // Secure only in production
          sameSite: 'strict',
          path: '/',
        });
        res.setHeader('Set-Cookie', serializedCookie);

        // Respond with success message
        return res.status(200).json({
          message: user.id === 1 ? 'Hello Admin!' : `Hello, ${user.name}!`,
        });
      } else {
        // Respond with invalid credentials error
        return res.status(401).json({ error: 'Invalid credentials.' });
      }
    } catch (error) {
      console.error('Error during login:', error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  } else {
    // Respond with method not allowed
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed.` });
  }
}