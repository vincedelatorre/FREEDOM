/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { Pool } from "pg";

export const runtime = "nodejs";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

export async function POST(req: NextRequest) {
  const h = await headers();

  const session = await auth.api.getSession({ headers: h });
  const role = session?.user?.role ?? null;

  if (role !== "admin") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const userId: string | undefined = body?.userId;
  const nextRole: unknown = body?.role;

  if (!userId) {
    return NextResponse.json({ error: "missing_userId" }, { status: 400 });
  }

  if (typeof nextRole !== "string" || nextRole.trim().length === 0) {
    return NextResponse.json({ error: "missing_role" }, { status: 400 });
  }

  // 自分自身のロール変更を防止
  if (session?.user?.id === userId) {
    return NextResponse.json({ error: "cannot_change_own_role" }, { status: 400 });
  }

  const normalizedRole = nextRole.trim();

  const client = await pool.connect();
  try {
    await client.query(
      `
      UPDATE auth."user"
      SET role = $1
      WHERE id = $2
      `,
      [normalizedRole, userId]
    );
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("admin/users set-role failed:", e);
    return NextResponse.json(
      { error: "set_role_failed", detail: String(e) },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
