import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';
import { RowDataPacket } from 'mysql2'; // If you're using mysql2

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ message: 'Name is required.' });
    }

    try {
      const query = `
        SELECT MAX(date) AS latest_date
        FROM payments
        WHERE name = ?
      `;

      const [rows] = await db.query<RowDataPacket[]>(query, [name]);

      const latestDate = (rows[0] as { latest_date: string | null })?.latest_date || null;

      return res.status(200).json({ latest_date: latestDate });
    } catch (error) {
      console.error('Error fetching latest payment date:', error);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  } else if (req.method === 'POST') {
    const { name, date, amount } = req.body;

    if (!name || !date || !amount) {
      return res.status(400).json({ message: 'All fields (name, date, amount) are required.' });
    }

    try {
      const query = `
        INSERT INTO payments (name, date, amount)
        VALUES (?, ?, ?)
      `;
      const values = [name, date, amount];
      await db.query(query, values);

      return res.status(201).json({ message: 'Payment saved successfully.' });
    } catch (error) {
      console.error('Error inserting payment:', error);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed.' });
  }
}