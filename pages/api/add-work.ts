import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';
import { parse } from 'cookie'; // Correct import for the `cookie` library

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { date, description } = req.body;

      // Parse cookies from the request header
      const cookies = parse(req.headers.cookie || '');
      console.log('Parsed cookies:', cookies); // Debugging
      const userName = cookies.user;

      // Check if the user is authenticated
      if (!userName) {
        return res.status(401).json({ error: 'Not authenticated. User cookie missing.' });
      }

      // Validate request payload
      if (!date || !description) {
        return res.status(400).json({ error: 'Date and description are required.' });
      }

      // Insert the work entry into the database
      await db.query(
        'INSERT INTO works (name, date, description) VALUES (?, ?, ?)',
        [userName, date, description]
      );

      res.status(200).json({ message: 'Work entry added successfully.' });
    } catch (error: unknown) {
      // Type assertion or narrowing
      if (error instanceof Error) {
        console.error('Error adding work entry:', error.message);
        res.status(500).json({ error: `Internal server error: ${error.message}` });
      } else {
        console.error('Unexpected error type:', error);
        res.status(500).json({ error: 'Internal server error.' });
      }
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Method ${req.method} not allowed.` });
  }
}