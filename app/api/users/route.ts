import { NextResponse } from 'next/server';
import db from '@/lib/db'; // Adjust the import path if necessary

// Handle GET requests
export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM users'); // Replace 'users' with your table name
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

// Optionally, handle POST or other methods
export async function POST(request: Request) {
  try {
    const data = await request.json(); // Parse the JSON body from the request
    const { name, email } = data; // Example data fields
    await db.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);

    return NextResponse.json({ message: 'User created successfully!' }, { status: 201 });
  } catch (error) {
    console.error('Error processing POST request:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}