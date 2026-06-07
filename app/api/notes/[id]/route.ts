import { NextResponse } from "next/server";
import sql from "@/lib/db";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { title, content } = await req.json();
  const result = await sql`
    UPDATE notes
    SET title = ${title}, content = ${content}
    WHERE id = ${id}
    RETURNING *
  `;
  return NextResponse.json(result[0]);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await sql`DELETE FROM notes WHERE id = ${id}`;
  return NextResponse.json({ success: true });
}