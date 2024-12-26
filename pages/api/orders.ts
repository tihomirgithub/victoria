import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { time, date, description, group_name } = req.body;

    if (!time || !date || !description || !group_name) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
      const query = `
        INSERT INTO orders (time, date, description, group_name)
        VALUES (?, ?, ?, ?)
      `;
      const values = [time, date, description, group_name];

      await db.query(query, values);

      return res.status(201).json({ message: 'Order created successfully.' });
    } catch (error) {
      console.error('Error inserting into orders:', error);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  } else if (req.method === 'GET') {
    try {
      const query = `
        SELECT date, group_name, description, time
        FROM orders
        ORDER BY date, group_name, time
      `;

      const [rows] = await db.query(query); // rows is the first element
      const data = rows as Array<{ date: string; group_name: string; description: string; time: string }>;

      // Group by date and group_name
      const groupedData = data.reduce((acc: any, row) => {
        const key = `${row.date}-${row.group_name}`;
        if (!acc[key]) {
          acc[key] = {
            date: new Date(row.date).toISOString().split('T')[0], // Format date as YYYY-MM-DD
            group_name: row.group_name,
            items: [],
          };
        }
        acc[key].items.push({
          description: row.description,
          time: row.time.slice(0, 5), // Format time as HH:MM
        });
        return acc;
      }, {});

      res.status(200).json(Object.values(groupedData));
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed.' });
  }
}