import { NextResponse } from "next/server";
import sql from "@/lib/db";

export async function GET() {
  await sql`
    CREATE TABLE IF NOT EXISTS notes (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL DEFAULT 'Untitled',
      content TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  const notes = await sql`SELECT * FROM notes ORDER BY created_at DESC`;
  return NextResponse.json(notes);
}

export async function POST(req: Request) {
  const { title, content } = await req.json();
  const result = await sql`
    INSERT INTO notes (title, content)
    VALUES (${title}, ${content})
    RETURNING *
  `;
  return NextResponse.json(result[0]);
}