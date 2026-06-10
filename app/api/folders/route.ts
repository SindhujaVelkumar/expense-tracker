import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import sql from "@/lib/db";

export async function GET() {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await sql`
    CREATE TABLE IF NOT EXISTS folders (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      color TEXT NOT NULL DEFAULT '#6366f1',
      user_email TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    ALTER TABLE notes ADD COLUMN IF NOT EXISTS folder_id INTEGER REFERENCES folders(id) ON DELETE SET NULL
  `;

  const folders = await sql`
    SELECT * FROM folders
    WHERE user_email = ${session.user.email}
    ORDER BY created_at ASC
  `;
  return NextResponse.json(folders);
}

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, color } = await req.json();
  const result = await sql`
    INSERT INTO folders (name, color, user_email)
    VALUES (${name}, ${color ?? '#6366f1'}, ${session.user.email})
    RETURNING *
  `;
  return NextResponse.json(result[0]);
}

export async function DELETE(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();
  await sql`
    DELETE FROM folders
    WHERE id = ${id} AND user_email = ${session.user.email}
  `;
  return NextResponse.json({ success: true });
}