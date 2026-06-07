import { NextResponse } from "next/server";
import sql from "@/lib/db";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { title, content } = await req.json();
  const result = await sql`
    UPDATE notes
    SET title = ${title}, content = ${content}
    WHERE id = ${params.id}
    RETURNING *
  `;
  return NextResponse.json(result[0]);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  await sql`DELETE FROM notes WHERE id = ${params.id}`;
  return NextResponse.json({ success: true });
}