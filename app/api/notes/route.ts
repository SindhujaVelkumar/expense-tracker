import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import sql from "@/lib/db";

export async function GET() {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await sql`
    CREATE TABLE IF NOT EXISTS notes (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL DEFAULT 'Untitled',
      content TEXT NOT NULL DEFAULT '',
      user_email TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  // Add user_email column if it doesn't exist (for existing tables)
  await sql`
    ALTER TABLE notes ADD COLUMN IF NOT EXISTS user_email TEXT NOT NULL DEFAULT ''
  `;

  const notes = await sql`
    SELECT * FROM notes 
    WHERE user_email = ${session.user.email}
    ORDER BY created_at DESC
  `;
  return NextResponse.json(notes);
}

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, content } = await req.json();
  const result = await sql`
    INSERT INTO notes (title, content, user_email)
    VALUES (${title}, ${content}, ${session.user.email})
    RETURNING *
  `;
  return NextResponse.json(result[0]);
}