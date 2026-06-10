import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import sql from "@/lib/db";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { title, content } = await req.json();
  const result = await sql`
    UPDATE notes
    SET title = ${title}, content = ${content}
    WHERE id = ${id} AND user_email = ${session.user.email}
    RETURNING *
  `;
  return NextResponse.json(result[0]);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await sql`
    DELETE FROM notes 
    WHERE id = ${id} AND user_email = ${session.user.email}
  `;
  return NextResponse.json({ success: true });
}